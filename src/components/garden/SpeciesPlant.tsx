"use client";

// A parametric, self-contained SVG plant. One component draws all 10 gacha
// species across 6 growth stages, and gets lusher + more animated as its star
// level rises (duplicates → stars). No image files; crisp + theme-friendly.
//
//   stage 0–5  → stem height, leaf count, whether it has bloomed
//   stars 0–5  → petal richness, sparkles, glow aura, motion intensity

import { MAX_STARS } from "@/lib/seeds";
import { clsx } from "@/lib/clsx";

type BloomType = "rayed" | "cupped" | "layered" | "spike" | "blossom" | "clover" | "mushroom" | "bamboo";
type Species = { type: BloomType; petal: string; petal2: string; center: string; leaf: string };

const SPECIES: Record<string, Species> = {
  sunflower: { type: "rayed", petal: "#F7C948", petal2: "#E0A11F", center: "#8A5A2B", leaf: "#6FA85F" },
  daisy: { type: "rayed", petal: "#FFFFFF", petal2: "#EFE7CF", center: "#F7C948", leaf: "#7FB976" },
  tulip: { type: "cupped", petal: "#FF6E84", petal2: "#E0445F", center: "#FF9DB4", leaf: "#5E9E55" },
  rose: { type: "layered", petal: "#E0314F", petal2: "#FF6E84", center: "#FFB3C0", leaf: "#5E9E55" },
  lotus: { type: "layered", petal: "#FF8FB8", petal2: "#FFB3D0", center: "#FFF3C2", leaf: "#6FC267" },
  lavender: { type: "spike", petal: "#B3A0F0", petal2: "#7A66D9", center: "#B3A0F0", leaf: "#5E9E55" },
  sakura: { type: "blossom", petal: "#FFD0E4", petal2: "#FF9EC0", center: "#FFF3C2", leaf: "#7FB976" },
  clover: { type: "clover", petal: "#6FC267", petal2: "#4E7D48", center: "#3E7A38", leaf: "#6FC267" },
  "fairy-mushroom": { type: "mushroom", petal: "#E0314F", petal2: "#B81F3B", center: "#FFF1E0", leaf: "#7FB976" },
  "lucky-bamboo": { type: "bamboo", petal: "#8FD08A", petal2: "#6FC267", center: "#3E7A38", leaf: "#6FC267" }
};

const DEFAULT: Species = { type: "rayed", petal: "#FF9DB4", petal2: "#E0445F", center: "#F7C948", leaf: "#7FB976" };

function Sparkle({ x, y, s, delay = 0 }: { x: number; y: number; s: number; delay?: number }) {
  return (
    <path
      className="sp-twinkle"
      style={{ animationDelay: `${delay}s` }}
      d={`M${x},${y - s} Q${x + s * 0.25},${y - s * 0.25} ${x + s},${y} Q${x + s * 0.25},${y + s * 0.25} ${x},${y + s} Q${x - s * 0.25},${y + s * 0.25} ${x - s},${y} Q${x - s * 0.25},${y - s * 0.25} ${x},${y - s} Z`}
      fill="#FFF3C2"
    />
  );
}

// ── Bloom heads, drawn at (cx, cy) with radius r ──
function Bloom({ type, cx, cy, r, sp }: { type: BloomType; cx: number; cy: number; r: number; sp: Species }) {
  if (type === "rayed") {
    return (
      <g>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (Math.PI * 2 * i) / 12;
          const x = cx + r * Math.cos(a);
          const y = cy + r * Math.sin(a);
          return <ellipse key={i} cx={x} cy={y} rx={r * 0.5} ry={r * 0.26} fill={sp.petal} stroke={sp.petal2} strokeWidth="0.6" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />;
        })}
        <circle cx={cx} cy={cy} r={r * 0.55} fill={sp.center} stroke={sp.petal2} strokeWidth="0.8" />
      </g>
    );
  }
  if (type === "cupped") {
    return (
      <g stroke={sp.petal2} strokeWidth="0.8" strokeLinejoin="round">
        <path d={`M${cx - r} ${cy + r * 0.3} C${cx - r} ${cy - r} ${cx + r} ${cy - r} ${cx + r} ${cy + r * 0.3} C${cx + r * 0.4} ${cy + r} ${cx - r * 0.4} ${cy + r} ${cx - r} ${cy + r * 0.3} Z`} fill={sp.petal} />
        <path d={`M${cx} ${cy - r} C${cx - r * 0.5} ${cy - r * 0.3} ${cx - r * 0.5} ${cy + r * 0.4} ${cx} ${cy + r * 0.6} C${cx + r * 0.5} ${cy + r * 0.4} ${cx + r * 0.5} ${cy - r * 0.3} ${cx} ${cy - r} Z`} fill={sp.center} />
      </g>
    );
  }
  if (type === "layered") {
    return (
      <g stroke={sp.petal2} strokeWidth="0.6">
        {[1, 0.7, 0.42].map((f, i) => (
          <circle key={i} cx={cx} cy={cy} r={r * f} fill={i % 2 ? sp.petal2 : sp.petal} opacity={0.95} />
        ))}
        <circle cx={cx} cy={cy} r={r * 0.2} fill={sp.center} stroke="none" />
      </g>
    );
  }
  if (type === "spike") {
    return (
      <g>
        {Array.from({ length: 7 }).map((_, i) => (
          <circle key={i} cx={cx + (i % 2 ? 2.2 : -2.2)} cy={cy + r - i * (r / 3.2)} r={r * 0.28} fill={i % 2 ? sp.petal : sp.petal2} />
        ))}
      </g>
    );
  }
  if (type === "blossom") {
    return (
      <g>
        {[[0, 0], [-r * 0.8, r * 0.2], [r * 0.8, r * 0.2], [-r * 0.4, -r * 0.7], [r * 0.4, -r * 0.7]].map(([dx, dy], i) => (
          <g key={i}>
            {Array.from({ length: 5 }).map((_, k) => {
              const a = (Math.PI * 2 * k) / 5 - Math.PI / 2;
              return <circle key={k} cx={cx + dx + r * 0.34 * Math.cos(a)} cy={cy + dy + r * 0.34 * Math.sin(a)} r={r * 0.28} fill={sp.petal} stroke={sp.petal2} strokeWidth="0.4" />;
            })}
            <circle cx={cx + dx} cy={cy + dy} r={r * 0.18} fill={sp.center} />
          </g>
        ))}
      </g>
    );
  }
  if (type === "clover") {
    return (
      <g stroke={sp.petal2} strokeWidth="0.6">
        {[0, 90, 180, 270].map((deg) => (
          <path key={deg} d={`M${cx} ${cy} Q${cx - r * 0.5} ${cy - r} ${cx} ${cy - r * 1.05} Q${cx + r * 0.5} ${cy - r} ${cx} ${cy} Z`} fill={sp.petal} transform={`rotate(${deg} ${cx} ${cy})`} />
        ))}
      </g>
    );
  }
  if (type === "mushroom") {
    return (
      <g stroke={sp.petal2} strokeWidth="0.8" strokeLinejoin="round">
        <path d={`M${cx - r} ${cy} C${cx - r} ${cy - r * 1.2} ${cx + r} ${cy - r * 1.2} ${cx + r} ${cy} Z`} fill={sp.petal} />
        <circle cx={cx - r * 0.4} cy={cy - r * 0.5} r={r * 0.16} fill={sp.center} stroke="none" />
        <circle cx={cx + r * 0.3} cy={cy - r * 0.4} r={r * 0.2} fill={sp.center} stroke="none" />
        <rect x={cx - r * 0.32} y={cy} width={r * 0.64} height={r * 0.8} rx={r * 0.3} fill={sp.center} />
      </g>
    );
  }
  // bamboo handled in the stem; nothing extra here
  return null;
}

export function SpeciesPlant({
  seedId,
  stage = 0,
  stars = 0,
  size = 120,
  className
}: {
  seedId: string;
  stage?: number;
  stars?: number;
  size?: number;
  className?: string;
}) {
  const sp = SPECIES[seedId] ?? DEFAULT;
  const st = Math.max(0, Math.min(5, stage));
  const starN = Math.max(0, Math.min(MAX_STARS, stars));

  const baseY = 92;
  const stemTop = baseY - (10 + st * 11); // taller per stage
  const leafPairs = Math.min(2, Math.max(0, st - 1));
  const bloomed = st >= 3;
  const bloomR = 9 + (st - 3) * 3 + starN * 0.8; // bigger at higher stage + stars

  const swaying = starN >= 1;
  const glowing = starN >= 3;

  return (
    <svg
      viewBox="0 0 100 110"
      width={size}
      height={size}
      role="img"
      aria-label={`${seedId} plant, stage ${st}, ${starN} stars`}
      className={clsx("inline-block", className)}
    >
      <defs>
        {glowing && (
          <radialGradient id={`sp-aura-${seedId}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={sp.petal} stopOpacity={0.35} />
            <stop offset="100%" stopColor={sp.petal} stopOpacity="0" />
          </radialGradient>
        )}
      </defs>

      {/* glow aura behind a starry plant */}
      {glowing && bloomed && <circle cx="50" cy={stemTop} r={bloomR + 14} fill={`url(#sp-aura-${seedId})`} className={starN >= 5 ? "sp-pulse" : ""} />}

      {/* pot */}
      <path d="M33 78 H67 L63 98 a2 2 0 0 1-2 2 H39 a2 2 0 0 1-2-2 Z" fill="#E08A5B" stroke="#B5663B" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="31" y="73" width="38" height="8" rx="3" fill="#F0A878" stroke="#B5663B" strokeWidth="1.5" />
      <ellipse cx="50" cy="74" rx="17" ry="2.5" fill="#5A4636" opacity="0.4" />

      {/* the growing part sways from the soil */}
      <g className={swaying ? "sp-sway" : ""} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
        {st === 0 ? (
          // a single sprout poking out
          <g>
            <path d="M50 74 q-4 -6 0 -11" stroke={sp.leaf} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M50 66 C44 65 41 60 42 55 C48 55 51 60 50 66 Z" fill={sp.leaf} />
          </g>
        ) : sp.type === "bamboo" ? (
          // bamboo: segmented stalks instead of a bloom
          <g stroke={sp.center} strokeWidth="1" strokeLinejoin="round">
            {[-6, 0, 6].slice(0, 1 + Math.min(2, st - 1)).map((dx, i) => (
              <g key={i}>
                <rect x={48 + dx} y={stemTop + i * 4} width="5" height={baseY - stemTop - i * 4} rx="2" fill={sp.petal} />
                <path d={`M${50 + dx} ${stemTop + 10} h6`} stroke={sp.center} strokeWidth="1" />
                {bloomed && <path d={`M${53 + dx} ${stemTop + 6} q8 -2 11 -7 q-1 8 -11 9 Z`} fill={sp.petal2} />}
              </g>
            ))}
          </g>
        ) : (
          <g>
            {/* stem */}
            <path d={`M50 74 C52 ${(74 + stemTop) / 2} 48 ${(74 + stemTop) / 2} 50 ${stemTop}`} stroke={sp.leaf} strokeWidth="3.4" fill="none" strokeLinecap="round" />
            {/* leaves */}
            {Array.from({ length: leafPairs }).map((_, i) => {
              const ly = baseY - 14 - i * 16;
              return (
                <g key={i}>
                  <path d={`M50 ${ly} C40 ${ly - 2} 34 ${ly - 10} 33 ${ly - 16} C43 ${ly - 14} 49 ${ly - 7} 50 ${ly} Z`} fill={sp.leaf} />
                  <path d={`M50 ${ly + 6} C60 ${ly + 4} 66 ${ly - 4} 67 ${ly - 10} C57 ${ly - 8} 51 ${ly - 1} 50 ${ly + 6} Z`} fill={sp.leaf} />
                </g>
              );
            })}
            {/* bud or bloom */}
            {bloomed ? (
              <Bloom type={sp.type} cx={50} cy={stemTop} r={bloomR} sp={sp} />
            ) : (
              <ellipse cx="50" cy={stemTop} rx="5" ry="8" fill={sp.petal} stroke={sp.petal2} strokeWidth="0.8" />
            )}
          </g>
        )}
      </g>

      {/* sparkles: one per star, only once it has some sparkle */}
      {starN >= 2 &&
        [
          [26, 40, 3.2],
          [74, 34, 2.6],
          [70, 60, 2.2],
          [30, 64, 2.4],
          [50, 22, 3]
        ]
          .slice(0, Math.max(0, starN))
          .map(([x, y, s], i) => <Sparkle key={i} x={x} y={y} s={s} delay={i * 0.5} />)}
    </svg>
  );
}
