import { NextResponse } from "next/server";
import { pokeUser, listPokes, markPokesSeen, clearPoke } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET ?user=ID -> { pokes, unseen }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");
  if (!user) return NextResponse.json({ pokes: [], unseen: 0 });
  return NextResponse.json(listPokes(user));
}

// POST { action: "poke" | "seen" | "clear", ... }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (body.action === "poke") {
    if (!body.toId || !body.fromId || !body.fromName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const result = pokeUser({
      toId: body.toId,
      fromId: body.fromId,
      fromName: body.fromName,
      fromAvatar: body.fromAvatar,
      fromSlug: body.fromSlug || ""
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "seen") {
    if (!body.user) return NextResponse.json({ error: "Missing user" }, { status: 400 });
    markPokesSeen(body.user);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "clear") {
    if (!body.pokeId || !body.user) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const result = clearPoke(body.pokeId, body.user);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
