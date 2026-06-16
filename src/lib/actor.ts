// Server-side "who is really making this request" resolver.
//
// The golden rule: NEVER trust a userId/name the client puts in a request body.
// Identity comes ONLY from a verified NextAuth session (a signed cookie). There
// is no anonymous/guest path — every acting endpoint requires a logged-in
// account (Discord or email).

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export type Actor = {
  userId: string;
  name: string;
  avatar?: string;
  source: "discord" | "email";
};

// Turn a verified session/JWT identity into an Actor, or null if unauthenticated.
export function resolveActor(
  verified: { uid?: string; name?: string | null; avatar?: string | null; source?: string } | null
): Actor | null {
  if (!verified?.uid) return null;
  return {
    userId: verified.uid,
    name: verified.name || "Member",
    avatar: verified.avatar || undefined,
    source: verified.source === "email" ? "email" : "discord"
  };
}

// For Next.js App Router route handlers. Reads the verified session cookie.
export async function getActor(): Promise<Actor | null> {
  const session = await getServerSession(authOptions);
  const su = session?.user as
    | { uid?: string; name?: string | null; image?: string | null; source?: string }
    | undefined;
  return resolveActor(
    su?.uid ? { uid: su.uid, name: su.name, avatar: su.image, source: su.source } : null
  );
}
