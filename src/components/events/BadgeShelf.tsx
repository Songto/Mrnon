"use client";

// The quest board: 9 website quests with live progress bars, plus the 5
// advanced badges (Ourchat, Secret, Gardener, Cutefactor, Famous) on top.

import { useEffect, useState } from "react";
import { useIdentity } from "@/lib/identity";
import { clsx } from "@/lib/clsx";
import { BadgeArt } from "@/components/ui/BadgeArt";
import type { AdvancedBadgeId } from "@/lib/badges";

type Quest = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  current: number;
  target: number;
  done: boolean;
};
type Advanced = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  granted: boolean;
  locked: boolean;
  earned: boolean;
};

export function BadgeShelf({ showProgress = true }: { showProgress?: boolean }) {
  const { identity } = useIdentity();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [advanced, setAdvanced] = useState<Advanced[]>([]);
  const [likes, setLikes] = useState(0);
  const [seedCount, setSeedCount] = useState(0);

  useEffect(() => {
    if (!identity) return;
    fetch(`/api/badges?user=${encodeURIComponent(identity.userId)}`)
      .then((r) => r.json())
      .then((d) => {
        setQuests(d.quests || []);
        setAdvanced(d.advanced || []);
        setLikes(d.likes || 0);
        setSeedCount(d.seeds || 0);
      })
      .catch(() => {});
  }, [identity]);

  const done = quests.filter((q) => q.done).length;

  return (
    <div className="space-y-6">
      {/* Advanced badges */}
      <div>
        <p className="mb-2 font-display text-sm text-cocoa-soft">Special badges ✨</p>
        <div className="flex flex-wrap gap-3">
          {advanced.map((b) => (
            <div
              key={b.id}
              title={b.description}
              className={clsx(
                "flex w-[120px] flex-col items-center rounded-cozy border p-3 text-center transition",
                b.earned
                  ? "border-honey/70 bg-gradient-to-b from-surface to-honey/20 shadow-cozy"
                  : "border-cocoa/10 bg-surface/40 opacity-60 grayscale"
              )}
            >
              <BadgeArt
                id={b.id as AdvancedBadgeId}
                size={56}
                title={b.name}
                className={clsx(b.earned && "animate-float-slow")}
              />
              <p className="mt-1 text-sm font-display">{b.name}</p>
              <p className="text-[10px] leading-tight text-cocoa-soft">
                {b.locked
                  ? "Coming soon"
                  : b.granted
                    ? "Granted by the hosts"
                    : b.id === "famous"
                      ? `${likes}/500 likes`
                      : b.id === "gardener"
                        ? `${seedCount}/10 seeds`
                        : `${done}/9 quests`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quests */}
      <div>
        {showProgress && (
          <p className="mb-2 font-display text-sm text-cocoa-soft">
            Quests · <span className="text-cocoa">{done}</span>/9 complete
            {done === 9 && " — Ourchat badge earned! 🍓"}
          </p>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quests.map((q) => {
            const pct = Math.round((q.current / q.target) * 100);
            return (
              <div
                key={q.id}
                className={clsx(
                  "rounded-cozy border p-4 transition",
                  q.done
                    ? "border-sage/60 bg-surface/80 shadow-cozy"
                    : "border-cocoa/10 bg-surface/40"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={clsx("text-2xl", q.done ? "" : "opacity-60 grayscale")}>
                    {q.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-display">
                      {q.name} {q.done && "✓"}
                    </p>
                    <p className="truncate text-[11px] text-cocoa-soft" title={q.description}>
                      {q.description}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-cocoa/10">
                    <div
                      className={clsx(
                        "h-full rounded-full transition-all",
                        q.done ? "bg-sage-deep" : "bg-strawberry"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-[11px] text-cocoa-soft">
                    {q.current}/{q.target}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
