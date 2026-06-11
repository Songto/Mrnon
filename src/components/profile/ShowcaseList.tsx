"use client";

import { useState } from "react";
import type { Showcase } from "@/lib/db";

export function ShowcaseList({ showcases, accent }: { showcases: Showcase[]; accent: string }) {
  const [zoom, setZoom] = useState<string | null>(null);
  const visible = showcases.filter(
    (s) => (s.text && s.text.trim()) || (s.images && s.images.length > 0)
  );
  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((sc) => (
        <div key={sc.id} className="cozy-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg">
            {sc.type === "about" ? "📝" : sc.type === "feature" ? "🌟" : "📸"} {sc.title}
          </h2>

          {sc.type === "about" && sc.text && (
            <p className="whitespace-pre-wrap break-words text-sm text-cocoa [overflow-wrap:anywhere]">
              {sc.text}
            </p>
          )}

          {sc.type === "feature" && sc.images?.[0] && (
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sc.images[0].url}
                alt={sc.title}
                onClick={() => setZoom(sc.images![0].url)}
                className="max-h-[28rem] w-full cursor-zoom-in rounded-2xl object-cover"
                style={{ objectPosition: sc.images[0].pos || "50% 50%" }}
              />
              {sc.text && (
                <figcaption className="mt-2 text-center text-sm" style={{ color: accent }}>
                  {sc.text}
                </figcaption>
              )}
            </figure>
          )}

          {sc.type === "screenshot" && sc.images && sc.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {sc.images.map((im, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={im.url}
                  alt=""
                  onClick={() => setZoom(im.url)}
                  className="aspect-square w-full cursor-zoom-in rounded-2xl object-cover transition hover:-translate-y-0.5 hover:shadow-cozy"
                  style={{ objectPosition: im.pos || "50% 50%" }}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/70 p-4"
          onClick={() => setZoom(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="zoomed" className="max-h-[90vh] max-w-full rounded-2xl shadow-cozy-lg" />
        </div>
      )}
    </>
  );
}
