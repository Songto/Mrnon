"use client";

import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import {
  SIZE,
  isDark,
  legalMoves,
  type Board,
  type Color
} from "@/lib/checkers";
import { clsx } from "@/lib/clsx";

type GameState = {
  type: "checkers";
  board: Board;
  turn: Color;
  players: { r: string; b: string };
  names: { r: string; b: string };
  mustFrom: number | null;
  winner: Color | null;
} | null;

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

  // No game yet — show the start panel.
  if (!game) {
    return (
      <div className="cozy-card p-3 text-center">
        <p className="font-display text-sm">🎲 Mini-game</p>
        <p className="mt-1 text-[11px] text-cocoa-soft">Play checkers (หมากฮอส) together!</p>
        <button
          onClick={() => socket.emit("game:start")}
          disabled={playerCount < 2}
          className="mt-2 w-full rounded-full bg-strawberry px-3 py-1.5 text-xs font-display text-night transition active:scale-95 disabled:opacity-50"
        >
          Start Checkers 🔴
        </button>
        {playerCount < 2 && (
          <p className="mt-1 text-[10px] text-cocoa-soft">Share the code — needs 2 players.</p>
        )}
        {error && <p className="mt-1 text-[10px] text-strawberry">{error}</p>}
      </div>
    );
  }

  const myColor: Color | null =
    game.players.r === userId ? "r" : game.players.b === userId ? "b" : null;
  const myTurn = !game.winner && myColor != null && game.turn === myColor;

  const legal = myColor ? legalMoves(game.board, myColor, game.mustFrom) : [];
  const activeFrom = game.mustFrom != null ? game.mustFrom : selected;
  const targets = new Set(legal.filter((m) => m.from === activeFrom).map((m) => m.to));
  const movable = new Set(legal.map((m) => m.from));

  const click = (i: number) => {
    if (!myTurn || !myColor) return;
    if (activeFrom != null && targets.has(i)) {
      socket.emit("game:move", { from: activeFrom, to: i });
      setSelected(null);
      return;
    }
    if (game.mustFrom == null && movable.has(i)) setSelected(i);
  };

  const turnName = game.names[game.turn];
  const status = game.winner
    ? `${game.names[game.winner]} wins! 🏆`
    : myTurn
      ? game.mustFrom != null
        ? "Your turn — keep jumping!"
        : "Your turn"
      : `${turnName}'s turn…`;

  return (
    <div className="cozy-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-display text-sm">🔴 Checkers</p>
        <button
          onClick={() => socket.emit("game:end")}
          className="text-[11px] text-cocoa-soft hover:text-strawberry"
        >
          close ✕
        </button>
      </div>

      <p className="mb-1 text-center text-xs" style={{ color: game.winner ? "#7FB976" : undefined }}>
        {status}
      </p>
      <p className="mb-2 text-center text-[10px] text-cocoa-soft">
        You are{" "}
        {myColor === "r" ? "🔴 red" : myColor === "b" ? "⚫ black" : "spectating"} ·{" "}
        {game.names.r} 🔴 vs ⚫ {game.names.b}
      </p>

      <div className="mx-auto grid aspect-square w-full max-w-[260px] grid-cols-8 overflow-hidden rounded-lg">
        {game.board.map((p, i) => {
          const [r, c] = [Math.floor(i / SIZE), i % SIZE];
          const dark = isDark(r, c);
          const isTarget = targets.has(i);
          const isSel = activeFrom === i;
          return (
            <button
              key={i}
              onClick={() => click(i)}
              disabled={!myTurn}
              className={clsx(
                "relative flex items-center justify-center",
                dark ? "bg-[#9c6f52]" : "bg-[#f3e0cf]"
              )}
            >
              {/* move target dot */}
              {isTarget && (
                <span className="absolute h-1/3 w-1/3 rounded-full bg-sage-deep/70" />
              )}
              {/* piece */}
              {p && (
                <span
                  className={clsx(
                    "flex h-[78%] w-[78%] items-center justify-center rounded-full text-[10px] font-bold shadow",
                    isSel ? "ring-2 ring-strawberry" : ""
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
        })}
      </div>

      {game.winner && (
        <button
          onClick={() => socket.emit("game:start")}
          disabled={playerCount < 2}
          className="mt-2 w-full rounded-full bg-strawberry px-3 py-1.5 text-xs font-display text-night transition active:scale-95 disabled:opacity-50"
        >
          New game 🔄
        </button>
      )}
    </div>
  );
}
