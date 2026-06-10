"use client";

import { useEffect, useState } from "react";
import { todayKey, type Tea } from "@/lib/tea";
import { CozyButton } from "./ui/CozyButton";

const COOKIE_KEY = "ourchat:cookie";

export function TeaOfTheDay({ initialTea }: { initialTea: Tea }) {
  const [fortune, setFortune] = useState<string | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [crackedToday, setCrackedToday] = useState(false);

  // One crack per day per person — remember today's fortune if already cracked.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(COOKIE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.day === todayKey()) {
          setFortune(saved.fortune);
          setCrackedToday(true);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const draw = async () => {
    if (crackedToday) return;
    setDrawing(true);
    try {
      const r = await fetch("/api/tea?fortune=1").then((res) => res.json());
      setFortune(r.fortune);
      setCrackedToday(true);
      try {
        localStorage.setItem(COOKIE_KEY, JSON.stringify({ day: todayKey(), fortune: r.fortune }));
      } catch {
        /* ignore */
      }
    } finally {
      setDrawing(false);
    }
  };

  return (
    <div className="cozy-card relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -right-4 -top-6 text-8xl opacity-10">
        {initialTea.emoji}
      </div>
      <p className="font-display text-xs uppercase tracking-widest text-rose-deep">
        Tea of the day
      </p>
      <div className="mt-2 flex items-center gap-4">
        <div className="relative">
          <div className="text-6xl">{initialTea.emoji}</div>
          {/* rising steam */}
          <span className="steam-puff left-3 animate-steam" style={{ animationDelay: "0s" }} />
          <span className="steam-puff left-7 animate-steam" style={{ animationDelay: "1s" }} />
          <span className="steam-puff left-5 animate-steam" style={{ animationDelay: "0.5s" }} />
        </div>
        <div>
          <h3 className="text-2xl">{initialTea.name}</h3>
          <p className="text-sm text-cocoa-soft">{initialTea.note}</p>
          <p className="mt-1 text-sm italic text-sage-deep">{initialTea.mood}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-parchment/70 p-4">
        {fortune ? (
          <p className="animate-pop text-center text-sm">🥠 {fortune}</p>
        ) : (
          <p className="text-center text-sm text-cocoa-soft">
            Crack a fortune cookie while your tea steeps…
          </p>
        )}
        <div className="mt-3 flex justify-center">
          {crackedToday ? (
            <span className="text-xs text-cocoa-soft">
              That&apos;s your cookie for today — come back tomorrow 🌙
            </span>
          ) : (
            <CozyButton variant="soft" onClick={draw} disabled={drawing} className="text-sm">
              {drawing ? "Cracking…" : "Crack a cookie 🥠"}
            </CozyButton>
          )}
        </div>
      </div>
    </div>
  );
}
