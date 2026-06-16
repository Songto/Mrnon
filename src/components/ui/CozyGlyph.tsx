// Cozy hand-drawn SVG glyphs — the filled, pastel, soft-gradient look from
// BadgeArt, but as small inline motifs that replace decorative emoji. Crisp at
// any size and identical across OSes (no more Windows/Apple emoji mismatch).
//
// Add a motif to GLYPHS, then render <CozyGlyph name="teacup" />. Helper maps
// in ./glyph-maps.ts translate role / garden-stage / quest keys to a glyph name.

import { clsx } from "@/lib/clsx";
import { EMOJI_GLYPH } from "./glyph-maps";

export type GlyphName =
  // role tiers
  | "crown" | "shield" | "vipHeart" | "tulip"
  // garden growth stages
  | "acorn" | "sprout" | "leafy" | "potted" | "blossom" | "hibiscus"
  // quests + decorative
  | "teacup" | "teapot" | "chatBubble" | "moon" | "house" | "droplet"
  | "dice" | "mirror" | "strawberry" | "sparkles" | "star" | "ribbon" | "heart"
  // flowers & plants
  | "daisy" | "sunflower" | "rose" | "lotus" | "lavender" | "clover"
  | "mushroom" | "bamboo" | "tree"
  // cozy objects & ambience
  | "purpleHeart" | "orangeHeart" | "cloud" | "honey" | "fire" | "rainCloud"
  | "windChime" | "musicNote" | "coffee" | "idCard" | "memo" | "camera"
  | "envelope" | "key" | "globe" | "egg" | "contentFace" | "handshake";

// A tiny four-point sparkle, reused as a finishing accent.
function Twinkle({ x, y, s, fill = "#FFFFFF" }: { x: number; y: number; s: number; fill?: string }) {
  return (
    <path
      d={`M${x},${y - s} Q${x + s * 0.22},${y - s * 0.22} ${x + s},${y} Q${x + s * 0.22},${y + s * 0.22} ${x},${y + s} Q${x - s * 0.22},${y + s * 0.22} ${x - s},${y} Q${x - s * 0.22},${y - s * 0.22} ${x},${y - s} Z`}
      fill={fill}
    />
  );
}

// Each glyph draws inside a 0 0 32 32 box. Soft fills + a slightly darker
// outline keep them legible down to ~14px.
const GLYPHS: Record<GlyphName, (gid: string) => React.ReactNode> = {
  // ── Role tiers ──────────────────────────────────────────────────────────
  crown: () => (
    <g stroke="#C27A14" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M5 23 L7 11 L13 17 L16 8 L19 17 L25 11 L27 23 Z" fill="#FBD08A" />
      <path d="M5 23 H27 V26 a1 1 0 0 1-1 1 H6 a1 1 0 0 1-1-1 Z" fill="#F0A848" />
      <circle cx="16" cy="8" r="1.6" fill="#FFF3D6" />
      <circle cx="7" cy="11" r="1.4" fill="#FFF3D6" />
      <circle cx="25" cy="11" r="1.4" fill="#FFF3D6" />
    </g>
  ),
  shield: () => (
    <g stroke="#4A3C8C" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M16 4 L26 7 v7 c0 7-5 11-10 13 C11 25 6 21 6 14 V7 Z" fill="#B3A8F5" />
      <path d="M16 9 v13 c4-2 7-5 7-9 V9 Z" fill="#8B7DF0" stroke="none" />
      <path d="M12 14 l3 3 5-6" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  ),
  vipHeart: () => (
    <g>
      <path
        d="M16 27 C5 19 6 10 11 9 c2.5-.5 4 .8 5 2.4 1-1.6 2.5-2.9 5-2.4 5 1 6 10-5 18 Z"
        fill="#FF8FAE"
        stroke="#D9527E"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M11 14 q1.5-2 4-1.6" stroke="#FFD9E8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <Twinkle x={24} y={8} s={2.6} />
    </g>
  ),
  tulip: () => (
    <g strokeLinejoin="round">
      <path d="M16 30 C15 24 15 20 16 16" stroke="#5E9E55" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M9 24 C12 23 14 21 16 19" stroke="#5E9E55" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M11 11 C11 6 14 4 16 4 18 4 21 6 21 11 21 16 18 18 16 18 14 18 11 16 11 11 Z" fill="#FF8FAE" stroke="#D9527E" strokeWidth="1.3" />
      <path d="M16 5 v12" stroke="#D9527E" strokeWidth="1" fill="none" opacity="0.6" />
    </g>
  ),

  // ── Garden growth stages ────────────────────────────────────────────────
  acorn: () => (
    <g stroke="#7A5230" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M11 14 C11 21 13 27 16 27 19 27 21 21 21 14 Z" fill="#C99A6A" />
      <path d="M9 13 C9 9 12 7 16 7 20 7 23 9 23 13 Z" fill="#8A6244" />
      <path d="M16 7 v-3" stroke="#5E9E55" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),
  sprout: () => (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M16 28 v-11" stroke="#5E9E55" strokeWidth="2.2" fill="none" />
      <path d="M16 20 C9 19 6 14 7 9 13 9 17 13 16 20 Z" fill="#7FC974" stroke="#4E7D48" strokeWidth="1.2" />
      <path d="M16 17 C23 16 26 11 25 7 19 7 15 11 16 17 Z" fill="#9BD98F" stroke="#4E7D48" strokeWidth="1.2" />
    </g>
  ),
  leafy: () => (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M16 29 v-15" stroke="#4E7D48" strokeWidth="2.2" fill="none" />
      <path d="M16 22 C8 22 4 17 5 10 13 10 18 15 16 22 Z" fill="#7FC974" stroke="#4E7D48" strokeWidth="1.2" />
      <path d="M16 18 C24 18 28 13 27 6 19 6 14 11 16 18 Z" fill="#9BD98F" stroke="#4E7D48" strokeWidth="1.2" />
      <path d="M16 26 C11 26 8 23 8 19" stroke="#4E7D48" strokeWidth="1.4" fill="none" />
    </g>
  ),
  potted: () => (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M16 17 C16 11 16 9 16 7" stroke="#4E7D48" strokeWidth="2" fill="none" />
      <path d="M16 12 C10 11 7 7 8 3 14 3 18 7 16 12 Z" fill="#7FC974" stroke="#4E7D48" strokeWidth="1.1" />
      <path d="M16 10 C22 9 25 6 24 2 18 2 15 6 16 10 Z" fill="#9BD98F" stroke="#4E7D48" strokeWidth="1.1" />
      <circle cx="16" cy="9" r="2.2" fill="#FF8FAE" stroke="#D9527E" strokeWidth="1" />
      <path d="M9 18 H23 L21 27 a1 1 0 0 1-1 1 H12 a1 1 0 0 1-1-1 Z" fill="#E08A5B" stroke="#B5663B" strokeWidth="1.2" />
      <path d="M8 16 H24 v3 H8 Z" fill="#F0A878" stroke="#B5663B" strokeWidth="1.2" />
    </g>
  ),
  blossom: (gid) => (
    <g>
      <defs>
        <radialGradient id={`${gid}-c`} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#FFE3EC" />
          <stop offset="100%" stopColor="#FF9EB5" />
        </radialGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const x = 16 + 8 * Math.cos(a);
        const y = 16 + 8 * Math.sin(a);
        return (
          <ellipse key={i} cx={x} cy={y} rx="5.5" ry="4" fill={`url(#${gid}-c)`} stroke="#E0607F" strokeWidth="1" transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} />
        );
      })}
      <circle cx="16" cy="16" r="3.4" fill="#F7C948" stroke="#D98A1F" strokeWidth="1" />
    </g>
  ),
  hibiscus: (gid) => (
    <g>
      <defs>
        <radialGradient id={`${gid}-h`} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#FFD0C0" />
          <stop offset="100%" stopColor="#FF6E84" />
        </radialGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const x = 16 + 8.5 * Math.cos(a);
        const y = 16 + 8.5 * Math.sin(a);
        return (
          <ellipse key={i} cx={x} cy={y} rx="6" ry="4.5" fill={`url(#${gid}-h)`} stroke="#D33A55" strokeWidth="1" transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} />
        );
      })}
      <circle cx="16" cy="16" r="3" fill="#FFE3EC" stroke="#D33A55" strokeWidth="1" />
      <path d="M16 16 v6" stroke="#F7C948" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="23" r="1.4" fill="#F7C948" />
    </g>
  ),

  // ── Quests + decorative ────────────────────────────────────────────────
  teacup: () => (
    <g stroke="#B5663B" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M6 14 H24 v3 a7 7 0 0 1-7 7 h-4 a7 7 0 0 1-7-7 Z" fill="#FFF6E9" />
      <path d="M24 15 a4 4 0 0 1 0 7" fill="none" />
      <path d="M6 14 H24" fill="none" />
      <path d="M10 9 q1.5-2 0-4 M16 9 q1.5-2 0-4" stroke="#C9A88A" strokeWidth="1.3" fill="none" opacity="0.9" />
      <path d="M8 18 h8" stroke="#E7B98A" strokeWidth="1.6" />
    </g>
  ),
  teapot: () => (
    <g stroke="#B5663B" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M7 16 C7 12 11 10 16 10 21 10 25 12 25 16 24 22 21 24 16 24 11 24 8 22 7 16 Z" fill="#FF9EB5" />
      <path d="M25 14 q4 0 5 4 q-3 1-5-1" fill="#FF9EB5" />
      <path d="M5 16 q-3 1-2 4" fill="none" />
      <path d="M13 10 q3-2 6 0" fill="#FFD9E8" stroke="none" />
      <rect x="13" y="6" width="6" height="3" rx="1.5" fill="#FF8FAE" />
      <path d="M11 17 h10" stroke="#FFD9E8" strokeWidth="1.6" />
    </g>
  ),
  chatBubble: () => (
    <g stroke="#4A3C8C" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M6 7 H26 a2 2 0 0 1 2 2 v9 a2 2 0 0 1-2 2 H13 l-5 5 v-5 H6 a2 2 0 0 1-2-2 V9 a2 2 0 0 1 2-2 Z" fill="#B3A8F5" />
      <circle cx="11" cy="13.5" r="1.4" fill="#FFFFFF" stroke="none" />
      <circle cx="16" cy="13.5" r="1.4" fill="#FFFFFF" stroke="none" />
      <circle cx="21" cy="13.5" r="1.4" fill="#FFFFFF" stroke="none" />
    </g>
  ),
  moon: () => (
    <g>
      <path d="M21 6 a11 11 0 1 0 5 13 A9 9 0 0 1 21 6 Z" fill="#FBD08A" stroke="#C27A14" strokeWidth="1.3" strokeLinejoin="round" />
      <Twinkle x={24} y={8} s={2.4} fill="#FFF3D6" />
      <Twinkle x={27} y={14} s={1.6} fill="#FFF3D6" />
    </g>
  ),
  house: () => (
    <g stroke="#B5663B" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M4 15 L16 5 L28 15 Z" fill="#FF8FAE" />
      <path d="M7 15 H25 V26 a1 1 0 0 1-1 1 H8 a1 1 0 0 1-1-1 Z" fill="#FFF6E9" />
      <rect x="13.5" y="19" width="5" height="8" rx="0.8" fill="#E08A5B" />
      <circle cx="16" cy="5" r="1.6" fill="#FFD9E8" />
    </g>
  ),
  droplet: (gid) => (
    <g>
      <defs>
        <linearGradient id={`${gid}-d`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BDE8FF" />
          <stop offset="100%" stopColor="#5BB8E8" />
        </linearGradient>
      </defs>
      <path d="M16 4 C16 4 25 15 25 21 a9 9 0 0 1-18 0 C7 15 16 4 16 4 Z" fill={`url(#${gid}-d)`} stroke="#3A8BC2" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M12 20 a4 4 0 0 0 3 3.6" stroke="#FFFFFF" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  ),
  dice: () => (
    <g stroke="#C23A61" strokeWidth="1.3" strokeLinejoin="round">
      <rect x="6" y="6" width="20" height="20" rx="4" fill="#FFF6E9" />
      <circle cx="12" cy="12" r="1.8" fill="#E0517A" stroke="none" />
      <circle cx="20" cy="12" r="1.8" fill="#E0517A" stroke="none" />
      <circle cx="16" cy="16" r="1.8" fill="#E0517A" stroke="none" />
      <circle cx="12" cy="20" r="1.8" fill="#E0517A" stroke="none" />
      <circle cx="20" cy="20" r="1.8" fill="#E0517A" stroke="none" />
    </g>
  ),
  mirror: () => (
    <g stroke="#4A3C8C" strokeWidth="1.3" strokeLinejoin="round">
      <ellipse cx="16" cy="12" rx="9" ry="10" fill="#E5DEFF" />
      <ellipse cx="16" cy="12" rx="9" ry="10" fill="#B3A8F5" opacity="0.5" stroke="none" />
      <path d="M11 7 q3-3 7 0" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M13 22 v6 M19 22 v6 M11 30 h10" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),
  strawberry: () => (
    <g>
      <path d="M16 9 C23 9 25 15 25 18 25 24 20 28 16 29 12 28 7 24 7 18 7 15 9 9 16 9 Z" fill="#E0314F" stroke="#B81F3B" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M11 6 L15 9 L16 4 L17 9 L21 6 L19 10 L13 10 Z" fill="#5E9E55" stroke="#4E7D48" strokeWidth="1" strokeLinejoin="round" />
      {[[13, 15], [19, 15], [16, 19], [12, 21], [20, 21], [16, 24]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1" ry="1.5" fill="#FFD9E8" />
      ))}
    </g>
  ),
  sparkles: () => (
    <g fill="#F7C948" stroke="#D98A1F" strokeWidth="0.8" strokeLinejoin="round">
      <path d="M14 4 Q15 11 22 12 Q15 13 14 20 Q13 13 6 12 Q13 11 14 4 Z" />
      <path d="M24 17 Q24.6 21 28 21.6 Q24.6 22 24 26 Q23.4 22 20 21.6 Q23.4 21 24 17 Z" fill="#FBD08A" />
    </g>
  ),
  star: () => {
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 12 : 5;
      const a = (Math.PI * i) / 5 - Math.PI / 2;
      pts.push(`${(16 + r * Math.cos(a)).toFixed(1)},${(16 + r * Math.sin(a)).toFixed(1)}`);
    }
    return <polygon points={pts.join(" ")} fill="#FFF3C2" stroke="#D98A1F" strokeWidth="1.4" strokeLinejoin="round" />;
  },
  ribbon: () => (
    <g stroke="#C23A61" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M15 16 C7 8 2 11 4 17 6 22 13 22 15 17 Z" fill="#FF8FAE" />
      <path d="M17 16 C25 8 30 11 28 17 26 22 19 22 17 17 Z" fill="#FF8FAE" />
      <path d="M14 18 L9 28 L15 25 Z" fill="#E0517A" />
      <path d="M18 18 L23 28 L17 25 Z" fill="#E0517A" />
      <circle cx="16" cy="16" r="3.4" fill="#FFB3C8" />
    </g>
  ),
  heart: () => (
    <path
      d="M16 27 C4 18 6 9 11 8 c2.6-.5 4 .9 5 2.6 1-1.7 2.4-3.1 5-2.6 5 1 7 10-5 19 Z"
      fill="#FF6385"
      stroke="#D9527E"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  ),

  // ── Flowers & plants ────────────────────────────────────────────────────
  daisy: () => (
    <g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (Math.PI * 2 * i) / 8 - Math.PI / 2;
        const x = 16 + 8.5 * Math.cos(a);
        const y = 16 + 8.5 * Math.sin(a);
        return <ellipse key={i} cx={x} cy={y} rx="4.6" ry="2.8" fill="#FFFFFF" stroke="#E7D9A8" strokeWidth="0.9" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />;
      })}
      <circle cx="16" cy="16" r="4.2" fill="#F7C948" stroke="#D98A1F" strokeWidth="1" />
    </g>
  ),
  sunflower: () => (
    <g>
      {[...Array(12)].map((_, i) => {
        const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        const x = 16 + 9 * Math.cos(a);
        const y = 16 + 9 * Math.sin(a);
        return <ellipse key={i} cx={x} cy={y} rx="4.2" ry="2.4" fill="#F7C948" stroke="#D98A1F" strokeWidth="0.8" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />;
      })}
      <circle cx="16" cy="16" r="5.2" fill="#8A5A2B" stroke="#5E3D1C" strokeWidth="1" />
    </g>
  ),
  rose: () => (
    <g stroke="#B81F3B" strokeWidth="1.1" strokeLinejoin="round">
      <circle cx="16" cy="14" r="9" fill="#FF6E84" />
      <path d="M16 8 C12 9 11 13 13 16 M16 8 C20 9 21 13 19 16" fill="none" stroke="#D9304F" strokeWidth="1.1" />
      <circle cx="16" cy="14" r="3.4" fill="#FFB3C0" stroke="#D9304F" />
      <path d="M16 23 v6" stroke="#5E9E55" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 26 q4 -1 5 -4" fill="#5E9E55" stroke="none" />
    </g>
  ),
  lotus: () => (
    <g stroke="#D33A77" strokeWidth="1.1" strokeLinejoin="round">
      <path d="M16 24 C9 24 5 20 5 20 8 17 12 18 16 24 Z" fill="#FFB3D0" />
      <path d="M16 24 C23 24 27 20 27 20 24 17 20 18 16 24 Z" fill="#FFB3D0" />
      <path d="M16 24 C10 22 8 16 9 11 14 13 17 18 16 24 Z" fill="#FF8FB8" />
      <path d="M16 24 C22 22 24 16 23 11 18 13 15 18 16 24 Z" fill="#FF8FB8" />
      <path d="M16 25 C13 20 14 13 16 9 18 13 19 20 16 25 Z" fill="#FFD0E4" />
    </g>
  ),
  lavender: () => (
    <g>
      <path d="M16 30 C15 25 15 21 16 17" stroke="#5E9E55" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {[[16, 6], [13, 10], [19, 10], [14, 14], [18, 14], [16, 18]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="#B3A0F0" stroke="#7A66D9" strokeWidth="0.9" />
      ))}
    </g>
  ),
  clover: () => (
    <g stroke="#3E7A38" strokeWidth="1" strokeLinejoin="round">
      {[[16, 10], [10, 16], [22, 16], [16, 22]].map(([x, y], i) => (
        <path key={i} d={`M16 16 Q${x} ${y - 4} ${x} ${y} Q${x} ${y + 4} 16 16 Z`} fill="#6FC267" transform={`rotate(${i * 90} 16 16)`} />
      ))}
      <path d="M16 22 q1 4 -1 7" stroke="#3E7A38" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="16" r="1.6" fill="#3E7A38" stroke="none" />
    </g>
  ),
  mushroom: () => (
    <g stroke="#B5663B" strokeWidth="1.1" strokeLinejoin="round">
      <path d="M6 16 C6 9 11 6 16 6 21 6 26 9 26 16 Z" fill="#E0314F" stroke="#B81F3B" />
      <circle cx="11" cy="11" r="1.8" fill="#FFE3EC" stroke="none" />
      <circle cx="20" cy="12" r="2.2" fill="#FFE3EC" stroke="none" />
      <circle cx="16" cy="9" r="1.4" fill="#FFE3EC" stroke="none" />
      <path d="M12 16 h8 v8 a4 4 0 0 1-8 0 Z" fill="#FFF1E0" />
    </g>
  ),
  bamboo: () => (
    <g stroke="#3E7A38" strokeWidth="1.1" strokeLinejoin="round">
      <rect x="13" y="4" width="6" height="24" rx="2" fill="#8FD08A" />
      <path d="M13 12 H19 M13 20 H19" stroke="#3E7A38" strokeWidth="1.2" />
      <path d="M19 9 q6 -1 8 -5 q-1 6 -8 7 Z" fill="#6FC267" />
      <path d="M13 17 q-6 -1 -8 -5 q1 6 8 7 Z" fill="#6FC267" />
    </g>
  ),
  tree: () => (
    <g stroke="#3E7A38" strokeWidth="1.1" strokeLinejoin="round">
      <rect x="14" y="20" width="4" height="8" rx="1.5" fill="#9B6B43" stroke="#7A5230" />
      <circle cx="16" cy="13" r="9" fill="#6FC267" />
      <circle cx="10" cy="16" r="5.5" fill="#8FD08A" />
      <circle cx="22" cy="16" r="5.5" fill="#8FD08A" />
    </g>
  ),

  // ── Cozy objects & ambience ─────────────────────────────────────────────
  purpleHeart: () => (
    <path d="M16 27 C4 18 6 9 11 8 c2.6-.5 4 .9 5 2.6 1-1.7 2.4-3.1 5-2.6 5 1 7 10-5 19 Z" fill="#B3A0F0" stroke="#7A66D9" strokeWidth="1.3" strokeLinejoin="round" />
  ),
  orangeHeart: () => (
    <path d="M16 27 C4 18 6 9 11 8 c2.6-.5 4 .9 5 2.6 1-1.7 2.4-3.1 5-2.6 5 1 7 10-5 19 Z" fill="#F7A24B" stroke="#D9801F" strokeWidth="1.3" strokeLinejoin="round" />
  ),
  cloud: () => (
    <path d="M9 22 a6 6 0 0 1 0-12 7 7 0 0 1 13-2 5 5 0 0 1 1 14 Z" fill="#EAF2FB" stroke="#A9C2DE" strokeWidth="1.3" strokeLinejoin="round" />
  ),
  honey: () => (
    <g stroke="#C27A14" strokeWidth="1.2" strokeLinejoin="round">
      <rect x="11" y="3" width="10" height="3" rx="1" fill="#E7B96A" />
      <path d="M13 6 h6 v3 l3 3 v13 a2 2 0 0 1-2 2 H12 a2 2 0 0 1-2-2 V12 l3-3 Z" fill="#F7C948" />
      <path d="M13 17 q3 6 6 0 q3 6 0 9 H16 q-3-3 -3-9 Z" fill="#E09A1F" stroke="none" />
      <path d="M16 3 v-1" stroke="#C27A14" strokeLinecap="round" />
    </g>
  ),
  fire: () => (
    <g>
      <path d="M16 3 C20 9 24 11 24 18 a8 8 0 0 1-16 0 C8 13 11 12 12 8 c2 2 1 5 4 6 1-3 0-7 0-11 Z" fill="#FF7A3C" stroke="#E0501F" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M16 26 a4 4 0 0 1-4-4 c0-3 4-4 4-7 2 2 4 4 4 7 a4 4 0 0 1-4 4 Z" fill="#FFCB52" stroke="none" />
    </g>
  ),
  rainCloud: () => (
    <g>
      <path d="M9 19 a6 6 0 0 1 0-12 7 7 0 0 1 13-2 5 5 0 0 1 1 14 Z" fill="#D7E3F0" stroke="#94AEC9" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M11 23 l-1 4 M16 23 l-1 4 M21 23 l-1 4" stroke="#5BB8E8" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  ),
  windChime: () => (
    <g stroke="#B5663B" strokeWidth="1.1" strokeLinejoin="round">
      <path d="M9 6 q7 -4 14 0" fill="none" />
      <path d="M9 6 C9 11 11 13 16 13 21 13 23 11 23 6 Z" fill="#FF9EB5" />
      <path d="M16 13 v8" stroke="#C9A88A" strokeWidth="1" />
      <rect x="14" y="21" width="4" height="6" rx="1.2" fill="#F7C948" />
      <path d="M16 27 q3 0 4 3" fill="none" stroke="#C9A88A" strokeWidth="1" />
    </g>
  ),
  musicNote: () => (
    <g fill="#8B7DF0" stroke="#4A3C8C" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M12 22 V7 l11-2 v13" fill="none" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="9" cy="22" rx="4" ry="3" />
      <ellipse cx="20" cy="20" rx="4" ry="3" />
    </g>
  ),
  coffee: () => (
    <g stroke="#7A5230" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M6 13 H22 v5 a7 7 0 0 1-7 7 h-2 a7 7 0 0 1-7-7 Z" fill="#C68A5B" />
      <path d="M22 14 a4 4 0 0 1 0 7" fill="none" />
      <path d="M10 8 q1.5-2 0-4 M15 8 q1.5-2 0-4" stroke="#C9A88A" strokeWidth="1.3" fill="none" />
    </g>
  ),
  idCard: () => (
    <g stroke="#4E7D48" strokeWidth="1.2" strokeLinejoin="round">
      <rect x="4" y="8" width="24" height="16" rx="3" fill="#DDF0D6" />
      <circle cx="11" cy="15" r="3" fill="#7FB976" stroke="#4E7D48" />
      <path d="M7 21 a4 4 0 0 1 8 0 Z" fill="#7FB976" stroke="none" />
      <path d="M18 13 h6 M18 17 h6 M18 21 h4" stroke="#7FB976" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),
  memo: () => (
    <g stroke="#C27A14" strokeWidth="1.2" strokeLinejoin="round">
      <rect x="7" y="4" width="18" height="24" rx="2.5" fill="#FFF6E9" />
      <path d="M11 11 h10 M11 16 h10 M11 21 h6" stroke="#E7B96A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M19 24 l8-8 a2.2 2.2 0 0 0-3-3 l-8 8 -1.5 4.5 Z" fill="#FFCB52" stroke="#D98A1F" />
    </g>
  ),
  camera: () => (
    <g stroke="#4A3C8C" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M4 11 h6 l2-3 h8 l2 3 h2 a2 2 0 0 1 2 2 v11 a2 2 0 0 1-2 2 H4 a2 2 0 0 1-2-2 V13 a2 2 0 0 1 2-2 Z" fill="#B3A8F5" />
      <circle cx="16" cy="17" r="5" fill="#E5DEFF" stroke="#4A3C8C" />
      <circle cx="16" cy="17" r="2.2" fill="#8B7DF0" stroke="none" />
    </g>
  ),
  envelope: () => (
    <g stroke="#D9527E" strokeWidth="1.2" strokeLinejoin="round">
      <rect x="4" y="8" width="24" height="16" rx="2.5" fill="#FFE3EC" />
      <path d="M5 9 L16 18 L27 9" fill="none" />
      <path d="M16 18 l4 3 a6 6 0 1 0 2-2 Z" fill="#FF8FAE" stroke="none" opacity="0" />
    </g>
  ),
  key: () => (
    <g stroke="#C27A14" strokeWidth="1.3" strokeLinejoin="round">
      <circle cx="10" cy="11" r="6" fill="#F7C948" />
      <circle cx="10" cy="11" r="2.2" fill="#FFF6E9" stroke="none" />
      <path d="M14 15 L25 26 M22 23 l3 -3 M20 21 l2.5 -2.5" fill="none" strokeWidth="2" strokeLinecap="round" />
    </g>
  ),
  globe: () => (
    <g stroke="#3A8BC2" strokeWidth="1.2" strokeLinejoin="round">
      <circle cx="16" cy="16" r="11" fill="#BDE8FF" />
      <path d="M11 8 C7 14 7 18 11 24 M21 8 C25 14 25 18 21 24 M5 16 H27 M8 11 H24 M8 21 H24" fill="none" stroke="#5BB8E8" strokeWidth="1.1" />
      <path d="M10 13 q3 2 6 0 q3 -2 6 1" fill="#7FB976" stroke="#4E7D48" strokeWidth="0.8" opacity="0.8" />
    </g>
  ),
  egg: () => (
    <path d="M16 4 C21 4 24 13 24 19 a8 8 0 0 1-16 0 C8 13 11 4 16 4 Z" fill="#FFF6E9" stroke="#E7B96A" strokeWidth="1.3" strokeLinejoin="round" />
  ),
  contentFace: () => (
    <g stroke="#D98A1F" strokeWidth="1.2">
      <circle cx="16" cy="16" r="11" fill="#FFE0A8" />
      <path d="M11 15 q1.5 -2 3 0 M18 15 q1.5 -2 3 0" fill="none" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 20 q4 3 8 0" fill="none" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9" cy="19" r="1.8" fill="#FFB3C8" stroke="none" />
      <circle cx="23" cy="19" r="1.8" fill="#FFB3C8" stroke="none" />
    </g>
  ),
  handshake: () => (
    <g stroke="#B5663B" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M3 13 h6 l5 4 q2 2 0 4 l-2 -2" fill="#F0B98A" />
      <path d="M29 13 h-6 l-6 5 q-2 2 0 4 q2 2 4 0 l5 -4" fill="#FFCBA0" />
      <path d="M14 21 q2 2 4 0" fill="none" />
    </g>
  )
};

export function CozyGlyph({
  name,
  size = 20,
  className,
  title
}: {
  name: GlyphName;
  size?: number;
  className?: string;
  title?: string;
}) {
  const gid = `gly-${name}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={clsx("inline-block shrink-0 align-[-0.15em]", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      {GLYPHS[name](gid)}
    </svg>
  );
}

export function hasGlyph(name: string): name is GlyphName {
  return name in GLYPHS;
}

// Drop-in for a decorative emoji: renders the matching glyph if we have one,
// otherwise the original emoji character (so unknown emoji are untouched).
export function Emoji({
  char,
  size = 20,
  className,
  title
}: {
  char: string;
  size?: number;
  className?: string;
  title?: string;
}) {
  const glyph = EMOJI_GLYPH[char] ?? EMOJI_GLYPH[char.trim()];
  if (!glyph) {
    return (
      <span className={className} style={{ fontSize: size * 0.95, lineHeight: 1 }} aria-label={title}>
        {char}
      </span>
    );
  }
  return <CozyGlyph name={glyph} size={size} className={className} title={title} />;
}
