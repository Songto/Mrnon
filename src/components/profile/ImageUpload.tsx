"use client";

import { useEffect, useRef, useState } from "react";
import { approxKB, loadImageFromFile, resizeToDataUrl, resizedDims } from "@/lib/image";

// A single-image uploader with a resize "studio" (live preview + size/quality
// sliders), used for the profile banner and page background.
export function ImageUpload({
  shape,
  defaultMax = 1080,
  onChange
}: {
  shape: "banner" | "background";
  defaultMax?: number;
  onChange: (dataUrl: string) => void;
}) {
  const [pending, setPending] = useState<HTMLImageElement | null>(null);
  const [maxSize, setMaxSize] = useState(defaultMax);
  const [quality, setQuality] = useState(0.72);
  const [preview, setPreview] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!pending) {
      setPreview("");
      return;
    }
    setPreview(resizeToDataUrl(pending, maxSize, quality));
  }, [pending, maxSize, quality]);

  const reset = () => {
    setPending(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const use = () => {
    if (!preview) return;
    onChange(preview);
    reset();
  };

  const previewClass = shape === "banner" ? "h-16 w-full" : "h-24 w-full";

  return (
    <div className="mt-2">
      {pending ? (
        <div className="rounded-2xl border border-cocoa/10 bg-surface/60 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="preview"
            className={`${previewClass} rounded-xl object-cover ring-2 ring-strawberry/40`}
          />
          <p className="mt-1 text-center text-[10px] text-cocoa-soft">
            {resizedDims(pending, maxSize)} · ~{approxKB(preview)}KB
          </p>
          <label className="mt-1 block text-[11px] text-cocoa-soft">
            Size: {maxSize}px
            <input
              type="range"
              min={320}
              max={1600}
              step={40}
              value={maxSize}
              onChange={(e) => setMaxSize(parseInt(e.target.value, 10))}
              className="w-full accent-strawberry"
            />
          </label>
          <label className="block text-[11px] text-cocoa-soft">
            Quality: {Math.round(quality * 100)}%
            <input
              type="range"
              min={0.3}
              max={0.95}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-strawberry"
            />
          </label>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={use}
              className="flex-1 rounded-full bg-strawberry px-3 py-1.5 text-xs font-display text-night transition active:scale-95"
            >
              Use this image ✨
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-full px-3 py-1.5 text-xs text-cocoa-soft hover:bg-cocoa/5"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-cocoa/15 bg-surface/40 px-4 py-2 text-xs text-cocoa-soft transition hover:border-strawberry hover:text-cocoa"
        >
          🖼️ Upload your own {shape} — resize before applying
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) loadImageFromFile(f).then(setPending).catch(() => {});
        }}
      />
    </div>
  );
}
