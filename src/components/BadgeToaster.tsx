"use client";

import { useEffect, useState } from "react";
import type { BadgeToast } from "@/lib/toast";

export function BadgeToaster() {
  const [toasts, setToasts] = useState<(BadgeToast & { key: number })[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<BadgeToast>).detail;
      const key = Date.now() + Math.random();
      setToasts((t) => [...t, { ...detail, key }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.key !== key));
      }, 5000);
    };
    window.addEventListener("ourchat:badge", handler);
    return () => window.removeEventListener("ourchat:badge", handler);
  }, []);

  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.key}
          className="cozy-card flex animate-pop items-center gap-3 px-5 py-3 shadow-cozy-lg"
        >
          <span className="text-3xl animate-wiggle">{t.emoji}</span>
          <div>
            <p className="font-display text-sm">New badge: {t.name}!</p>
            <p className="text-xs text-cocoa-soft">{t.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
