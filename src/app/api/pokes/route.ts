import { NextResponse } from "next/server";
import { pokeUser, listPokes, markPokesSeen, clearPoke } from "@/lib/db";
import { getActor } from "@/lib/actor";
import { rateLimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

// GET ?user=ID -> { pokes, unseen }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");
  if (!user) return NextResponse.json({ pokes: [], unseen: 0 });
  return NextResponse.json(listPokes(user));
}

// POST { action: "poke" | "seen" | "clear", ... }
// The acting identity comes from the verified session (or a guest), so a caller
// can only poke/clear AS themselves — never on behalf of someone else.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  if (body.action === "poke") {
    if (!body.toId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    if (!rateLimit(`poke:${actor.userId}`, 30, 60_000)) {
      return NextResponse.json({ error: "That's a lot of pokes — give it a sec 👉👈" }, { status: 429 });
    }
    const result = pokeUser({
      toId: String(body.toId),
      fromId: actor.userId,
      fromName: actor.name,
      fromAvatar: actor.avatar,
      fromSlug: body.fromSlug || ""
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "seen") {
    markPokesSeen(actor.userId);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "clear") {
    if (!body.pokeId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const result = clearPoke(String(body.pokeId), actor.userId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
