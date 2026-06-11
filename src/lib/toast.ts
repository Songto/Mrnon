"use client";

// Tiny window-event bus so any component can celebrate a freshly earned badge.
export type BadgeToast = { id: string; name: string; emoji: string; description: string };

export function celebrateBadges(badges: BadgeToast[] | undefined) {
  if (!badges || badges.length === 0 || typeof window === "undefined") return;
  for (const b of badges) {
    window.dispatchEvent(new CustomEvent<BadgeToast>("ourchat:badge", { detail: b }));
  }
}
