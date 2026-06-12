"use client";

import Link from "next/link";
import { memberSlug } from "@/lib/members";
import { Avatar } from "../ui/Avatar";
import type { Seat } from "./TeaTable";

// A clean "who's in this room" bar, shown down the right side of the chat.
export function RoomMembers({ seats, meId }: { seats: Seat[]; meId?: string }) {
  // One entry per person (a member may have more than one socket/seat).
  const seen = new Set<string>();
  const people = seats.filter((s) => {
    if (seen.has(s.userId)) return false;
    seen.add(s.userId);
    return true;
  });

  return (
    <div className="cozy-card p-3">
      <p className="mb-2 flex items-center justify-between px-1 font-display text-sm">
        <span className="flex items-center gap-1.5">🪑 In this room</span>
        <span className="rounded-full bg-sage/30 px-2 py-0.5 text-[11px] text-cocoa-soft">
          {people.length}
        </span>
      </p>

      {people.length === 0 ? (
        <p className="px-1 py-3 text-xs text-cocoa-soft">No one's here yet — say hi! 🌷</p>
      ) : (
        <ul className="max-h-[60vh] space-y-0.5 overflow-y-auto chat-scroll">
          {people.map((s) => {
            const me = s.userId === meId;
            return (
              <li key={s.userId}>
                <Link
                  href={`/members/${memberSlug(s.name)}`}
                  className="flex items-center gap-2 rounded-2xl px-2 py-1.5 transition hover:bg-surface/70"
                >
                  <span className="relative shrink-0">
                    <Avatar name={s.name} src={s.avatar} size={30} />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-sage-deep" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-display">
                    {me ? "you" : s.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
