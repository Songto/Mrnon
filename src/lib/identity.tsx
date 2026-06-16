"use client";

// A unified "who am I" hook. Identity comes solely from a real login —
// Discord OAuth or an email/password account. There is no guest mode.
// Components read `useIdentity()`; when `identity` is null, prompt a sign-in.

import { createContext, useCallback, useContext, useMemo } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export type Identity = {
  userId: string;
  name: string;
  avatar?: string;
  source: "discord" | "email";
};

type IdentityContext = {
  identity: Identity | null;
  ready: boolean;
  discordEnabled: boolean;
  loginWithDiscord: () => void;
  logout: () => void;
};

const Ctx = createContext<IdentityContext | null>(null);

export function IdentityProvider({
  discordEnabled,
  children
}: {
  discordEnabled: boolean;
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  const logout = useCallback(() => {
    // Don't let NextAuth do the redirect — if NEXTAUTH_URL is misconfigured in
    // production it would bounce the browser to a dead address. Clear the
    // session, then navigate home ourselves on the current origin.
    signOut({ redirect: false }).finally(() => {
      window.location.href = "/";
    });
  }, []);

  const identity: Identity | null = useMemo(() => {
    if (session?.user) {
      const su = session.user as { uid?: string; source?: string };
      const uid = su.uid || `discord:${session.user.name}`;
      return {
        userId: uid,
        name: session.user.name || "Member",
        avatar: session.user.image || undefined,
        source: su.source === "email" ? "email" : "discord"
      };
    }
    return null;
  }, [session]);

  const value: IdentityContext = {
    identity,
    ready: status !== "loading",
    discordEnabled,
    loginWithDiscord: () => signIn("discord"),
    logout
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useIdentity() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useIdentity must be used within IdentityProvider");
  return ctx;
}
