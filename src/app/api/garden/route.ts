import { NextResponse } from "next/server";
import {
  listGarden,
  waterPlant,
  getUser,
  growthScore,
  stageFor,
  seedStateFor,
  rollDailySeed
} from "@/lib/db";
import { getActor } from "@/lib/actor";

export const dynamic = "force-dynamic";

// GET             -> whole garden
// GET ?user=ID    -> a single plant's detail
// GET ?seeds=ID   -> a member's seed collection + daily roll state
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const seedsFor = searchParams.get("seeds");
  if (seedsFor) return NextResponse.json(seedStateFor(seedsFor));
  const userId = searchParams.get("user");
  if (userId) {
    const u = getUser(userId);
    if (!u) return NextResponse.json({ plant: null });
    const score = growthScore(u);
    const { stage, next, progress } = stageFor(score);
    return NextResponse.json({
      plant: {
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        score,
        stage: stage.key,
        stageLabel: stage.label,
        emoji: stage.emoji,
        next: next ? { label: next.label, min: next.min } : null,
        progress,
        waterReceived: u.waterReceived,
        badges: u.badges
      }
    });
  }
  return NextResponse.json({ garden: listGarden() });
}

// POST { action: "water" | "roll", ... }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  if (body.action === "roll") {
    const result = rollDailySeed(actor.userId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json(result);
  }
  if (body.action !== "water" || !body.targetId) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const result = waterPlant(String(body.targetId), actor.userId, actor.name);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });
  return NextResponse.json({
    ok: true,
    target: result.target,
    newBadges: result.newBadges,
    garden: listGarden()
  });
}
