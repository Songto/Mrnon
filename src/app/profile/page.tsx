"use client";

import { useEffect, useState } from "react";
import { useIdentity } from "@/lib/identity";
import { Avatar } from "@/components/ui/Avatar";
import { Plant } from "@/components/garden/Plant";
import { BadgeShelf } from "@/components/events/BadgeShelf";
import { CozyButton } from "@/components/ui/CozyButton";
import { IdentityModal } from "@/components/ui/IdentityModal";

const STAGE_ORDER = ["seed", "sprout", "leafy", "budding", "bloom", "flourishing"];

type PlantData = {
  name: string;
  avatar?: string;
  score: number;
  stage: string;
  stageLabel: string;
  emoji: string;
  progress: number;
  waterReceived: number;
  next: { label: string; min: number } | null;
};

export default function ProfilePage() {
  const { identity, ready, logout } = useIdentity();
  const [plant, setPlant] = useState<PlantData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!identity) return;
    fetch(`/api/garden?user=${encodeURIComponent(identity.userId)}`)
      .then((r) => r.json())
      .then((d) => setPlant(d.plant))
      .catch(() => {});
  }, [identity]);

  if (ready && !identity) {
    return (
      <>
        <div className="cozy-card flex flex-col items-center gap-3 p-10 text-center">
          <div className="text-6xl animate-wiggle">🪪</div>
          <h2 className="text-2xl">No cozy card yet</h2>
          <p className="max-w-sm text-sm text-cocoa-soft">
            Pull up a chair to start your profile, grow a plant, and collect badges.
          </p>
          <CozyButton onClick={() => setShowModal(true)}>Pull up a chair ✨</CozyButton>
        </div>
        {showModal && <IdentityModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  if (!identity) return null;

  const stageIndex = plant ? Math.max(0, STAGE_ORDER.indexOf(plant.stage)) : 0;

  return (
    <div className="space-y-8">
      <div className="cozy-card flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center">
          <Avatar name={identity.name} src={identity.avatar} size={88} />
          <h1 className="mt-3 text-2xl">{identity.name}</h1>
          <span className="rounded-full bg-parchment px-3 py-0.5 text-xs text-cocoa-soft">
            {identity.source === "discord" ? "Discord member" : "Cozy guest"}
          </span>
          <button
            onClick={logout}
            className="mt-2 text-xs text-cocoa-soft underline hover:text-rose-deep"
          >
            Leave the table
          </button>
        </div>

        <div className="flex-1">
          <h3 className="text-lg">Your garden plant</h3>
          <div className="mt-2 flex items-center gap-4 rounded-cozy bg-parchment/60 p-4">
            <Plant stageIndex={stageIndex} size={96} />
            <div className="flex-1">
              <p className="font-display">
                {plant?.emoji} {plant?.stageLabel ?? "Seedling"}
              </p>
              <p className="text-xs text-cocoa-soft">
                Growth score: {plant?.score ?? 0}
                {plant?.next && ` · next: ${plant.next.label} at ${plant.next.min}`}
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface/70">
                <div
                  className="h-full rounded-full bg-sage-deep transition-all"
                  style={{ width: `${Math.round((plant?.progress ?? 0) * 100)}%` }}
                />
              </div>
              {plant && plant.waterReceived > 0 && (
                <p className="mt-2 text-xs text-sky-600">
                  💧 Watered {plant.waterReceived} time
                  {plant.waterReceived === 1 ? "" : "s"} by friends
                </p>
              )}
            </div>
          </div>
          <p className="mt-3 text-xs text-cocoa-soft">
            Chat in the tearoom, RSVP to events, and visit daily to help it bloom 🌸
          </p>
        </div>
      </div>

      <section>
        <h3 className="mb-3 text-xl">Your badge shelf 🏆</h3>
        <BadgeShelf />
      </section>
    </div>
  );
}
