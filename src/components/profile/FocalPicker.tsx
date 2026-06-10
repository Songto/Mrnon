"use client";

import { useRef, useState } from "react";
import type { ImageFit } from "@/lib/profile-presets";

function sizeFor(fit: ImageFit): string {
  switch (fit) {
    case "fit":
      return "contain";
    case "stretch":
      return "100% 100%";
    case "tile":
      return "auto";
    case "center":
      return "auto";
    default:
      return "cover";
  }
}

// Drag anywhere on the preview to choose which part of the image is shown
// (sets a CSS object/background position). Works for banner & background.
export function FocalPicker({
  url,
  fit,
  pos,
  shape,
  onChange
}: {
  url: string;
  fit: ImageFit;
  pos: string;
  shape: "banner" | "background";
  onChange: (pos: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const update = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((clientX - r.left) / r.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((clientY - r.top) / r.height) * 100)));
    onChange(`${x}% ${y}%`);
  };

  const [px, py] = (pos || "50% 50%").split(" ");
  const repeat = fit === "tile" ? "repeat" : "no-repeat";

  return (
    <div>
      <div
        ref={ref}
        onPointerDown={(e) => {
          setDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
          update(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => dragging && update(e.clientX, e.clientY)}
        onPointerUp={() => setDragging(false)}
        className={`relative cursor-move touch-none select-none overflow-hidden rounded-xl border border-cocoa/10 ${
          shape === "banner" ? "aspect-[4/1]" : "aspect-[16/9]"
        }`}
        style={{
          backgroundColor: "#FBE7D4",
          backgroundImage: `url("${url}")`,
          backgroundPosition: pos || "50% 50%",
          backgroundSize: sizeFor(fit),
          backgroundRepeat: repeat
        }}
      >
        {/* focal handle */}
        <span
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-cozy"
          style={{ left: px, top: py, background: "rgba(255,255,255,0.35)" }}
        />
        <span className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-night/55 px-2 py-0.5 text-[10px] text-white">
          drag to reposition
        </span>
      </div>
    </div>
  );
}
