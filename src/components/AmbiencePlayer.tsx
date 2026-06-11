"use client";

// A floating cozy ambience mixer. All sounds are your own looping audio files
// in /public/sounds/. Layer any of the six; the master volume controls them
// all. State (volume) persists in localStorage; audio can't auto-resume, so
// nothing plays until you tap a sound.

import { useEffect, useRef, useState } from "react";
import { clsx } from "@/lib/clsx";

type Sound = { key: string; label: string; emoji: string; src: string };

// Up to six sounds. Rename labels/emojis and drop matching files in
// public/sounds/ (e.g. rain.mp3). Add/remove rows freely (max 6 looks best).
const SOUNDS: Sound[] = [
  { key: "rain", label: "Rain", emoji: "🌧️", src: "/sounds/rain.mp3" },
  { key: "fireplace", label: "Fireplace", emoji: "🔥", src: "/sounds/fireplace.mp3" },
  { key: "chimes", label: "Chimes", emoji: "🎐", src: "/sounds/chimes.mp3" },
  { key: "lofi", label: "Lofi", emoji: "🎶", src: "/sounds/lofi.mp3" },
  { key: "cafe", label: "Café", emoji: "☕", src: "/sounds/cafe.mp3" },
  { key: "forest", label: "Forest", emoji: "🌳", src: "/sounds/forest.mp3" }
];

const STORE_KEY = "ourchat:ambience";

export function AmbiencePlayer() {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [missing, setMissing] = useState<Set<string>>(new Set());
  const audiosRef = useRef<Record<string, HTMLAudioElement>>({});

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

  function toggle(s: Sound) {
    const willBeOn = !active[s.key];
    if (willBeOn) {
      const audio = new Audio(s.src);
      audio.loop = true;
      audio.volume = volume;
      audio.onerror = () => {
        setMissing((m) => new Set(m).add(s.key));
        setActive((a) => ({ ...a, [s.key]: false }));
        delete audiosRef.current[s.key];
      };
      audio.play().catch(() => {
        /* decode / autoplay issue */
      });
      audiosRef.current[s.key] = audio;
    } else {
      const a = audiosRef.current[s.key];
      if (a) {
        a.pause();
        a.src = "";
      }
      delete audiosRef.current[s.key];
    }
    setActive((prev) => ({ ...prev, [s.key]: willBeOn }));
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ volume }));
    } catch {
      /* ignore */
    }
  }

  // Master volume → every active sound.
  useEffect(() => {
    Object.values(audiosRef.current).forEach((a) => {
      a.volume = volume;
    });
  }, [volume]);

  // Pause everything on unmount.
  useEffect(() => {
    const audios = audiosRef.current;
    return () => {
      Object.values(audios).forEach((a) => {
        a.pause();
        a.src = "";
      });
    };
  }, []);

  const anyOn = Object.values(active).some(Boolean);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="mb-2 w-64 cozy-card animate-pop p-4">
          <p className="mb-2 font-display text-sm">Cozy ambience</p>
          <div className="grid grid-cols-3 gap-2">
            {SOUNDS.map((s) => {
              const isMissing = missing.has(s.key);
              return (
                <button
                  key={s.key}
                  onClick={() => toggle(s)}
                  title={isMissing ? `Add public${s.src} to enable` : s.label}
                  className={clsx(
                    "flex flex-col items-center rounded-2xl px-2 py-2 text-[11px] transition",
                    active[s.key]
                      ? "bg-sage text-cocoa shadow-cozy"
                      : "bg-cocoa/5 text-cocoa-soft hover:bg-cocoa/10",
                    isMissing && "opacity-50"
                  )}
                >
                  <span className="text-lg">{s.emoji}</span>
                  {s.label}
                </button>
              );
            })}
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
            Drop your loops in <code>public/sounds/</code> (rain.mp3, fireplace.mp3, …).
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
