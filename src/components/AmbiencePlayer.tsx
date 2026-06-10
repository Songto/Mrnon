"use client";

// A floating cozy ambience mixer. Three sounds are SYNTHESIZED with the Web
// Audio API (rain, fireplace, chimes) so they need no files. Three more are
// custom slots you fill with your own looping audio in /public/sounds/.
// Layer any of the six; the master volume controls them all.

import { useEffect, useRef, useState } from "react";
import { clsx } from "@/lib/clsx";

type SoundKind = "rain" | "fire" | "chimes" | "file";
type Sound = { key: string; label: string; emoji: string; kind: SoundKind; src?: string };

// Up to six sounds. Edit the labels/emojis/filenames of the custom slots
// freely; drop matching audio files in public/sounds/.
const SOUNDS: Sound[] = [
  { key: "rain", label: "Rain", emoji: "🌧️", kind: "rain" },
  { key: "fire", label: "Fireplace", emoji: "🔥", kind: "fire" },
  { key: "chimes", label: "Chimes", emoji: "🎐", kind: "chimes" },
  { key: "lofi", label: "Lofi", emoji: "🎶", kind: "file", src: "/sounds/lofi.mp3" },
  { key: "cafe", label: "Café", emoji: "☕", kind: "file", src: "/sounds/cafe.mp3" },
  { key: "forest", label: "Forest", emoji: "🌳", kind: "file", src: "/sounds/forest.mp3" }
];

const STORE_KEY = "ourchat:ambience";

type Node = { stop: () => void; setVolume?: (v: number) => void };

export function AmbiencePlayer() {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [missing, setMissing] = useState<Set<string>>(new Set());

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<Record<string, Node>>({});
  const chimeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  function ensureCtx() {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }

  function noiseBuffer(ctx: AudioContext, kind: "white" | "brown") {
    const len = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === "brown") {
        last = (last + 0.02 * w) / 1.02;
        data[i] = last * 3.5;
      } else {
        data[i] = w;
      }
    }
    return buffer;
  }

  function startSynth(kind: "rain" | "fire" | "chimes"): Node {
    const ctx = ensureCtx();
    const master = masterRef.current!;
    if (kind === "rain") {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx, "white");
      src.loop = true;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 900;
      const g = ctx.createGain();
      g.gain.value = 0.25;
      src.connect(hp).connect(g).connect(master);
      src.start();
      return { stop: () => src.stop() };
    }
    if (kind === "fire") {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx, "brown");
      src.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 700;
      const g = ctx.createGain();
      g.gain.value = 0.5;
      src.connect(lp).connect(g).connect(master);
      src.start();
      let stopped = false;
      const crackle = () => {
        if (stopped) return;
        const pop = ctx.createOscillator();
        const pg = ctx.createGain();
        pop.frequency.value = 40 + Math.random() * 120;
        pg.gain.setValueAtTime(0.0001, ctx.currentTime);
        pg.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
        pg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
        pop.connect(pg).connect(master);
        pop.start();
        pop.stop(ctx.currentTime + 0.13);
        setTimeout(crackle, 200 + Math.random() * 900);
      };
      crackle();
      return {
        stop: () => {
          stopped = true;
          src.stop();
        }
      };
    }
    // chimes
    const notes = [523.25, 587.33, 659.25, 783.99, 880.0];
    let stopped = false;
    const play = () => {
      if (stopped) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
      osc.connect(g).connect(master);
      osc.start();
      osc.stop(ctx.currentTime + 2.6);
      chimeTimer.current = setTimeout(play, 1800 + Math.random() * 3500);
    };
    play();
    return {
      stop: () => {
        stopped = true;
        if (chimeTimer.current) clearTimeout(chimeTimer.current);
      }
    };
  }

  function startFile(key: string, src: string): Node {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    audio.onerror = () => {
      setMissing((m) => new Set(m).add(key));
      setActive((a) => ({ ...a, [key]: false }));
      delete nodesRef.current[key];
    };
    audio.play().catch(() => {
      /* decode / autoplay issue */
    });
    return {
      stop: () => {
        audio.pause();
        audio.src = "";
      },
      setVolume: (v) => {
        audio.volume = v;
      }
    };
  }

  function toggle(s: Sound) {
    const willBeOn = !active[s.key];
    if (willBeOn) {
      nodesRef.current[s.key] =
        s.kind === "file" ? startFile(s.key, s.src!) : startSynth(s.kind);
    } else {
      try {
        nodesRef.current[s.key]?.stop();
      } catch {
        /* already stopped */
      }
      delete nodesRef.current[s.key];
    }
    const next = { ...active, [s.key]: willBeOn };
    setActive(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ volume }));
    } catch {
      /* ignore */
    }
  }

  // Master volume → synth (master gain) + each active file audio.
  useEffect(() => {
    if (masterRef.current) masterRef.current.gain.value = volume;
    Object.values(nodesRef.current).forEach((n) => n.setVolume?.(volume));
  }, [volume]);

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
                  title={isMissing ? `Add ${s.src} to enable` : s.label}
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
            Add your own loops as <code>public/sounds/lofi.mp3</code>, <code>cafe.mp3</code>,{" "}
            <code>forest.mp3</code>.
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
