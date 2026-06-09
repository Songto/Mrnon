"use client";

// A parametric cozy plant that visibly grows with `stageIndex` (0..5).
export function Plant({ stageIndex, size = 96 }: { stageIndex: number; size?: number }) {
  const stem = 8 + stageIndex * 14; // stem height grows per stage
  const leaves = Math.min(stageIndex, 3);
  const hasBud = stageIndex >= 3;
  const hasBloom = stageIndex >= 4;
  const fullBloom = stageIndex >= 5;
  const baseY = 92;
  const topY = baseY - stem;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      {/* pot */}
      <path d="M30 78 L70 78 L65 96 L35 96 Z" fill="#D49484" />
      <rect x="28" y="72" width="44" height="9" rx="3" fill="#E7B7A8" />
      <ellipse cx="50" cy="73" rx="20" ry="3.5" fill="#5A4636" opacity="0.5" />

      {stageIndex === 0 ? (
        // a single seed sprout poking out
        <g>
          <path d="M50 73 q-4 -6 0 -10" stroke="#7FA277" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="62" r="3" fill="#A8C3A1" />
        </g>
      ) : (
        <g>
          {/* stem */}
          <path
            d={`M50 73 C ${52} ${baseY - stem * 0.4}, ${48} ${baseY - stem * 0.7}, 50 ${topY}`}
            stroke="#7FA277"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* leaves */}
          {Array.from({ length: leaves }).map((_, i) => {
            const ly = baseY - 6 - i * (stem / (leaves + 1));
            const left = i % 2 === 0;
            return (
              <path
                key={i}
                d={
                  left
                    ? `M50 ${ly} q-16 -6 -20 -16 q14 -2 20 8`
                    : `M50 ${ly} q16 -6 20 -16 q-14 -2 -20 8`
                }
                fill="#A8C3A1"
              />
            );
          })}
          {/* bud / bloom */}
          {fullBloom ? (
            <g>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx="50"
                  cy={topY - 6}
                  rx="6"
                  ry="9"
                  fill="#E7B7A8"
                  transform={`rotate(${a} 50 ${topY})`}
                />
              ))}
              <circle cx="50" cy={topY} r="5" fill="#F0C987" />
            </g>
          ) : hasBloom ? (
            <g>
              <circle cx="50" cy={topY - 2} r="8" fill="#C9BCE0" />
              <circle cx="50" cy={topY - 2} r="3.5" fill="#F0C987" />
            </g>
          ) : hasBud ? (
            <ellipse cx="50" cy={topY - 2} rx="5" ry="8" fill="#E7B7A8" />
          ) : (
            <circle cx="50" cy={topY} r="4" fill="#A8C3A1" />
          )}
        </g>
      )}
    </svg>
  );
}
