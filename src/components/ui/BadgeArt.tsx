// Hand-drawn SVG medallion art for the advanced badges — award-seal style
// with a scalloped edge, soft gradients, and a custom emblem per badge.
// Pure SVG: crisp at any size, zero image assets.

import type { AdvancedBadgeId } from "@/lib/badges";

// Scalloped seal outline (a starburst polygon around the centre).
function sealPoints(points = 22, rOuter = 48, rInner = 43): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

function starPoints(cx: number, cy: number, rOuter: number, rInner: number, points = 5): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

function Sparkle({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return (
    <path
      d={`M${x},${y - s} Q${x + s * 0.2},${y - s * 0.2} ${x + s},${y} Q${x + s * 0.2},${y + s * 0.2} ${x},${y + s} Q${x - s * 0.2},${y + s * 0.2} ${x - s},${y} Q${x - s * 0.2},${y - s * 0.2} ${x},${y - s} Z`}
      fill={fill}
      opacity={0.9}
    />
  );
}

type Scheme = { edge: string; from: string; to: string; inner: string };

const SCHEMES: Record<AdvancedBadgeId, Scheme> = {
  ourchat: { edge: "#E0314F", from: "#FF6385", to: "#FF9EB5", inner: "#FFE3EC" },
  secret: { edge: "#4A3C8C", from: "#8B7DF0", to: "#B3A8F5", inner: "#E5DEFF" },
  gardener: { edge: "#4E7D48", from: "#7FB976", to: "#A9D6A0", inner: "#E7F3E2" },
  cutefactor: { edge: "#D9527E", from: "#FF8FAE", to: "#FFC2D4", inner: "#FFE9F0" },
  famous: { edge: "#C27A14", from: "#F0A848", to: "#FBD08A", inner: "#FFF3D6" }
};

function Emblem({ id }: { id: AdvancedBadgeId }) {
  switch (id) {
    case "ourchat":
      // strawberry with a leaf crown and seeds
      return (
        <g>
          <path
            d="M50 36 C62 36 69 44 69 52 C69 64 58 72 50 75 C42 72 31 64 31 52 C31 44 38 36 50 36 Z"
            fill="#E0314F"
            stroke="#B81F3B"
            strokeWidth="1.5"
          />
          <path d="M42 32 L48 37 L50 30 L52 37 L58 32 L55 39 L45 39 Z" fill="#5E9E55" />
          {[
            [43, 48], [57, 48], [50, 54], [43, 60], [57, 60], [50, 66]
          ].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="1.6" ry="2.3" fill="#FFD9E8" />
          ))}
          <path d="M40 42 Q44 39 48 41" stroke="#FF9EB5" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    case "secret":
      // keyhole in a soft shield
      return (
        <g>
          <circle cx="50" cy="47" r="9.5" fill="#2E2548" />
          <path d="M45.5 52 L41 70 L59 70 L54.5 52 Z" fill="#2E2548" />
          <circle cx="46.5" cy="43.5" r="2.6" fill="#8B7DF0" opacity="0.9" />
          <Sparkle x={67} y={35} s={4} fill="#FFFFFF" />
          <Sparkle x={33} y={62} s={3} fill="#FFFFFF" />
        </g>
      );
    case "gardener":
      // sprout rising from a soil mound
      return (
        <g>
          <path d="M34 70 Q50 62 66 70 L66 73 L34 73 Z" fill="#8A6244" />
          <path d="M50 68 C50 58 50 52 50 45" stroke="#4E7D48" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M50 52 C40 51 33 44 34 35 C44 34 51 42 50 52 Z" fill="#5E9E55" />
          <path d="M50 47 C58 46 64 40 63 32 C55 32 49 38 50 47 Z" fill="#7FC974" />
          <Sparkle x={66} y={52} s={3.5} fill="#FFFFFF" />
        </g>
      );
    case "cutefactor":
      // ribbon bow with tails
      return (
        <g>
          <path d="M47 50 C36 40 28 42 30 51 C31 59 41 60 47 55 Z" fill="#E0517A" stroke="#C23A61" strokeWidth="1.2" />
          <path d="M53 50 C64 40 72 42 70 51 C69 59 59 60 53 55 Z" fill="#E0517A" stroke="#C23A61" strokeWidth="1.2" />
          <path d="M46 55 L41 70 L48 67 Z" fill="#D9527E" />
          <path d="M54 55 L59 70 L52 67 Z" fill="#D9527E" />
          <circle cx="50" cy="52" r="5.5" fill="#FF8FAE" stroke="#C23A61" strokeWidth="1.2" />
          <Sparkle x={35} y={36} s={3.5} fill="#FFFFFF" />
          <Sparkle x={66} y={62} s={3} fill="#FFFFFF" />
        </g>
      );
    case "famous":
      // big star with sparkles
      return (
        <g>
          <polygon
            points={starPoints(50, 52, 20, 8.5)}
            fill="#FFF3C2"
            stroke="#D98A1F"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Sparkle x={31} y={38} s={4} fill="#FFFFFF" />
          <Sparkle x={69} y={40} s={3} fill="#FFFFFF" />
          <Sparkle x={64} y={68} s={3.5} fill="#FFFFFF" />
        </g>
      );
  }
}

export function BadgeArt({
  id,
  size = 56,
  className,
  title
}: {
  id: AdvancedBadgeId;
  size?: number;
  className?: string;
  title?: string;
}) {
  const s = SCHEMES[id];
  const gid = `bdg-${id}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={title || id}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={`${gid}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.from} />
          <stop offset="100%" stopColor={s.to} />
        </linearGradient>
        <radialGradient id={`${gid}-i`} cx="0.5" cy="0.42" r="0.65">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={s.inner} />
        </radialGradient>
      </defs>
      {/* scalloped seal */}
      <polygon points={sealPoints()} fill={`url(#${gid}-g)`} stroke={s.edge} strokeWidth="1.5" />
      {/* inner face */}
      <circle cx="50" cy="50" r="36" fill={`url(#${gid}-i)`} stroke={s.edge} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="32" fill="none" stroke={s.from} strokeWidth="1" opacity="0.6" />
      <Emblem id={id} />
      {/* glossy shine */}
      <path d="M24 36 A32 32 0 0 1 76 36 A40 40 0 0 0 24 36 Z" fill="#FFFFFF" opacity="0.35" />
    </svg>
  );
}
