"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useIdentity } from "@/lib/identity";
import { memberSlug } from "@/lib/members";
import { clsx } from "@/lib/clsx";
import { Avatar } from "./Avatar";
import { CozyButton } from "./CozyButton";
import { IdentityModal } from "./IdentityModal";

export function Nav() {
  const pathname = usePathname();
  const { identity, ready, logout } = useIdentity();
  const [modal, setModal] = useState(false);

  // "Profile" opens the user's PUBLIC profile (they can edit from there);
  // falls back to the editor if they haven't picked a name yet.
  const profileHref = identity ? `/members/${memberSlug(identity.name)}` : "/profile";
  const LINKS = [
    { href: "/", label: "Parlor", emoji: "🏡" },
    { href: "/tearoom", label: "Rooms", emoji: "💬" },
    { href: "/members", label: "Members", emoji: "🪪" },
    { href: "/feed", label: "Feed", emoji: "🌷" },
    { href: "/garden", label: "Garden", emoji: "🌿" },
    { href: profileHref, label: "Profile", emoji: "👤" }
  ];

  const isActive = (href: string) =>
    href === profileHref ? pathname === profileHref || pathname === "/profile" : pathname === href;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-cocoa/10 bg-cream/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="animate-wiggle text-2xl">🍓</span>
            <span className="bg-gradient-to-r from-strawberry to-sage-deep bg-clip-text text-transparent">
              OURCHAT
            </span>
            <span className="hidden text-cocoa-soft sm:inline">Teaparty</span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={clsx(
                      "cozy-link text-sm",
                      active ? "bg-rose/40 text-cocoa" : "text-cocoa-soft hover:bg-surface/70"
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
                  className="rounded-full px-2 py-1 text-xs text-cocoa-soft hover:bg-surface/70"
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
        <ul className="flex items-center justify-around border-t border-cocoa/10 px-2 py-1 md:hidden">
          {LINKS.map((l) => {
            const active = isActive(l.href);
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
