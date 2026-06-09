"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useIdentity } from "@/lib/identity";
import { clsx } from "@/lib/clsx";
import { Avatar } from "./Avatar";
import { CozyButton } from "./CozyButton";
import { IdentityModal } from "./IdentityModal";

const LINKS = [
  { href: "/", label: "Parlor", emoji: "🏡" },
  { href: "/tearoom", label: "Tearoom", emoji: "🍵" },
  { href: "/garden", label: "Garden", emoji: "🌿" },
  { href: "/events", label: "Events", emoji: "🎀" },
  { href: "/profile", label: "Me", emoji: "🪪" }
];

export function Nav() {
  const pathname = usePathname();
  const { identity, ready, logout } = useIdentity();
  const [modal, setModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/50 bg-cream/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="animate-wiggle text-2xl">🫖</span>
            <span className="bg-gradient-to-r from-rose-deep to-sage-deep bg-clip-text text-transparent">
              Ourchat
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={clsx(
                      "cozy-link text-sm",
                      active ? "bg-rose/40 text-cocoa" : "text-cocoa-soft hover:bg-white/70"
                    )}
                  >
                    <span className="mr-1">{l.emoji}</span>
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {ready && identity ? (
              <div className="flex items-center gap-2">
                <Avatar name={identity.name} src={identity.avatar} size={34} />
                <span className="hidden text-sm font-display sm:block">{identity.name}</span>
                <button
                  onClick={logout}
                  className="rounded-full px-2 py-1 text-xs text-cocoa-soft hover:bg-white/70"
                  title="Leave"
                >
                  ⏏
                </button>
              </div>
            ) : (
              <CozyButton onClick={() => setModal(true)} className="px-4 py-2 text-sm">
                Pull up a chair
              </CozyButton>
            )}
          </div>
        </nav>

        {/* Mobile tab bar */}
        <ul className="flex items-center justify-around border-t border-white/50 px-2 py-1 md:hidden">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={clsx(
                    "flex flex-col items-center rounded-2xl px-3 py-1 text-[10px]",
                    active ? "text-rose-deep" : "text-cocoa-soft"
                  )}
                >
                  <span className="text-lg">{l.emoji}</span>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </header>

      {modal && <IdentityModal onClose={() => setModal(false)} />}
    </>
  );
}
