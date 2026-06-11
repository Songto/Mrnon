"use client";

// A floating cozy ambience mixer. Every sound is synthesized live in the
// browser (Web Audio API) — no audio files to ship or lose. Layer any of the
// six; the master volume controls them all. Volume persists in localStorage;
// audio can't auto-start, so nothing plays until you tap a sound.

import { useEffect, useRef, useState } from "react";
import { clsx } from "@/lib/clsx";
import { AMBIENCE, type AmbienceHandle } from "@/lib/ambience";

type Sound = { key: string; label: string; emoji: string };

const SOUNDS: Sound[] = [
  { key: "rain", label: "Rain", emoji: "🌧️" },
  { key: "fire", label: "Fireplace", emoji: "🔥" },
  { key: "chimes", label: "Chimes", emoji: "🎐" },
  { key: "waves", label: "Waves", emoji: "🌊" },
  { key: "forest", label: "Forest", emoji: "🌳" },
  { key: "night", label: "Night", emoji: "🌙" }
];

const STORE_KEY = "ourchat:ambience";

export function AmbiencePlayer() {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const handlesRef = useRef<Record<string, AmbienceHandle>>({});

  // Restore saved volume only (audio can't auto-resume without a gesture).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.volume === "number") setVolume(saved.volume);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function ensureContext(): { ctx: AudioContext; master: GainNode } | null {
    if (typeof window === "undefined") return null;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctxRef.current) {
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return { ctx: ctxRef.current, master: masterRef.current! };
  }

  function toggle(s: Sound) {
    const willBeOn = !active[s.key];
    if (willBeOn) {
      const audio = ensureContext();
      const factory = AMBIENCE[s.key];
      if (audio && factory) {
        handlesRef.current[s.key] = factory(audio.ctx, audio.master);
      }
    } else {
      handlesRef.current[s.key]?.stop();
      delete handlesRef.current[s.key];
    }
    setActive((prev) => ({ ...prev, [s.key]: willBeOn }));
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ volume }));
    } catch {
      /* ignore */
    }
  }

  // Master volume → smoothly applied to everything.
  useEffect(() => {
    const master = masterRef.current;
    const ctx = ctxRef.current;
    if (master && ctx) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
  }, [volume]);

  // Stop everything on unmount.
  useEffect(() => {
    const handles = handlesRef.current;
    return () => {
      Object.values(handles).forEach((h) => h.stop());
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  const anyOn = Object.values(active).some(Boolean);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="mb-2 w-64 cozy-card animate-pop p-4">
          <p className="mb-2 font-display text-sm">Cozy ambience</p>
          <div className="grid grid-cols-3 gap-2">
            {SOUNDS.map((s) => (
              <button
                key={s.key}
                onClick={() => toggle(s)}
                title={s.label}
                className={clsx(
                  "flex flex-col items-center rounded-2xl px-2 py-2 text-[11px] transition",
                  active[s.key]
                    ? "bg-sage text-cocoa shadow-cozy"
                    : "bg-cocoa/5 text-cocoa-soft hover:bg-cocoa/10"
                )}
              >
                <span className="text-lg">{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
          <label className="mt-3 block text-xs text-cocoa-soft">Volume</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-rose-deep"
          />
          <p className="mt-2 text-[10px] text-cocoa-soft">
            Tap to layer sounds — they&apos;re woven live, just for you. 🫖
          </p>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "flex h-14 w-14 items-center justify-center rounded-full shadow-cozy-lg transition hover:-translate-y-0.5",
          anyOn ? "bg-rose-deep text-white animate-float-slow" : "bg-surface text-cocoa"
        )}
        title="Cozy ambience"
      >
        <span className="text-2xl">{anyOn ? "🎵" : "🔈"}</span>
      </button>
    </div>
  );
}
