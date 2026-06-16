"use client";

import Link from "next/link";
import { useIdentity } from "@/lib/identity";
import { CozyButton } from "./CozyButton";

export function IdentityModal({ onClose }: { onClose: () => void }) {
  const { discordEnabled, loginWithDiscord } = useIdentity();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="cozy-card w-full max-w-md p-7 animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-5xl">🫖</div>
          <h2 className="mt-2 text-2xl">Pull up a chair</h2>
          <p className="mt-1 text-sm text-cocoa-soft">
            Sign in to join the teaparty, keep your profile, and chat.
          </p>
        </div>

        {discordEnabled && (
          <CozyButton
            variant="discord"
            className="mt-5 w-full"
            onClick={() => loginWithDiscord()}
          >
            <DiscordGlyph /> Sign in with Discord
          </CozyButton>
        )}

        {discordEnabled && (
          <div className="my-4 flex items-center gap-3 text-xs text-cocoa-soft">
            <span className="h-px flex-1 bg-cocoa/15" /> or{" "}
            <span className="h-px flex-1 bg-cocoa/15" />
          </div>
        )}

        <Link href="/login" onClick={onClose} className="block">
          <CozyButton variant={discordEnabled ? "soft" : "primary"} className="w-full">
            Log in or sign up with email ✉️
          </CozyButton>
        </Link>
      </div>
    </div>
  );
}

function DiscordGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.3 4.5A19.8 19.8 0 0 0 15.4 3l-.2.5c1.8.4 2.6.9 3.5 1.6a13.3 13.3 0 0 0-11.4 0c.9-.7 1.9-1.3 3.5-1.6L10.6 3a19.8 19.8 0 0 0-4.9 1.5C2.5 9 1.9 13.4 2.2 17.8A19.6 19.6 0 0 0 8.2 21l.7-1.2c-.6-.2-1.3-.5-2-1l.5-.4a13.9 13.9 0 0 0 12.2 0l.5.4c-.7.5-1.4.8-2 1l.7 1.2a19.6 19.6 0 0 0 6-3.2c.4-5-.6-9.4-3.2-13.3ZM9 15.4c-1 0-1.7-.9-1.7-2s.8-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2Zm6 0c-1 0-1.7-.9-1.7-2s.8-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2Z" />
    </svg>
  );
}
