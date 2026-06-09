"use client";

import { Avatar } from "../ui/Avatar";

export type Seat = { socketId: string; userId: string; name: string; avatar?: string };

// Seats arranged in a ring around a round tea table.
export function TeaTable({ seats, meId }: { seats: Seat[]; meId?: string }) {
  const shown = seats.slice(0, 10);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[260px]">
      {/* the table */}
      <div className="absolute inset-[22%] flex items-center justify-center rounded-full bg-gradient-to-br from-parchment to-rose/40 shadow-cozy-lg">
        <div className="text-center">
          <div className="animate-float-slow text-4xl">🫖</div>
          <p className="mt-1 text-[11px] font-display text-cocoa-soft">
            {seats.length} seated
          </p>
        </div>
      </div>

      {/* seats around the ring */}
      {shown.map((s, i) => {
        const angle = (i / shown.length) * Math.PI * 2 - Math.PI / 2;
        const r = 44; // percent radius
        const left = 50 + r * Math.cos(angle);
        const top = 50 + r * Math.sin(angle);
        const isMe = s.userId === meId;
        return (
          <div
            key={s.socketId}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${left}%`, top: `${top}%` }}
            title={s.name}
          >
            <div className={isMe ? "animate-float-slow" : ""}>
              <Avatar name={s.name} src={s.avatar} size={isMe ? 44 : 38} />
            </div>
            <span className="mt-0.5 max-w-[64px] truncate rounded-full bg-surface/70 px-1.5 text-[10px]">
              {isMe ? "you" : s.name}
            </span>
          </div>
        );
      })}

      {seats.length > 10 && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-surface/80 px-2 py-0.5 text-[10px]">
          +{seats.length - 10} more
        </span>
      )}
    </div>
  );
}
