"use client";

import { useEffect, useState } from "react";
import { useIdentity } from "@/lib/identity";
import { clsx } from "@/lib/clsx";

type Badge = { id: string; name: string; emoji: string; description: string; earned?: boolean };

export function BadgeShelf({ showProgress = true }: { showProgress?: boolean }) {
  const { identity } = useIdentity();
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const url = identity ? `/api/badges?user=${encodeURIComponent(identity.userId)}` : "/api/badges";
    fetch(url)
      .then((r) => r.json())
      .then((d) => setBadges(d.badges || []))
      .catch(() => {});
  }, [identity]);

  const earned = badges.filter((b) => b.earned).length;

  return (
    <div>
      {showProgress && identity && (
        <p className="mb-3 text-sm text-cocoa-soft">
          You've collected <span className="font-display text-cocoa">{earned}</span> of{" "}
          {badges.length} stickers 🏆
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {badges.map((b) => (
          <div
            key={b.id}
            className={clsx(
              "flex flex-col items-center rounded-cozy p-4 text-center transition",
              b.earned
                ? "bg-white/80 shadow-cozy"
                : "bg-white/30 opacity-60 grayscale"
            )}
            title={b.description}
          >
            <span className={clsx("text-4xl", b.earned && "animate-float-slow")}>{b.emoji}</span>
            <p className="mt-1 text-sm font-display">{b.name}</p>
            <p className="text-[11px] leading-tight text-cocoa-soft">{b.description}</p>
            {!b.earned && (
              <span className="mt-1 text-[10px] uppercase tracking-wide text-cocoa-soft">locked</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
