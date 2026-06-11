"use client";

import { useEffect, useState } from "react";
import { CozyLinkButton } from "./ui/CozyButton";

type Member = { username: string; status: string; avatar_url?: string };
type Widget = {
  configured: boolean;
  name: string;
  instant_invite?: string;
  presence_count?: number;
  members: Member[];
  widgetDisabled?: boolean;
};

const STATUS_DOT: Record<string, string> = {
  online: "bg-sage-deep",
  idle: "bg-honey",
  dnd: "bg-rose-deep",
  offline: "bg-cocoa-soft/40"
};

export function DiscordWidget() {
  const [data, setData] = useState<Widget | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/discord/widget")
        .then((r) => r.json())
        .then((d) => alive && setData(d))
        .catch(() => {});
    load();
    const t = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="cozy-card overflow-hidden p-0">
      <div className="flex items-center justify-between bg-[#5865F2] px-5 py-3 text-white">
        <div className="flex items-center gap-2 font-display font-semibold">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          {data?.presence_count ?? "•"} cozy folks online
        </div>
        {!data?.configured && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">demo</span>
        )}
      </div>

      <div className="p-4">
        <p className="mb-2 text-sm text-cocoa-soft">
          {data?.name ? `In ${data.name}` : "Loading the lounge…"}
        </p>
        <ul className="mb-4 grid max-h-44 grid-cols-1 gap-1 overflow-y-auto chat-scroll sm:grid-cols-2">
          {(data?.members ?? []).map((m, i) => (
            <li
              key={m.username + i}
              className="flex items-center gap-2 rounded-full bg-surface/60 px-3 py-1.5 text-sm"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[m.status] || STATUS_DOT.offline}`}
              />
              <span className="truncate">{m.username}</span>
            </li>
          ))}
          {data && data.members.length === 0 && (
            <li className="text-sm text-cocoa-soft">It's quiet right now — be the first in! </li>
          )}
        </ul>
        <CozyLinkButton
          variant="discord"
          href={data?.instant_invite || "https://discord.gg/your-invite"}
          external
          className="w-full"
        >
          Join our Discord 💌
        </CozyLinkButton>
        {data?.widgetDisabled && (
          <p className="mt-2 text-center text-[11px] text-cocoa-soft">
            Tip: enable the Server Widget in Discord settings to show live members.
          </p>
        )}
      </div>
    </div>
  );
}
