"use client";

// A cozy capsule-toy (gachapon) machine, drawn as self-contained SVG so it's
// crisp at any size and theme-aware. Driven by `state`:
//   idle    — full dome, capsule resting in the tray
//   rolling — machine shakes, knob spins, a capsule tumbles into the tray
//   result  — the tray capsule pops open with a little sparkle burst
// `accent` tints the dropped capsule to the rolled seed's rarity colour.

import { clsx } from "@/lib/clsx";

// Pastel capsules floating in the glass dome (the "seeds waiting to be won").
const DOME_CAPSULES = [
  { cx: 78, cy: 60, r: 10, c: "#FF8FAE" },
  { cx: 104, cy: 50, r: 9, c: "#A9D6A0" },
  { cx: 124, cy: 66, r: 11, c: "#C9BCE0" },
  { cx: 88, cy: 82, r: 9, c: "#FBD08A" },
  { cx: 112, cy: 90, r: 10, c: "#9FD4EC" },
  { cx: 66, cy: 84, r: 8, c: "#FFC2D4" },
  { cx: 100, cy: 72, r: 7, c: "#FF8FAE" }
];

export function GachaMachine({
  state,
  accent = "#FF7E9B",
  size = 188
}: {
  state: "idle" | "rolling" | "result";
  accent?: string;
  size?: number;
}) {
  return (
    <div
      className={clsx("inline-block select-none", state === "rolling" && "gacha-shake")}
      style={{ width: size }}
    >
      <svg viewBox="0 0 200 250" width={size} height={size * 1.25} role="img" aria-label="Seed capsule machine">
        <defs>
          <radialGradient id="gm-glass" cx="0.38" cy="0.32" r="0.75">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#EAF4FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#CFE4F5" stopOpacity="0.35" />
          </radialGradient>
          <linearGradient id="gm-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF9DB4" />
            <stop offset="100%" stopColor="#FF7E9B" />
          </linearGradient>
          <radialGradient id="gm-burst" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* soft ground shadow */}
        <ellipse cx="100" cy="242" rx="64" ry="8" fill="#C17C5A" opacity="0.18" />

        {/* ── Body ── */}
        <rect x="40" y="150" width="120" height="92" rx="26" fill="url(#gm-body)" stroke="#E0617D" strokeWidth="3" />
        {/* face plate / dispense window */}
        <rect x="58" y="196" width="84" height="40" rx="14" fill="#FFF4E9" stroke="#E0617D" strokeWidth="2.5" />
        {/* tray slot */}
        <rect x="74" y="214" width="52" height="20" rx="10" fill="#3E2C1B" opacity="0.14" />

        {/* knob */}
        <g
          className={clsx(state === "rolling" && "gacha-knob")}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx="100" cy="178" r="15" fill="#FFE3EC" stroke="#E0617D" strokeWidth="2.5" />
          <rect x="97" y="166" width="6" height="24" rx="3" fill="#E0617D" />
          <rect x="88" y="175" width="24" height="6" rx="3" fill="#E0617D" />
          <circle cx="100" cy="178" r="3.2" fill="#FFF4E9" />
        </g>

        {/* ── Glass dome ── */}
        <g>
          {/* base ring the dome sits in */}
          <rect x="52" y="138" width="96" height="20" rx="9" fill="#FFD9E8" stroke="#E0617D" strokeWidth="2.5" />
          {/* capsules inside (clipped to the dome) */}
          <clipPath id="gm-dome-clip">
            <circle cx="100" cy="84" r="60" />
          </clipPath>
          <g clipPath="url(#gm-dome-clip)">
            {DOME_CAPSULES.map((c, i) => (
              <g key={i}>
                <circle cx={c.cx} cy={c.cy} r={c.r} fill={c.c} />
                <ellipse cx={c.cx - c.r * 0.3} cy={c.cy - c.r * 0.35} rx={c.r * 0.4} ry={c.r * 0.28} fill="#FFFFFF" opacity="0.6" />
              </g>
            ))}
          </g>
          {/* glass */}
          <circle cx="100" cy="84" r="60" fill="url(#gm-glass)" stroke="#CFE0EC" strokeWidth="3" />
          {/* shine */}
          <path d="M64 64 A60 60 0 0 1 108 32" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
          {/* little topper */}
          <circle cx="100" cy="24" r="6" fill="#FBD08A" stroke="#E0A33C" strokeWidth="2" />
        </g>

        {/* ── The capsule in / falling into the tray ── */}
        {state !== "idle" && (
          <g
            className={clsx(
              "gacha-capsule",
              state === "rolling" && "is-falling",
              state === "result" && "is-open"
            )}
          >
            {/* sparkle burst behind (result only) */}
            <circle className="cap-burst" cx="100" cy="221" r="30" fill="url(#gm-burst)" opacity="0" />
            {/* bottom half */}
            <path
              className="cap-bottom"
              d="M86 221 a14 14 0 0 0 28 0 Z"
              fill="#FFF4E9"
              stroke="#E0617D"
              strokeWidth="2"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            {/* top half (tinted to rarity) + its little shine dot */}
            <g className="cap-top" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <path d="M86 221 a14 14 0 0 1 28 0 Z" fill={accent} stroke="#E0617D" strokeWidth="2" />
              <circle cx="100" cy="216" r="2.4" fill="#FFFFFF" opacity="0.85" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
