// Procedural cozy ambience — every sound is synthesized live with the Web Audio
// API, so there are NO audio files to ship, host, or lose. Each generator
// returns a handle whose stop() tears down its nodes and schedulers.

export type AmbienceHandle = { stop: () => void };
export type AmbienceFactory = (ctx: AudioContext, out: AudioNode) => AmbienceHandle;

// ---- noise sources (2s buffers, looped) ----
function noiseBuffer(ctx: AudioContext, kind: "white" | "brown"): AudioBuffer {
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  if (kind === "white") {
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  } else {
    // brown (red) noise — integrated white, gentler/deeper.
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    }
  }
  return buf;
}

function loopNoise(ctx: AudioContext, kind: "white" | "brown"): AudioBufferSourceNode {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, kind);
  src.loop = true;
  src.start();
  return src;
}

// A short percussive blip (used for crackles, droplets, bird chirps, bells).
function blip(
  ctx: AudioContext,
  out: AudioNode,
  opts: { type?: OscillatorType; from: number; to?: number; dur: number; gain: number; noise?: boolean }
) {
  const now = ctx.currentTime;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(opts.gain, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + opts.dur);
  g.connect(out);
  if (opts.noise) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, "white");
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = opts.from;
    src.connect(bp).connect(g);
    src.start(now);
    src.stop(now + opts.dur + 0.05);
  } else {
    const osc = ctx.createOscillator();
    osc.type = opts.type ?? "sine";
    osc.frequency.setValueAtTime(opts.from, now);
    if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, now + opts.dur);
    osc.connect(g);
    osc.start(now);
    osc.stop(now + opts.dur + 0.05);
  }
}

// Repeatedly run `fn` at a randomized interval; returns a canceller.
function scheduler(minMs: number, maxMs: number, fn: () => void): () => void {
  let timer: ReturnType<typeof setTimeout>;
  const tick = () => {
    fn();
    timer = setTimeout(tick, minMs + Math.random() * (maxMs - minMs));
  };
  timer = setTimeout(tick, minMs + Math.random() * (maxMs - minMs));
  return () => clearTimeout(timer);
}

const PENTATONIC = [523.25, 587.33, 698.46, 783.99, 880.0, 1046.5]; // C5 major pentatonic-ish

// ---- the six cozy generators ----
export const AMBIENCE: Record<string, AmbienceFactory> = {
  // 🌧️ Rain — hissy filtered white noise + occasional droplets.
  rain: (ctx, out) => {
    const noise = loopNoise(ctx, "white");
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 700;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 8000;
    const g = ctx.createGain();
    g.gain.value = 0.5;
    noise.connect(hp).connect(lp).connect(g).connect(out);
    const stopDrops = scheduler(180, 700, () =>
      blip(ctx, out, { from: 1200 + Math.random() * 2500, dur: 0.05, gain: 0.05, noise: true })
    );
    return {
      stop: () => {
        stopDrops();
        noise.stop();
        g.disconnect();
      }
    };
  },

  // 🔥 Fireplace — low brown-noise roar + random crackles.
  fire: (ctx, out) => {
    const noise = loopNoise(ctx, "brown");
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 500;
    const g = ctx.createGain();
    g.gain.value = 0.5;
    noise.connect(lp).connect(g).connect(out);
    const stopCrackle = scheduler(70, 380, () => {
      const n = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++)
        setTimeout(
          () => blip(ctx, out, { from: 1500 + Math.random() * 2500, dur: 0.04, gain: 0.08, noise: true }),
          i * 25
        );
    });
    return {
      stop: () => {
        stopCrackle();
        noise.stop();
        g.disconnect();
      }
    };
  },

  // 🎐 Chimes — sparse, softly-decaying bell tones.
  chimes: (ctx, out) => {
    const stop = scheduler(1400, 4200, () => {
      const f = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
      blip(ctx, out, { type: "sine", from: f, dur: 2.4, gain: 0.16 });
      blip(ctx, out, { type: "sine", from: f * 2, dur: 1.6, gain: 0.05 });
    });
    return { stop };
  },

  // 🌊 Waves — brown noise that swells with a slow LFO.
  waves: (ctx, out) => {
    const noise = loopNoise(ctx, "brown");
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 700;
    const g = ctx.createGain();
    g.gain.value = 0.18;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.09;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.16;
    lfo.connect(lfoGain).connect(g.gain);
    lfo.start();
    noise.connect(lp).connect(g).connect(out);
    return {
      stop: () => {
        lfo.stop();
        noise.stop();
        g.disconnect();
      }
    };
  },

  // 🌳 Forest — soft wind bed + occasional bird chirps.
  forest: (ctx, out) => {
    const noise = loopNoise(ctx, "white");
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 500;
    bp.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.value = 0.28;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.13;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 250;
    lfo.connect(lfoGain).connect(bp.frequency);
    lfo.start();
    noise.connect(bp).connect(g).connect(out);
    const stopBirds = scheduler(2600, 7000, () => {
      const base = 1800 + Math.random() * 1400;
      const notes = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < notes; i++)
        setTimeout(
          () => blip(ctx, out, { type: "sine", from: base, to: base * 1.4, dur: 0.12, gain: 0.06 }),
          i * 110
        );
    });
    return {
      stop: () => {
        stopBirds();
        lfo.stop();
        noise.stop();
        g.disconnect();
      }
    };
  },

  // 🌙 Night — warm low pad + very sparse low bell.
  night: (ctx, out) => {
    const g = ctx.createGain();
    g.gain.value = 0.12;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 600;
    lp.connect(g).connect(out);
    const freqs = [110, 165, 220.5]; // A2 + fifth + slightly-detuned octave
    const oscs = freqs.map((f) => {
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = f;
      o.connect(lp);
      o.start();
      return o;
    });
    const stopBell = scheduler(5000, 11000, () =>
      blip(ctx, out, { type: "sine", from: 392, dur: 3, gain: 0.07 })
    );
    return {
      stop: () => {
        stopBell();
        oscs.forEach((o) => o.stop());
        g.disconnect();
      }
    };
  }
};
