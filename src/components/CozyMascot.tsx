// A cozy animated teacup mascot — pure SVG with self-contained SMIL animation
// (steam rising, a gentle bob, blinking eyes, twinkling sparkles). No image
// files, no libraries; crisp at any size and theme-friendly.
export function CozyMascot({ size = 120 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="A cozy cup of tea"
      className="drop-shadow-[0_8px_16px_rgba(193,124,90,0.25)]"
    >
      {/* steam */}
      <g fill="none" stroke="#E7B7A8" strokeWidth="3" strokeLinecap="round" opacity="0.8">
        <path d="M48 40 C44 33 52 30 48 22">
          <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 6; 0 -8" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M60 40 C56 32 64 29 60 20">
          <animate attributeName="opacity" values="0;0.8;0" dur="3s" begin="1s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 6; 0 -8" dur="3s" begin="1s" repeatCount="indefinite" />
        </path>
        <path d="M72 40 C68 33 76 30 72 22">
          <animate attributeName="opacity" values="0;0.8;0" dur="3s" begin="2s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 6; 0 -8" dur="3s" begin="2s" repeatCount="indefinite" />
        </path>
      </g>

      {/* the cup gently bobs */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="4s" repeatCount="indefinite" />

        {/* saucer */}
        <ellipse cx="60" cy="98" rx="38" ry="8" fill="#FFB3C7" />
        <ellipse cx="60" cy="96" rx="38" ry="7" fill="#FFD9E8" />

        {/* handle */}
        <path d="M90 60 a14 14 0 0 1 0 22" fill="none" stroke="#FF8FAE" strokeWidth="7" strokeLinecap="round" />

        {/* cup body */}
        <path d="M30 52 H90 L84 86 a10 10 0 0 1 -10 8 H46 a10 10 0 0 1 -10 -8 Z" fill="#FFF4E9" stroke="#FF8FAE" strokeWidth="3" strokeLinejoin="round" />
        {/* tea surface */}
        <ellipse cx="60" cy="53" rx="30" ry="6" fill="#E7B7A8" />
        <ellipse cx="60" cy="52.5" rx="24" ry="4" fill="#C97D6B" opacity="0.5" />

        {/* face */}
        <g fill="#5A4636">
          <ellipse cx="51" cy="68" rx="2.6" ry="3.2">
            <animate attributeName="ry" values="3.2;0.4;3.2" dur="4s" begin="1.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="69" cy="68" rx="2.6" ry="3.2">
            <animate attributeName="ry" values="3.2;0.4;3.2" dur="4s" begin="1.5s" repeatCount="indefinite" />
          </ellipse>
        </g>
        {/* smile */}
        <path d="M54 74 Q60 80 66 74" fill="none" stroke="#5A4636" strokeWidth="2.4" strokeLinecap="round" />
        {/* blush */}
        <circle cx="45" cy="73" r="3.5" fill="#FF8FAE" opacity="0.55" />
        <circle cx="75" cy="73" r="3.5" fill="#FF8FAE" opacity="0.55" />
      </g>

      {/* twinkling sparkles */}
      <g fill="#FBD08A">
        <path d="M22 46 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 Z">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="2.4s" repeatCount="indefinite" />
        </path>
        <path d="M98 40 l1.3 3.2 3.2 1.3 -3.2 1.3 -1.3 3.2 -1.3 -3.2 -3.2 -1.3 3.2 -1.3 Z">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}
