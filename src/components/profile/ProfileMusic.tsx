"use client";

import { useEffect, useRef, useState } from "react";
import { parseMusic } from "@/lib/profile-presets";

// Plays a member's profile theme. Tries to autoplay when the profile is opened,
// offers a play/pause control, and a volume slider (so a loud theme can be
// turned down). The chosen volume is remembered across profiles.
const VOL_KEY = "ourchat:profile-volume";

export function ProfileMusic({ url, accent }: { url?: string; accent: string }) {
  const music = parseMusic(url);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Restore the saved volume preference once.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(VOL_KEY);
      if (raw != null) {
        const v = parseFloat(raw);
        if (!Number.isNaN(v)) setVolume(Math.max(0, Math.min(1, v)));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Attempt autoplay on mount (and when the theme changes).
  useEffect(() => {
    if (music.kind === "none") return;
    setPlaying(true);
    if (music.kind === "audio" && audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Send a YouTube IFrame API command (volume / pause / play).
  const ytCommand = (func: string, args: (number | string)[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  };

  // Apply volume to whichever player is active, and remember it.
  useEffect(() => {
    if (music.kind === "audio" && audioRef.current) audioRef.current.volume = volume;
    if (music.kind === "youtube") ytCommand("setVolume", [Math.round(volume * 100)]);
    try {
      localStorage.setItem(VOL_KEY, String(volume));
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  if (music.kind === "none") return null;

  const toggle = () => {
    if (music.kind === "audio" && audioRef.current) {
      if (playing) audioRef.current.pause();
      else audioRef.current.play().catch(() => {});
    }
    if (music.kind === "youtube") ytCommand(playing ? "pauseVideo" : "playVideo");
    setPlaying((p) => !p);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-display text-night shadow-cozy transition active:scale-95"
        style={{ background: accent }}
        title={playing ? "Pause theme" : "Play theme"}
      >
        <span className={playing ? "animate-pulse" : ""}>{playing ? "♪ playing" : "▶ play theme"}</span>
      </button>

      {/* Volume slider — turn a loud theme down (or all the way off). */}
      <div className="flex items-center gap-1.5 rounded-full bg-surface/80 px-2.5 py-1">
        <span className="text-xs text-cocoa-soft" title="Volume">
          {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          aria-label="Theme volume"
          className="h-1 w-20 cursor-pointer accent-rose-deep"
          style={{ accentColor: accent }}
        />
      </div>

      {/* Hidden players */}
      {music.kind === "audio" && (
        <audio ref={audioRef} src={music.url} loop preload="none" />
      )}
      {music.kind === "youtube" && playing && (
        <iframe
          ref={iframeRef}
          title="profile-theme"
          width="0"
          height="0"
          style={{ position: "absolute", width: 0, height: 0, border: 0, opacity: 0 }}
          src={`https://www.youtube.com/embed/${music.id}?autoplay=1&loop=1&playlist=${music.id}&controls=0&enablejsapi=1`}
          onLoad={() => ytCommand("setVolume", [Math.round(volume * 100)])}
          allow="autoplay"
        />
      )}
    </div>
  );
}
