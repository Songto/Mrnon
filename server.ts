import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { recordActivity, initStore, flushStore } from "./src/lib/db";
import {
  initialBoard,
  legalMoves,
  applyMove,
  winnerIfOver,
  other as otherColor,
  type Board,
  type Color
} from "./src/lib/checkers";
import {
  oInitialBoard,
  oLegalMoves,
  oApplyMove,
  oOther,
  oIsOver,
  oWinner,
  type OBoard,
  type OColor
} from "./src/lib/othello";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// NextAuth needs NEXTAUTH_URL to build OAuth redirect URLs. If it isn't set
// explicitly, fall back to the public URL the host provides automatically
// (Render sets RENDER_EXTERNAL_URL). Without this, OAuth redirect_uri can
// wrongly default to http://localhost:3000 in production.
if (!process.env.NEXTAUTH_URL) {
  const inferred =
    process.env.RENDER_EXTERNAL_URL ||
    (process.env.RENDER_EXTERNAL_HOSTNAME
      ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
      : undefined);
  if (inferred) {
    process.env.NEXTAUTH_URL = inferred;
    console.log(`🔐 NEXTAUTH_URL not set — using ${inferred}`);
  }
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// ---- In-memory chat / presence state (ephemeral by design) ----
type Seat = {
  socketId: string;
  userId: string;
  name: string;
  avatar?: string;
};
type ChatMessage = {
  id: string;
  room: string;
  userId: string;
  name: string;
  avatar?: string;
  text: string;
  ts: number;
};

// Chats keep only the most recent messages; older history is dropped so no
// room hoards a long backlog. Private (code) rooms also delete themselves
// entirely once everyone has left.
const MAX_HISTORY = 30;
const LOBBY = "lobby";
const roster = new Map<string, Map<string, Seat>>(); // room -> socketId -> seat
const history = new Map<string, ChatMessage[]>(); // room -> messages

// ---- Mini-game state, one game per private room (checkers or othello) ----
type CheckersGame = {
  type: "checkers";
  board: Board;
  turn: Color;
  players: { r: string; b: string }; // userId per colour
  names: { r: string; b: string };
  mustFrom: number | null; // mid multi-jump
  winner: Color | null;
};
type OthelloGame = {
  type: "othello";
  board: OBoard;
  turn: OColor;
  players: { b: string; w: string };
  names: { b: string; w: string };
  winner: OColor | "draw" | null;
};
type Game = CheckersGame | OthelloGame;
const games = new Map<string, Game>(); // room -> game

function seatsOf(room: string): Seat[] {
  return Array.from(roster.get(room)?.values() ?? []);
}

// Distinct human players in a room (by userId), in seat order.
function playersOf(room: string): Seat[] {
  const seen = new Set<string>();
  const out: Seat[] = [];
  for (const seat of seatsOf(room)) {
    if (!seen.has(seat.userId)) {
      seen.add(seat.userId);
      out.push(seat);
    }
  }
  return out;
}

// When a room empties out, tidy up. Private rooms (anything other than the
// public lobby) vanish completely — roster AND chat history — so they truly
// "self-destruct" with no trace once the last person leaves.
function cleanupIfEmpty(room: string) {
  const seats = roster.get(room);
  if (seats && seats.size === 0) {
    roster.delete(room);
    if (room !== LOBBY) {
      history.delete(room);
      games.delete(room);
    }
  }
}

// Unique humans currently online across all rooms (by userId).
function onlineUsers(): { userId: string; name: string; avatar?: string }[] {
  const seen = new Map<string, { userId: string; name: string; avatar?: string }>();
  for (const room of roster.values()) {
    for (const seat of room.values()) {
      if (!seen.has(seat.userId)) {
        seen.set(seat.userId, { userId: seat.userId, name: seat.name, avatar: seat.avatar });
      }
    }
  }
  return Array.from(seen.values());
}

app.prepare().then(async () => {
  // Load the persisted store (database when DATABASE_URL is set, else the
  // local file) before we start accepting connections.
  await initStore();

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || "/", true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(server, {
    cors: { origin: "*" }
  });

  // End a room's game if one of its two players has left.
  function endGameIfPlayerGone(room: string) {
    const g = games.get(room);
    if (!g) return;
    const ids = new Set(playersOf(room).map((p) => p.userId));
    if (Object.values(g.players).some((uid) => !ids.has(uid))) {
      games.delete(room);
      io.to(room).emit("game:state", null);
    }
  }

  io.on("connection", (socket) => {
    let current: { room: string; seat: Seat } | null = null;

    const broadcastLounge = () => io.emit("lounge", onlineUsers());

    // Tell the freshly-connected client who's online right now (e.g. the
    // homepage "top members" widget needs this without joining a room).
    socket.emit("lounge", onlineUsers());

    socket.on(
      "join",
      (payload: { room: string; userId: string; name: string; avatar?: string }) => {
        const { room, userId, name, avatar } = payload;
        if (!room || !name) return;

        // Leave any previous room first.
        if (current) {
          const prev = roster.get(current.room);
          prev?.delete(socket.id);
          socket.leave(current.room);
          io.to(current.room).emit("seats", seatsOf(current.room));
          endGameIfPlayerGone(current.room);
          cleanupIfEmpty(current.room);
        }

        const seat: Seat = { socketId: socket.id, userId, name, avatar };
        if (!roster.has(room)) roster.set(room, new Map());
        roster.get(room)!.set(socket.id, seat);
        socket.join(room);
        current = { room, seat };

        socket.emit("history", history.get(room) ?? []);
        io.to(room).emit("seats", seatsOf(room));
        // Bring a joining player up to speed on any ongoing game.
        if (games.has(room)) socket.emit("game:state", games.get(room));
        broadcastLounge();
      }
    );

    // ---- Mini-games: Checkers & Othello ----
    socket.on("game:start", (payload?: { gameType?: "checkers" | "othello" }) => {
      if (!current || current.room === LOBBY) return;
      const players = playersOf(current.room);
      if (players.length < 2) {
        socket.emit("game:error", "Need two people in the room to play.");
        return;
      }
      const me = current.seat;
      const opp = players.find((p) => p.userId !== me.userId)!;
      const type = payload?.gameType === "othello" ? "othello" : "checkers";
      // The starter goes first (red in checkers, black in othello).
      const game: Game =
        type === "othello"
          ? {
              type: "othello",
              board: oInitialBoard(),
              turn: "b",
              players: { b: me.userId, w: opp.userId },
              names: { b: me.name, w: opp.name },
              winner: null
            }
          : {
              type: "checkers",
              board: initialBoard(),
              turn: "r",
              players: { r: me.userId, b: opp.userId },
              names: { r: me.name, b: opp.name },
              mustFrom: null,
              winner: null
            };
      games.set(current.room, game);
      io.to(current.room).emit("game:state", game);
    });

    socket.on("game:move", (payload: { from?: number; to: number }) => {
      if (!current) return;
      const game = games.get(current.room);
      if (!game || game.winner) return;
      const userId = current.seat.userId;

      if (game.type === "checkers") {
        const myColor: Color | null =
          game.players.r === userId ? "r" : game.players.b === userId ? "b" : null;
        if (!myColor || myColor !== game.turn || payload.from == null) return;
        const legal = legalMoves(game.board, myColor, game.mustFrom);
        const move = legal.find((m) => m.from === payload.from && m.to === payload.to);
        if (!move) return;
        const res = applyMove(game.board, move);
        if (!res) return;
        game.board = res.board;
        if (res.continueFrom != null) {
          game.mustFrom = res.continueFrom;
        } else {
          game.mustFrom = null;
          game.turn = otherColor(myColor);
          game.winner = winnerIfOver(game.board, game.turn);
        }
      } else {
        // othello
        const myColor: OColor | null =
          game.players.b === userId ? "b" : game.players.w === userId ? "w" : null;
        if (!myColor || myColor !== game.turn) return;
        const legal = oLegalMoves(game.board, myColor);
        const move = legal.find((m) => m.to === payload.to);
        if (!move) return;
        game.board = oApplyMove(game.board, move, myColor);
        const opp = oOther(myColor);
        if (oLegalMoves(game.board, opp).length > 0) {
          game.turn = opp; // opponent plays
        } else if (oLegalMoves(game.board, myColor).length > 0) {
          game.turn = myColor; // opponent passes, you go again
        }
        if (oIsOver(game.board)) game.winner = oWinner(game.board);
      }
      // A finished game counts toward the "Game Night" quest for both players.
      if (game.winner) {
        try {
          for (const [color, uid] of Object.entries(game.players)) {
            const name = (game.names as Record<string, string>)[color] || "Player";
            recordActivity(uid, name, "gameFinished");
          }
        } catch {
          /* best-effort */
        }
      }
      io.to(current.room).emit("game:state", game);
    });

    socket.on("game:end", () => {
      if (!current) return;
      games.delete(current.room);
      io.to(current.room).emit("game:state", null);
    });

    socket.on("message", (payload: { text: string }) => {
      if (!current) return;
      const text = (payload?.text ?? "").toString().slice(0, 300).trim();
      if (!text) return;

      const msg: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        room: current.room,
        userId: current.seat.userId,
        name: current.seat.name,
        avatar: current.seat.avatar,
        text,
        ts: Date.now()
      };

      const buf = history.get(current.room) ?? [];
      buf.push(msg);
      if (buf.length > MAX_HISTORY) buf.shift();
      history.set(current.room, buf);

      io.to(current.room).emit("message", msg);

      // Activity grows your garden plant + may earn badges.
      try {
        const result = recordActivity(current.seat.userId, current.seat.name, "message");
        if (result.newBadges.length) {
          socket.emit("badges", result.newBadges);
        }
      } catch {
        /* persistence is best-effort */
      }
    });

    socket.on("typing", (isTyping: boolean) => {
      if (!current) return;
      socket.to(current.room).emit("typing", {
        userId: current.seat.userId,
        name: current.seat.name,
        isTyping: Boolean(isTyping)
      });
    });

    socket.on("disconnect", () => {
      if (!current) return;
      const room = roster.get(current.room);
      room?.delete(socket.id);
      io.to(current.room).emit("seats", seatsOf(current.room));
      endGameIfPlayerGone(current.room);
      cleanupIfEmpty(current.room);
      broadcastLounge();
      current = null;
    });
  });

  server.listen(port, () => {
    console.log(`🫖  Ourchat is steeping at http://${hostname}:${port}`);
  });

  // Flush any pending database save before the host stops us (e.g. redeploy).
  const shutdown = async (signal: string) => {
    try {
      await flushStore();
    } finally {
      console.log(`\n🫖  Ourchat shutting down (${signal}).`);
      process.exit(0);
    }
  };
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
});
