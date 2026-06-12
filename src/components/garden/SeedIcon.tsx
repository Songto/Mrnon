"use client";

import { useState } from "react";

// Shows a seed's animated art from /public/seeds/<id>.gif. If that file hasn't
// been uploaded yet, it quietly falls back to the seed's emoji — so the site
// keeps working and the art appears automatically once a file is added.
export function SeedIcon({
  id,
  emoji,
  size = 32,
  className
}: {
  id: string;
  emoji: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className={className} style={{ fontSize: size * 0.9, lineHeight: 1 }}>
        {emoji}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/seeds/${id}.gif`}
      alt={emoji}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={className}
      style={{ width: size, height: size, objectFit: "contain", display: "inline-block" }}
    />
  );
}
