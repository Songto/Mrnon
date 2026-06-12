"use client";

// The seed gacha: one roll per member per day. Collect all 10 famous seeds
// (3 regular · 3 rare · 4 legendary) to earn the Gardener badge.

import { useEffect, useState } from "react";
import { useIdentity } from "@/lib/identity";
import { SEEDS, RARITY_META, type SeedDef, type SeedRarity } from "@/lib/seeds";
import { SeedIcon } from "./SeedIcon";
import { clsx } from "@/lib/clsx";

type RollResult = {
  seed: SeedDef;
  duplicate: boolean;
  complete: boolean;
};

const RARITY_ORDER: SeedRarity[] = ["regular", "rare", "legendary"];

export function SeedGacha() {
  const { identity } = useIdentity();
  const [seeds, setSeeds] = useState<string[]>([]);
  const [canRoll, setCanRoll] = useState(false);
  const [registered, setRegistered] = useState(true);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<RollResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!identity) return;
    fetch(`/api/garden?seeds=${encodeURIComponent(identity.userId)}`)
      .then((r) => r.json())
      .then((d) => {
        setSeeds(d.seeds ?? []);
        setCanRoll(!!d.canRoll);
        setRegistered(!!d.registered);
      })
      .catch(() => {});
  }, [identity]);

  const roll = async () => {
    if (!identity || rolling) return;
    setRolling(true);
    setResult(null);
    setError(null);
    // brief capsule shake before the reveal
    await new Promise((r) => setTimeout(r, 900));
    const res = await fetch("/api/garden", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "roll", userId: identity.userId })
    })
      .then((r) => r.json())
      .catch(() => null);
    setRolling(false);
    if (res?.ok) {
      setResult({ seed: res.seed, duplicate: res.duplicate, complete: res.complete });
      setSeeds(res.seeds);
      setCanRoll(false);
    } else {
      setError(res?.error || "The gacha jammed — try again!");
    }
  };

  const owned = new Set(seeds);

  return (
    <div className="cozy-card p-5">
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        {/* machine + roll */}
        <div className="flex flex-col items-center text-center">
          <p className="font-display text-lg">Seed Gacha 🎰</p>
          <p className="mt-0.5 text-xs text-cocoa-soft">One free roll a day — collect all 10!</p>

          <div className={clsx("my-3 flex h-[72px] items-center justify-center text-7xl", rolling && "animate-wiggle")}>
            {rolling ? "🥚" : result ? <SeedIcon id={result.seed.id} emoji={result.seed.emoji} size={72} /> : "🌰"}
          </div>

          {result && !rolling && (
            <div
              className="animate-pop mb-2 w-full rounded-2xl border-2 px-3 py-2"
              style={{
                borderColor: RARITY_META[result.seed.rarity].color,
                background: `${RARITY_META[result.seed.rarity].color}1a`
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: RARITY_META[result.seed.rarity].color }}>
                {RARITY_META[result.seed.rarity].label}
                {result.seed.rarity === "legendary" && " ✨"}
              </p>
              <p className="flex items-center justify-center gap-1.5 font-display">
                <SeedIcon id={result.seed.id} emoji={result.seed.emoji} size={20} /> {result.seed.name}
                {result.duplicate && <span className="text-xs text-cocoa-soft"> (duplicate)</span>}
              </p>
              <p className="text-[11px] text-cocoa-soft">{result.seed.blurb}</p>
              {result.complete && (
                <p className="mt-1 text-xs font-display text-sage-deep">
                  Collection complete — Gardener badge earned! 🌱
                </p>
              )}
            </div>
          )}

          <button
            onClick={roll}
            disabled={!identity || !canRoll || rolling || !registered}
            className="w-full rounded-full bg-strawberry px-4 py-2 text-sm font-display text-night shadow-cozy transition active:scale-95 disabled:opacity-50"
          >
            {rolling
              ? "Rolling…"
              : !identity
                ? "Pull up a chair first"
                : !registered
                  ? "Set up your profile first"
                  : canRoll
                    ? "Roll today's seed 🌱"
                    : "Come back tomorrow 🌙"}
          </button>
          {error && <p className="mt-2 text-xs text-strawberry">{error}</p>}

          {/* rarity legend */}
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-[10px]">
            {RARITY_ORDER.map((r) => (
              <span
                key={r}
                className="rounded-full px-2 py-0.5 font-display"
                style={{ background: `${RARITY_META[r].color}22`, color: RARITY_META[r].color }}
              >
                {RARITY_META[r].label} {Math.round(RARITY_META[r].chance * 100)}%
              </span>
            ))}
          </div>
        </div>

        {/* collection */}
        <div>
          <p className="mb-2 font-display text-sm text-cocoa-soft">
            Your collection · <span className="text-cocoa">{seeds.length}</span>/10
            {seeds.length >= 10 && " — Gardener! 🌱"}
          </p>
          <div className="grid grid-cols-5 gap-2">
            {RARITY_ORDER.flatMap((r) => SEEDS.filter((s) => s.rarity === r)).map((s) => {
              const has = owned.has(s.id);
              return (
                <div
                  key={s.id}
                  title={has ? `${s.name} (${RARITY_META[s.rarity].label}) — ${s.blurb}` : `??? (${RARITY_META[s.rarity].label})`}
                  className={clsx(
                    "flex aspect-square flex-col items-center justify-center rounded-2xl border-2 p-1 text-center transition",
                    has ? "bg-surface" : "bg-cocoa/5 opacity-70"
                  )}
                  style={{ borderColor: has ? RARITY_META[s.rarity].color : "#00000014" }}
                >
                  <span className={clsx("text-2xl sm:text-3xl", !has && "grayscale opacity-40")}>
                    {has ? <SeedIcon id={s.id} emoji={s.emoji} size={32} /> : "❓"}
                  </span>
                  <span className="mt-0.5 w-full truncate text-[9px] text-cocoa-soft">
                    {has ? s.name : "???"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
