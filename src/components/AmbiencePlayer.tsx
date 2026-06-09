"use client";

// A floating cozy ambience controller. Sounds are SYNTHESIZED with the Web Audio
// API (rain = filtered noise, fireplace = brown noise + crackles, chimes = soft
// random sine notes) so the app ships with zero audio assets. Swap in real files
// later if you like. State persists in localStorage.

import { useEffect, useRef, useState } from "react";
import { clsx } from "@/lib/clsx";

type Layer = "rain" | "fire" | "chimes";

const LAYERS: { key: Layer; label: string; emoji: string }[] = [
  { key: "rain", label: "Rain", emoji: "🌧️" },
  { key: "fire", label: "Fireplace", emoji: "🔥" },
  { key: "chimes", label: "Chimes", emoji: "🎐" }
];

const STORE_KEY = "ourchat:ambience";

export function AmbiencePlayer() {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [active, setActive] = useState<Record<Layer, boolean>>({
    rain: false,
    fire: false,
    chimes: false
  });

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<Partial<Record<Layer, { stop: () => void }>>>({});
  const chimeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore saved prefs.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.volume === "number") setVolume(saved.volume);
        if (saved.active) setActive((a) => ({ ...a, ...saved.active }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  function ensureCtx() {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
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

  function startLayer(layer: Layer) {
    const ctx = ensureCtx();
    const master = masterRef.current!;
    if (layer === "rain") {
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
      nodesRef.current.rain = { stop: () => src.stop() };
    } else if (layer === "fire") {
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
      // Occasional crackle pops.
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
      nodesRef.current.fire = {
        stop: () => {
          stopped = true;
          src.stop();
        }
      };
    } else if (layer === "chimes") {
      const ctx2 = ctx;
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0]; // pentatonic-ish
      let stopped = false;
      const play = () => {
        if (stopped) return;
        const osc = ctx2.createOscillator();
        const g = ctx2.createGain();
        osc.type = "sine";
        osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
        g.gain.setValueAtTime(0.0001, ctx2.currentTime);
        g.gain.exponentialRampToValueAtTime(0.12, ctx2.currentTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx2.currentTime + 2.5);
        osc.connect(g).connect(master);
        osc.start();
        osc.stop(ctx2.currentTime + 2.6);
        chimeTimer.current = setTimeout(play, 1800 + Math.random() * 3500);
      };
      play();
      nodesRef.current.chimes = {
        stop: () => {
          stopped = true;
          if (chimeTimer.current) clearTimeout(chimeTimer.current);
        }
      };
    }
  }

  function stopLayer(layer: Layer) {
    try {
      nodesRef.current[layer]?.stop();
    } catch {
      /* already stopped */
    }
    delete nodesRef.current[layer];
  }

  function toggle(layer: Layer) {
    setActive((prev) => {
      const next = { ...prev, [layer]: !prev[layer] };
      if (next[layer]) startLayer(layer);
      else stopLayer(layer);
      persist(next, volume);
      return next;
    });
  }

  function persist(a: Record<Layer, boolean>, v: number) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ active: a, volume: v }));
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (masterRef.current) masterRef.current.gain.value = volume;
  }, [volume]);

  const anyOn = Object.values(active).some(Boolean);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="mb-2 w-60 cozy-card p-4 animate-pop">
          <p className="mb-2 font-display text-sm">Cozy ambience</p>
          <div className="grid grid-cols-3 gap-2">
            {LAYERS.map((l) => (
              <button
                key={l.key}
                onClick={() => toggle(l.key)}
                className={clsx(
                  "flex flex-col items-center rounded-2xl px-2 py-2 text-xs transition",
                  active[l.key]
                    ? "bg-sage text-cocoa shadow-cozy"
                    : "bg-white/60 text-cocoa-soft hover:bg-white"
                )}
              >
                <span className="text-lg">{l.emoji}</span>
                {l.label}
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
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              persist(active, v);
            }}
            className="w-full accent-rose-deep"
          />
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "flex h-14 w-14 items-center justify-center rounded-full shadow-cozy-lg transition hover:-translate-y-0.5",
          anyOn ? "bg-rose-deep text-white animate-float-slow" : "bg-white text-cocoa"
        )}
        title="Cozy ambience"
      >
        <span className="text-2xl">{anyOn ? "🎵" : "🔈"}</span>
      </button>
    </div>
  );
}
