"use client";

import type { Showcase } from "@/lib/db";
import { ImageUpload } from "./ImageUpload";
import { FocalPicker } from "./FocalPicker";

const TYPE_META: Record<Showcase["type"], { label: string; emoji: string; hint: string }> = {
  about: { label: "About", emoji: "📝", hint: "A free text box about you." },
  screenshot: { label: "Screenshots", emoji: "📸", hint: "A grid of images / GIFs." },
  feature: { label: "Featured", emoji: "🌟", hint: "One big featured image + caption." }
};

function newShowcase(type: Showcase["type"]): Showcase {
  return {
    id: `sc-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    type,
    title: TYPE_META[type].label,
    text: "",
    images: []
  };
}

export function ShowcaseManager({
  showcases,
  onChange
}: {
  showcases: Showcase[];
  onChange: (s: Showcase[]) => void;
}) {
  const MAX = 3;
  const full = showcases.length >= MAX;
  const update = (id: string, patch: Partial<Showcase>) =>
    onChange(showcases.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const remove = (id: string) => onChange(showcases.filter((s) => s.id !== id));
  const add = (type: Showcase["type"]) => {
    if (full) return;
    onChange([...showcases, newShowcase(type)]);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= showcases.length) return;
    const next = [...showcases];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-display text-cocoa-soft">Showcases ({showcases.length}/{MAX})</p>
      </div>

      <div className="space-y-3">
        {showcases.map((sc, i) => (
          <div key={sc.id} className="rounded-2xl border border-cocoa/10 bg-surface/60 p-3">
            {/* header: reorder + title + remove */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  className="text-cocoa-soft hover:text-strawberry disabled:opacity-30"
                  disabled={i === 0}
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  className="text-cocoa-soft hover:text-strawberry disabled:opacity-30"
                  disabled={i === showcases.length - 1}
                  title="Move down"
                >
                  ▼
                </button>
              </div>
              <span className="text-lg">{TYPE_META[sc.type].emoji}</span>
              <input
                value={sc.title}
                onChange={(e) => update(sc.id, { title: e.target.value })}
                maxLength={60}
                placeholder="Name this showcase…"
                className="flex-1 rounded-full border border-cocoa/10 bg-surface px-3 py-1.5 text-sm font-display outline-none focus:border-strawberry"
              />
              <button
                type="button"
                onClick={() => remove(sc.id)}
                className="rounded-full px-2 py-1 text-xs text-cocoa-soft hover:text-strawberry"
                title="Remove showcase"
              >
                ✕
              </button>
            </div>

            {/* type-specific body */}
            {sc.type === "about" && (
              <textarea
                value={sc.text || ""}
                onChange={(e) => update(sc.id, { text: e.target.value })}
                rows={3}
                maxLength={1200}
                placeholder="Write anything — your story, your setup, your fav games…"
                className="mt-2 w-full rounded-xl border border-cocoa/10 bg-surface px-3 py-2 text-sm outline-none [overflow-wrap:anywhere] focus:border-strawberry"
              />
            )}

            {sc.type === "screenshot" && (
              <div className="mt-2">
                {sc.images && sc.images.length > 0 && (
                  <div className="mb-2 grid grid-cols-4 gap-2">
                    {sc.images.map((im, idx) => (
                      <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={im.url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            update(sc.id, { images: sc.images!.filter((_, k) => k !== idx) })
                          }
                          className="absolute right-1 top-1 rounded-full bg-strawberry px-1.5 text-xs text-night opacity-0 transition group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <ImageUpload
                  shape="background"
                  defaultMax={1080}
                  onChange={(url) =>
                    update(sc.id, { images: [...(sc.images || []), { url }] })
                  }
                />
              </div>
            )}

            {sc.type === "feature" && (
              <div className="mt-2 space-y-2">
                {sc.images && sc.images[0] ? (
                  <>
                    <FocalPicker
                      url={sc.images[0].url}
                      fit="fill"
                      pos={sc.images[0].pos || "50% 50%"}
                      shape="background"
                      onChange={(pos) => update(sc.id, { images: [{ ...sc.images![0], pos }] })}
                    />
                    <button
                      type="button"
                      onClick={() => update(sc.id, { images: [] })}
                      className="text-[11px] text-cocoa-soft hover:text-strawberry"
                    >
                      remove image
                    </button>
                  </>
                ) : (
                  <ImageUpload
                    shape="background"
                    defaultMax={1280}
                    onChange={(url) => update(sc.id, { images: [{ url, pos: "50% 50%" }] })}
                  />
                )}
                <input
                  value={sc.text || ""}
                  onChange={(e) => update(sc.id, { text: e.target.value })}
                  maxLength={160}
                  placeholder="Caption (optional)"
                  className="w-full rounded-full border border-cocoa/10 bg-surface px-3 py-1.5 text-sm outline-none focus:border-strawberry"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* add buttons */}
      {full ? (
        <p className="mt-3 text-center text-[11px] text-cocoa-soft">
          You&apos;ve added the max of {MAX} showcases — remove one to swap it out.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(TYPE_META) as Showcase["type"][]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => add(t)}
              className="rounded-full border border-dashed border-cocoa/20 px-3 py-1.5 text-xs text-cocoa-soft transition hover:border-strawberry hover:text-cocoa"
              title={TYPE_META[t].hint}
            >
              + {TYPE_META[t].emoji} {TYPE_META[t].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
