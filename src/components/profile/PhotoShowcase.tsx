"use client";

import { useState } from "react";

export function PhotoShowcase({
  photos,
  style = "grid"
}: {
  photos: string[];
  style?: "grid" | "full";
}) {
  const [zoom, setZoom] = useState<string | null>(null);
  if (!photos || photos.length === 0) return null;

  return (
    <div className="cozy-card p-5">
      <h2 className="mb-3 text-lg">Showcase 📸</h2>

      {style === "full" ? (
        <div className="space-y-3">
          {photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`showcase ${i + 1}`}
              onClick={() => setZoom(src)}
              className="w-full cursor-zoom-in rounded-2xl object-cover"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`showcase ${i + 1}`}
              onClick={() => setZoom(src)}
              className="aspect-square w-full cursor-zoom-in rounded-2xl object-cover transition hover:-translate-y-0.5 hover:shadow-cozy"
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/70 p-4"
          onClick={() => setZoom(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={zoom}
            alt="zoomed"
            className="max-h-[90vh] max-w-full rounded-2xl shadow-cozy-lg"
          />
        </div>
      )}
    </div>
  );
}
