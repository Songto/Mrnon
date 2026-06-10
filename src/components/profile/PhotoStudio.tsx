"use client";

import { useEffect, useRef, useState } from "react";

type ShowcaseStyle = "grid" | "full";

function resizeToDataUrl(img: HTMLImageElement, maxSize: number, quality: number): string {
  const ratio = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * ratio));
  const h = Math.max(1, Math.round(img.naturalHeight * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);
  }
  return canvas.toDataURL("image/jpeg", quality);
}

function approxKB(dataUrl: string): number {
  // base64 payload is ~4/3 of the byte size
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.round((base64.length * 3) / 4 / 1024);
}

export function PhotoStudio({
  photos,
  style,
  onPhotosChange,
  onStyleChange,
  max = 8
}: {
  photos: string[];
  style: ShowcaseStyle;
  onPhotosChange: (photos: string[]) => void;
  onStyleChange: (s: ShowcaseStyle) => void;
  max?: number;
}) {
  const [pending, setPending] = useState<HTMLImageElement | null>(null);
  const [maxSize, setMaxSize] = useState(720);
  const [quality, setQuality] = useState(0.72);
  const [preview, setPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Recompute the preview whenever the pending image or resize settings change.
  useEffect(() => {
    if (!pending) {
      setPreview("");
      return;
    }
    setPreview(resizeToDataUrl(pending, maxSize, quality));
  }, [pending, maxSize, quality]);

  const onPick = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => setPending(img);
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addPhoto = () => {
    if (!preview || photos.length >= max) return;
    onPhotosChange([...photos, preview]);
    setPending(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removePhoto = (i: number) => onPhotosChange(photos.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= photos.length) return;
    const next = [...photos];
    [next[i], next[j]] = [next[j], next[i]];
    onPhotosChange(next);
  };

  const previewKB = preview ? approxKB(preview) : 0;
  const dims = pending
    ? (() => {
        const r = Math.min(1, maxSize / Math.max(pending.naturalWidth, pending.naturalHeight));
        return `${Math.round(pending.naturalWidth * r)}×${Math.round(pending.naturalHeight * r)}`;
      })()
    : "";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-display text-cocoa-soft">
          Photo showcase 📸 ({photos.length}/{max})
        </p>
        {/* Style toggle */}
        <div className="flex overflow-hidden rounded-full border border-cocoa/10 text-[11px]">
          {(["grid", "full"] as ShowcaseStyle[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onStyleChange(s)}
              className={`px-3 py-1 font-display transition ${
                style === s ? "bg-strawberry text-night" : "text-cocoa-soft hover:bg-cocoa/5"
              }`}
            >
              {s === "grid" ? "▦ grid" : "▤ full"}
            </button>
          ))}
        </div>
      </div>

      {/* Existing photos */}
      {photos.length > 0 && (
        <div className="mb-3 grid grid-cols-4 gap-2">
          {photos.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`photo ${i + 1}`} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-night/40 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  className="rounded-full bg-surface/90 px-1.5 text-xs text-cocoa"
                  title="Move left"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="rounded-full bg-strawberry px-1.5 text-xs text-night"
                  title="Remove"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  className="rounded-full bg-surface/90 px-1.5 text-xs text-cocoa"
                  title="Move right"
                >
                  ▶
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploader + resize studio */}
      {photos.length < max ? (
        pending ? (
          <div className="rounded-2xl border border-cocoa/10 bg-surface/60 p-3">
            <div className="flex gap-3">
              {/* Live preview */}
              <div className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="preview"
                  className="h-28 w-28 rounded-xl object-cover ring-2 ring-strawberry/40"
                />
                <p className="mt-1 text-center text-[10px] text-cocoa-soft">
                  {dims} · ~{previewKB}KB
                </p>
              </div>
              {/* Resize controls */}
              <div className="flex-1">
                <label className="block text-[11px] text-cocoa-soft">
                  Size: {maxSize}px
                  <input
                    type="range"
                    min={240}
                    max={1080}
                    step={40}
                    value={maxSize}
                    onChange={(e) => setMaxSize(parseInt(e.target.value, 10))}
                    className="w-full accent-strawberry"
                  />
                </label>
                <label className="mt-1 block text-[11px] text-cocoa-soft">
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
                    onClick={addPhoto}
                    className="flex-1 rounded-full bg-strawberry px-3 py-1.5 text-xs font-display text-night transition active:scale-95"
                  >
                    Add to showcase ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPending(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="rounded-full px-3 py-1.5 text-xs text-cocoa-soft hover:bg-cocoa/5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-cocoa/15 bg-surface/40 px-4 py-6 text-sm text-cocoa-soft transition hover:border-strawberry hover:text-cocoa"
          >
            <span className="text-2xl">🖼️</span>
            Upload a photo — you can resize it before adding
          </button>
        )
      ) : (
        <p className="text-center text-xs text-cocoa-soft">
          That&apos;s the max — remove one to add another.
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
    </div>
  );
}
