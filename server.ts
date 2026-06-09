import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { recordActivity } from "./src/lib/db";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

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

function seatsOf(room: string): Seat[] {
  return Array.from(roster.get(room)?.values() ?? []);
}

// When a room empties out, tidy up. Private rooms (anything other than the
// public lobby) vanish completely — roster AND chat history — so they truly
// "self-destruct" with no trace once the last person leaves.
function cleanupIfEmpty(room: string) {
  const seats = roster.get(room);
  if (seats && seats.size === 0) {
    roster.delete(room);
    if (room !== LOBBY) history.delete(room);
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

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || "/", true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    let current: { room: string; seat: Seat } | null = null;

    const broadcastLounge = () => io.emit("lounge", onlineUsers());

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
          cleanupIfEmpty(current.room);
        }

        const seat: Seat = { socketId: socket.id, userId, name, avatar };
        if (!roster.has(room)) roster.set(room, new Map());
        roster.get(room)!.set(socket.id, seat);
        socket.join(room);
        current = { room, seat };

        socket.emit("history", history.get(room) ?? []);
        io.to(room).emit("seats", seatsOf(room));
        broadcastLounge();
      }
    );

    socket.on("message", (payload: { text: string }) => {
      if (!current) return;
      const text = (payload?.text ?? "").toString().slice(0, 600).trim();
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
      cleanupIfEmpty(current.room);
      broadcastLounge();
      current = null;
    });
  });

  server.listen(port, () => {
    console.log(`🫖  Ourchat is steeping at http://${hostname}:${port}`);
  });
});
