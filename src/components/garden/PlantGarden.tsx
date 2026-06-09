"use client";

import { useEffect, useState } from "react";
import { useIdentity } from "@/lib/identity";
import { useSocket } from "@/lib/socket-client";
import { celebrateBadges } from "@/lib/toast";
import { Plant } from "./Plant";
import { Avatar } from "../ui/Avatar";
import { CozyButton } from "../ui/CozyButton";

const STAGE_ORDER = ["seed", "sprout", "leafy", "budding", "bloom", "flourishing"];

type GardenPlant = {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  stage: string;
  stageLabel: string;
  emoji: string;
  progress: number;
  waterReceived: number;
};

type Online = { userId: string; name: string; avatar?: string };

export function PlantGarden() {
  const { identity } = useIdentity();
  const { socket } = useSocket();
  const [garden, setGarden] = useState<GardenPlant[]>([]);
  const [online, setOnline] = useState<Online[]>([]);
  const [watering, setWatering] = useState<string | null>(null);

  const load = () =>
    fetch("/api/garden")
      .then((r) => r.json())
      .then((d) => setGarden(d.garden || []))
      .catch(() => {});

  useEffect(() => {
    load();
    const t = setInterval(load, 15_000);
    return () => clearInterval(t);
  }, []);

  // Who's online right now (from the chat presence lounge).
  useEffect(() => {
    if (!socket) return;
    const onLounge = (list: Online[]) => setOnline(list);
    socket.on("lounge", onLounge);
    return () => {
      socket.off("lounge", onLounge);
    };
  }, [socket]);

  const water = async (targetId: string) => {
    if (!identity) return;
    setWatering(targetId);
    try {
      const res = await fetch("/api/garden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "water",
          targetId,
          gardenerId: identity.userId,
          gardenerName: identity.name
        })
      }).then((r) => r.json());
      if (res.garden) setGarden(res.garden);
      celebrateBadges(res.newBadges);
    } finally {
      setWatering(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {garden.length === 0 && (
            <div className="cozy-card col-span-full p-8 text-center text-cocoa-soft">
              The garden is empty soil for now 🌱 — chat in the tearoom to sprout the first plant!
            </div>
          )}
          {garden.map((p) => {
            const stageIndex = Math.max(0, STAGE_ORDER.indexOf(p.stage));
            const mine = p.id === identity?.userId;
            return (
              <div key={p.id} className="cozy-card flex flex-col items-center p-4 text-center">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar name={p.name} src={p.avatar} size={28} />
                    <span className="max-w-[110px] truncate text-sm font-display">
                      {mine ? "you" : p.name}
                    </span>
                  </div>
                  {p.waterReceived > 0 && (
                    <span className="text-[11px] text-sky-600">💧{p.waterReceived}</span>
                  )}
                </div>

                <Plant stageIndex={stageIndex} size={110} />

                <p className="text-sm font-display">
                  {p.emoji} {p.stageLabel}
                </p>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-parchment">
                  <div
                    className="h-full rounded-full bg-sage-deep transition-all"
                    style={{ width: `${Math.round(p.progress * 100)}%` }}
                  />
                </div>

                {identity && !mine && (
                  <CozyButton
                    variant="soft"
                    className="mt-3 px-4 py-1.5 text-xs"
                    disabled={watering === p.id}
                    onClick={() => water(p.id)}
                  >
                    {watering === p.id ? "Watering…" : "Water 💧"}
                  </CozyButton>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Online lounge */}
      <aside className="cozy-card h-fit p-4">
        <h3 className="flex items-center gap-2 text-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage-deep/60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sage-deep" />
          </span>
          Cozy lounge
        </h3>
        <p className="mb-3 text-xs text-cocoa-soft">Who's curled up here right now</p>
        {online.length === 0 ? (
          <p className="text-sm text-cocoa-soft">
            Nobody's seated yet — pop into the{" "}
            <a href="/tearoom" className="text-rose-deep underline">
              tearoom
            </a>{" "}
            to appear here. 🛋️
          </p>
        ) : (
          <ul className="space-y-2">
            {online.map((o) => (
              <li
                key={o.userId}
                className="flex items-center gap-2 rounded-full bg-surface/60 px-3 py-1.5 text-sm"
              >
                <Avatar name={o.name} src={o.avatar} size={26} />
                <span className="truncate">{o.name}</span>
                <span className="ml-auto text-base">🪑</span>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
