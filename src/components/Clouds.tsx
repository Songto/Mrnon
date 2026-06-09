// A gentle backdrop of clouds drifting across the warm sky. Purely decorative
// and non-interactive; sits behind all page content.
const CLOUDS = [
  { top: "6%", w: 120, h: 34, dur: 70, delay: -5, op: 0.95 },
  { top: "14%", w: 80, h: 24, dur: 95, delay: -40, op: 0.8 },
  { top: "24%", w: 160, h: 44, dur: 110, delay: -70, op: 0.7 },
  { top: "40%", w: 90, h: 26, dur: 130, delay: -20, op: 0.55 },
  { top: "60%", w: 130, h: 36, dur: 150, delay: -100, op: 0.45 },
  { top: "78%", w: 70, h: 22, dur: 120, delay: -60, op: 0.4 }
];

export function Clouds() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {CLOUDS.map((c, i) => (
        <span
          key={i}
          className="cloud animate-drift-bob"
          style={{
            top: c.top,
            width: c.w,
            height: c.h,
            opacity: c.op,
            animation: `cloud-drift ${c.dur}s linear ${c.delay}s infinite, drift-bob ${6 + (i % 3)}s ease-in-out infinite`
          }}
        />
      ))}
    </div>
  );
}
