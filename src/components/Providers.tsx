"use client";

import { SessionProvider } from "next-auth/react";
import { IdentityProvider } from "@/lib/identity";

export default function Providers({
  discordEnabled,
  children
}: {
  discordEnabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <IdentityProvider discordEnabled={discordEnabled}>{children}</IdentityProvider>
    </SessionProvider>
  );
}
