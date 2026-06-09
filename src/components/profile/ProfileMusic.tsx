"use client";

import { useEffect, useRef, useState } from "react";
import { parseMusic } from "@/lib/profile-presets";

// Plays a member's profile theme. Tries to autoplay when the profile is opened,
// and always offers a clear play/pause control (browsers block audible autoplay
// until the visitor interacts, so the button is the reliable path).
export function ProfileMusic({ url, accent }: { url?: string; accent: string }) {
  const music = parseMusic(url);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Attempt autoplay on mount.
  useEffect(() => {
    if (music.kind === "none") return;
    setPlaying(true);
    if (music.kind === "audio" && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (music.kind === "none") return null;

  const toggle = () => {
    if (music.kind === "audio" && audioRef.current) {
      if (playing) audioRef.current.pause();
      else audioRef.current.play().catch(() => {});
    }
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

      {/* Hidden players */}
      {music.kind === "audio" && (
        <audio ref={audioRef} src={music.url} loop preload="none" />
      )}
      {music.kind === "youtube" && playing && (
        <iframe
          title="profile-theme"
          width="0"
          height="0"
          style={{ position: "absolute", width: 0, height: 0, border: 0, opacity: 0 }}
          src={`https://www.youtube.com/embed/${music.id}?autoplay=1&loop=1&playlist=${music.id}&controls=0`}
          allow="autoplay"
        />
      )}
    </div>
  );
}
