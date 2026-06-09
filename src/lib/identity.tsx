"use client";

// A unified "who am I" hook that works in both modes:
//  - Discord OAuth session (real login), or
//  - a demo guest name stored in localStorage.
// Components just read `useIdentity()` and don't care which mode is active.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export type Identity = {
  userId: string;
  name: string;
  avatar?: string;
  source: "discord" | "guest";
};

type IdentityContext = {
  identity: Identity | null;
  ready: boolean;
  discordEnabled: boolean;
  loginWithDiscord: () => void;
  setGuestName: (name: string) => void;
  logout: () => void;
};

const Ctx = createContext<IdentityContext | null>(null);

const GUEST_KEY = "ourchat:guest-name";

const CUTE_NAMES = [
  "SleepyFox", "MochiBun", "PetalPip", "MapleWhisk", "BeanSprout",
  "CloudKitten", "HoneyMoth", "PixelPlum", "DewDrop", "CozyCub"
];

export function randomGuestName() {
  return CUTE_NAMES[Math.floor(Math.random() * CUTE_NAMES.length)] + Math.floor(Math.random() * 90 + 10);
}

export function IdentityProvider({
  discordEnabled,
  children
}: {
  discordEnabled: boolean;
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [guestName, setGuestNameState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const saved = localStorage.getItem(GUEST_KEY);
      if (saved) setGuestNameState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const setGuestName = useCallback((name: string) => {
    const clean = name.trim().slice(0, 24);
    if (!clean) return;
    setGuestNameState(clean);
    try {
      localStorage.setItem(GUEST_KEY, clean);
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => {
    if (session) {
      signOut();
      return;
    }
    setGuestNameState(null);
    try {
      localStorage.removeItem(GUEST_KEY);
    } catch {
      /* ignore */
    }
  }, [session]);

  const identity: Identity | null = useMemo(() => {
    if (session?.user) {
      const discordId = (session.user as { discordId?: string }).discordId;
      return {
        userId: discordId ? `discord:${discordId}` : `discord:${session.user.name}`,
        name: session.user.name || "Guest",
        avatar: session.user.image || undefined,
        source: "discord"
      };
    }
    if (guestName) {
      return {
        userId: "guest:" + guestName.toLowerCase().replace(/\s+/g, "-"),
        name: guestName,
        source: "guest"
      };
    }
    return null;
  }, [session, guestName]);

  const value: IdentityContext = {
    identity,
    ready: hydrated && status !== "loading",
    discordEnabled,
    loginWithDiscord: () => signIn("discord"),
    setGuestName,
    logout
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useIdentity() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useIdentity must be used within IdentityProvider");
  return ctx;
}
