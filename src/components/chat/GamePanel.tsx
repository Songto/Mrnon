"use client";

import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { isDark, legalMoves, type Board, type Color } from "@/lib/checkers";
import { oLegalMoves, oCounts, type OBoard, type OColor } from "@/lib/othello";
import { clsx } from "@/lib/clsx";

type CheckersState = {
  type: "checkers";
  board: Board;
  turn: Color;
  players: { r: string; b: string };
  names: { r: string; b: string };
  mustFrom: number | null;
  winner: Color | null;
};
type OthelloState = {
  type: "othello";
  board: OBoard;
  turn: OColor;
  players: { b: string; w: string };
  names: { b: string; w: string };
  winner: OColor | "draw" | null;
};
type GameState = CheckersState | OthelloState | null;

export function GamePanel({
  socket,
  userId,
  playerCount
}: {
  socket: Socket | null;
  userId?: string;
  playerCount: number;
}) {
  const [game, setGame] = useState<GameState>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;
    const onState = (g: GameState) => {
      setGame(g);
      setSelected(null);
      setError(null);
    };
    const onError = (e: string) => setError(e);
    socket.on("game:state", onState);
    socket.on("game:error", onError);
    return () => {
      socket.off("game:state", onState);
      socket.off("game:error", onError);
    };
  }, [socket]);

  if (!socket) return null;

  // ---- Picker (no active game) ----
  if (!game) {
    return (
      <div className="cozy-card p-3 text-center">
        <p className="font-display text-sm">🎲 Mini-games</p>
        <p className="mt-1 text-[11px] text-cocoa-soft">Play a quick match together!</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => socket.emit("game:start", { gameType: "checkers" })}
            disabled={playerCount < 2}
            className="rounded-full bg-strawberry px-2 py-1.5 text-xs font-display text-night transition active:scale-95 disabled:opacity-50"
          >
            🔴 Checkers
          </button>
          <button
            onClick={() => socket.emit("game:start", { gameType: "othello" })}
            disabled={playerCount < 2}
            className="rounded-full bg-lavender px-2 py-1.5 text-xs font-display text-night transition active:scale-95 disabled:opacity-50"
          >
            ⚫⚪ Othello
          </button>
        </div>
        {playerCount < 2 && (
          <p className="mt-1 text-[10px] text-cocoa-soft">Share the code — needs 2 players.</p>
        )}
        {error && <p className="mt-1 text-[10px] text-strawberry">{error}</p>}
      </div>
    );
  }

  // ---- Shared: my colour + board orientation (each player sees their side) ----
  const myColor =
    game.type === "checkers"
      ? game.players.r === userId
        ? "r"
        : game.players.b === userId
          ? "b"
          : null
      : game.players.b === userId
        ? "b"
        : game.players.w === userId
          ? "w"
          : null;
  const myTurn = !game.winner && myColor != null && game.turn === myColor;
  const flip =
    (game.type === "checkers" && myColor === "b") || (game.type === "othello" && myColor === "w");
  const order = Array.from({ length: 64 }, (_, d) => (flip ? 63 - d : d));

  // ---- Move highlighting ----
  let targets = new Set<number>();
  let movable = new Set<number>();
  let activeFrom: number | null = null;
  if (game.type === "checkers" && myColor) {
    const legal = legalMoves(game.board, myColor as Color, game.mustFrom);
    activeFrom = game.mustFrom != null ? game.mustFrom : selected;
    targets = new Set(legal.filter((m) => m.from === activeFrom).map((m) => m.to));
    movable = new Set(legal.map((m) => m.from));
  } else if (game.type === "othello" && myColor) {
    targets = new Set(oLegalMoves(game.board, myColor as OColor).map((m) => m.to));
  }

  const click = (bi: number) => {
    if (!myTurn || !myColor) return;
    if (game.type === "checkers") {
      if (activeFrom != null && targets.has(bi)) {
        socket.emit("game:move", { from: activeFrom, to: bi });
        setSelected(null);
        return;
      }
      if (game.mustFrom == null && movable.has(bi)) setSelected(bi);
    } else {
      if (targets.has(bi)) socket.emit("game:move", { to: bi });
    }
  };

  // ---- Status line ----
  const names = game.names as Record<string, string>;
  let status: string;
  if (game.winner) {
    status = game.winner === "draw" ? "It's a draw! 🤝" : `${names[game.winner]} wins! 🏆`;
  } else if (myTurn) {
    status =
      game.type === "checkers" && game.mustFrom != null ? "Your turn — keep jumping!" : "Your turn";
  } else {
    status = `${names[game.turn]}'s turn…`;
  }

  const label =
    game.type === "checkers"
      ? `${game.names.r} 🔴 vs ⚫ ${game.names.b}`
      : (() => {
          const cnt = oCounts(game.board);
          return `${game.names.b} ⚫ ${cnt.b} · ${cnt.w} ⚪ ${game.names.w}`;
        })();
  const youAre =
    myColor === "r"
      ? "🔴 red"
      : myColor === "b"
        ? game.type === "checkers"
          ? "⚫ black"
          : "⚫ black"
        : myColor === "w"
          ? "⚪ white"
          : "spectating";

  return (
    <div className="cozy-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-display text-sm">
          {game.type === "checkers" ? "🔴 Checkers" : "⚫⚪ Othello"}
        </p>
        <button
          onClick={() => socket.emit("game:end")}
          className="text-[11px] text-cocoa-soft hover:text-strawberry"
        >
          close ✕
        </button>
      </div>

      <p className="mb-0.5 text-center text-xs" style={{ color: game.winner ? "#7FB976" : undefined }}>
        {status}
      </p>
      <p className="mb-2 text-center text-[10px] text-cocoa-soft">
        You are {youAre} · {label}
      </p>

      <div
        className={clsx(
          "mx-auto grid aspect-square w-full max-w-[330px] grid-cols-8 overflow-hidden rounded-lg",
          game.type === "othello" && "gap-px bg-[#1f5c39] p-px"
        )}
      >
        {order.map((bi) => {
          const [r, c] = [Math.floor(bi / 8), bi % 8];
          if (game.type === "checkers") {
            const p = (game.board as Board)[bi];
            const dark = isDark(r, c);
            return (
              <button
                key={bi}
                onClick={() => click(bi)}
                disabled={!myTurn}
                className={clsx(
                  "relative flex items-center justify-center",
                  dark ? "bg-[#9c6f52]" : "bg-[#f3e0cf]"
                )}
              >
                {targets.has(bi) && (
                  <span className="absolute h-1/3 w-1/3 rounded-full bg-sage-deep/70" />
                )}
                {p && (
                  <span
                    className={clsx(
                      "flex h-[78%] w-[78%] items-center justify-center rounded-full text-base font-bold shadow",
                      activeFrom === bi ? "ring-2 ring-strawberry" : ""
                    )}
                    style={{
                      background: p.c === "r" ? "#FF6385" : "#3a2a20",
                      color: p.c === "r" ? "#5a1020" : "#f0d9a0",
                      border: "2px solid rgba(255,255,255,0.55)"
                    }}
                  >
                    {p.k ? "♛" : ""}
                  </span>
                )}
              </button>
            );
          }
          // othello
          const p = (game.board as OBoard)[bi];
          return (
            <button
              key={bi}
              onClick={() => click(bi)}
              disabled={!myTurn}
              className="relative flex items-center justify-center bg-[#2f7d4f]"
            >
              {targets.has(bi) && !p && (
                <span className="absolute h-1/4 w-1/4 rounded-full bg-white/50" />
              )}
              {p && (
                <span
                  className="h-[80%] w-[80%] rounded-full shadow"
                  style={{
                    background: p === "b" ? "#1c1c1c" : "#f6f6f6",
                    border: "1px solid rgba(0,0,0,0.25)"
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {game.winner && (
        <button
          onClick={() => socket.emit("game:start", { gameType: game.type })}
          disabled={playerCount < 2}
          className="mt-2 w-full rounded-full bg-strawberry px-3 py-1.5 text-xs font-display text-night transition active:scale-95 disabled:opacity-50"
        >
          New game 🔄
        </button>
      )}
    </div>
  );
}
