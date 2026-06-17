"use client";

// A cozy "trophy shelf" shown on a member's public profile — their earned
// medallions sitting on a little honey-lit shelf, plus a few reward stats.

import { BadgeArt } from "@/components/ui/BadgeArt";
import { CozyGlyph, type GlyphName } from "@/components/ui/CozyGlyph";
import { SeedIcon } from "@/components/garden/SeedIcon";
import { seedById } from "@/lib/seeds";
import type { AdvancedBadgeId } from "@/lib/badges";

type EarnedBadge = { id: string; name: string; emoji: string; description: string };

export function RewardsPanel({
  displayName,
  accent,
  earnedBadges,
  seeds = [],
  likes = 0,
  bare = false
}: {
  displayName: string;
  accent: string;
  earnedBadges: EarnedBadge[];
  seeds?: string[];
  likes?: number;
  /** Render without the outer card (to nest inside another card). */
  bare?: boolean;
}) {
  const ownedSeeds = seeds.filter((id) => seedById(id));
  const hasBadges = earnedBadges.length > 0;

  return (
    <div
      className={bare ? "" : "cozy-card overflow-hidden p-5"}
      style={bare ? undefined : { borderColor: `${accent}55` }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg">
          <CozyGlyph name="star" size={20} /> {displayName}&apos;s trophy shelf
        </h2>
        <span className="rounded-full bg-honey/30 px-2.5 py-0.5 text-[11px] font-display text-cocoa-soft">
          {earnedBadges.length} {earnedBadges.length === 1 ? "badge" : "badges"}
        </span>
      </div>

      {/* The shelf */}
      {hasBadges ? (
        <div className="relative rounded-2xl bg-gradient-to-b from-[#FFFBEF] to-honey/20 px-4 pb-3 pt-4">
          <div className="flex flex-wrap items-end justify-center gap-x-5 gap-y-3">
            {earnedBadges.map((b, i) => (
              <div key={b.id} className="flex w-16 flex-col items-center text-center">
                <span
                  className="badge-float"
                  style={{ animationDelay: `${i * 0.4}s` }}
                  title={`${b.name} — ${b.description}`}
                >
                  <BadgeArt id={b.id as AdvancedBadgeId} size={52} title={b.name} />
                </span>
                <span className="mt-1 w-full truncate text-[10px] font-display text-cocoa-soft">
                  {b.name}
                </span>
              </div>
            ))}
          </div>
          {/* wooden shelf lip */}
          <div className="mt-2 h-1.5 rounded-full bg-honey/60 shadow-[0_2px_5px_rgba(193,124,90,0.25)]" />
        </div>
      ) : (
        <div className="rounded-2xl bg-cocoa/[0.04] px-4 py-6 text-center">
          <CozyGlyph name="star" size={34} className="opacity-40" />
          <p className="mt-1 text-sm text-cocoa-soft">
            No trophies yet — chat, grow the garden, and collect seeds to fill the shelf.
          </p>
        </div>
      )}

      {/* Reward stats */}
      <div className="mt-3 flex flex-wrap gap-2">
        <Stat glyph="sprout" label="seeds" value={`${ownedSeeds.length}/10`} tint="#7FB976" />
        <Stat glyph="heart" label={likes === 1 ? "like" : "likes"} value={likes} tint="#FF6385" />
        <Stat glyph="ribbon" label="awards" value={earnedBadges.length} tint="#F0A848" />
      </div>

      {/* Collected seeds row */}
      {ownedSeeds.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-display text-cocoa-soft">Seed collection</p>
          <div className="flex flex-wrap gap-1.5">
            {ownedSeeds.map((id) => {
              const s = seedById(id)!;
              return (
                <span
                  key={id}
                  title={s.name}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-surface/70 shadow-cozy"
                >
                  <SeedIcon id={s.id} emoji={s.emoji} size={22} />
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  glyph,
  label,
  value,
  tint
}: {
  glyph: GlyphName;
  label: string;
  value: string | number;
  tint: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-display"
      style={{ background: `${tint}1a`, color: tint }}
    >
      <CozyGlyph name={glyph} size={15} />
      <b className="font-bold">{value}</b>
      <span className="opacity-80">{label}</span>
    </span>
  );
}
