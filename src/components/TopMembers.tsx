"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSocket } from "@/lib/socket-client";
import { ROLE_META, roleForSlug } from "@/lib/roles";
import { Avatar } from "./ui/Avatar";
import { CozyLinkButton } from "./ui/CozyButton";

type TopMember = {
  slug: string;
  displayName: string;
  avatarUrl?: string;
  accent: string;
  ownerId: string;
  score: number;
};

export function TopMembers() {
  const { socket } = useSocket();
  const [members, setMembers] = useState<TopMember[]>([]);
  const [online, setOnline] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/top-members")
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []))
      .catch(() => {});
  }, []);

  // Listen for who's currently online (people in chat rooms).
  useEffect(() => {
    if (!socket) return;
    const onLounge = (users: { userId: string }[]) =>
      setOnline(new Set(users.map((u) => u.userId)));
    socket.on("lounge", onLounge);
    return () => {
      socket.off("lounge", onLounge);
    };
  }, [socket]);

  // Online (most-active) first, then the rest — top 8.
  const ranked = [...members].sort((a, b) => {
    const ao = online.has(a.ownerId) ? 1 : 0;
    const bo = online.has(b.ownerId) ? 1 : 0;
    if (ao !== bo) return bo - ao;
    return b.score - a.score;
  });
  const top8 = ranked.slice(0, 8);
  const onlineCount = members.filter((m) => online.has(m.ownerId)).length;

  return (
    <div className="cozy-card overflow-hidden p-0">
      <div
        className="flex items-center justify-between px-5 py-3 text-night"
        style={{ background: "linear-gradient(135deg,#FF7E9B,#C9A0FF)" }}
      >
        <div className="flex items-center gap-2 font-display font-semibold">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-night/40" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-night" />
          </span>
          Top teaparty members
        </div>
        {onlineCount > 0 && (
          <span className="rounded-full bg-night/20 px-2 py-0.5 text-[11px]">{onlineCount} online</span>
        )}
      </div>

      <div className="p-4">
        {top8.length === 0 ? (
          <p className="py-4 text-center text-sm text-cocoa-soft">
            No members yet — set up your profile to be the first! 🌷
          </p>
        ) : (
          <ul className="mb-4 grid max-h-48 grid-cols-1 gap-1 overflow-y-auto chat-scroll sm:grid-cols-2">
            {top8.map((m) => {
              const isOnline = online.has(m.ownerId);
              const role = roleForSlug(m.slug);
              return (
                <li key={m.slug}>
                  <Link
                    href={`/members/${m.slug}`}
                    className="flex items-center gap-2 rounded-full px-2 py-1.5 text-sm transition hover:bg-cocoa/5"
                  >
                    <div className="relative shrink-0">
                      <Avatar name={m.displayName} src={m.avatarUrl} size={28} />
                      <span
                        className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface"
                        style={{ background: isOnline ? "#8FD08A" : "#c9bcc0" }}
                      />
                    </div>
                    <span className="truncate">{m.displayName}</span>
                    <span className="ml-auto shrink-0 text-xs" title={ROLE_META[role].label}>
                      {ROLE_META[role].emoji}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        <CozyLinkButton
          variant="discord"
          href="https://discord.gg/sDgzXBNjx8"
          external
          className="w-full"
        >
          Join our Discord 💌
        </CozyLinkButton>
      </div>
    </div>
  );
}
