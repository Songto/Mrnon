import { NextResponse } from "next/server";
import { listGarden, waterPlant, getUser, growthScore, stageFor } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET            -> whole garden
// GET ?user=ID   -> a single plant's detail
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
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

// POST { action: "water", targetId, gardenerId, gardenerName }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || body.action !== "water" || !body.targetId || !body.gardenerId) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const result = waterPlant(body.targetId, body.gardenerId, body.gardenerName || "Guest");
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });
  return NextResponse.json({
    ok: true,
    target: result.target,
    newBadges: result.newBadges,
    garden: listGarden()
  });
}
