import { clsx } from "@/lib/clsx";

// Deterministic cozy color from a name, for guest avatars.
const PALETTE = ["#E7B7A8", "#A8C3A1", "#C9BCE0", "#F0C987", "#C7D8B0", "#D49484"];

function colorFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function Avatar({
  name,
  src,
  size = 40,
  className
}: {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={clsx("rounded-full object-cover ring-2 ring-white/80", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-display font-bold text-white ring-2 ring-white/80",
        className
      )}
      style={{ width: size, height: size, background: colorFor(name), fontSize: size * 0.42 }}
      title={name}
    >
      {initial}
    </span>
  );
}
