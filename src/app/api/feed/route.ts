import { NextResponse } from "next/server";
import { listFeed, createFeedPost, waveFeedPost, deleteFeedPost, commentFeedPost } from "@/lib/db";
import { getActor } from "@/lib/actor";
import { rateLimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ posts: listFeed() });
}

// POST { action: "post" | "wave" | "comment" | "delete", ... }
// Identity comes from the verified session (or a guest) — never the body.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  if (body.action === "post") {
    if (!body.text) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    if (!rateLimit(`feed-post:${actor.userId}`, 10, 60_000)) {
      return NextResponse.json({ error: "You're posting too fast — take a breath ☕" }, { status: 429 });
    }
    const result = createFeedPost({
      authorId: actor.userId,
      authorName: actor.name,
      authorAvatar: actor.avatar,
      authorSlug: body.authorSlug || "",
      text: String(body.text),
      game: body.game,
      vibe: body.vibe,
      accent: body.accent
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, posts: listFeed() });
  }

  if (body.action === "wave") {
    if (!body.postId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const result = waveFeedPost(String(body.postId), actor.userId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });
    return NextResponse.json(result);
  }

  if (body.action === "comment") {
    if (!body.postId || !body.text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!rateLimit(`feed-comment:${actor.userId}`, 20, 60_000)) {
      return NextResponse.json({ error: "Slow down a little 🍵" }, { status: 429 });
    }
    const result = commentFeedPost(String(body.postId), {
      authorId: actor.userId,
      authorName: actor.name,
      authorAvatar: actor.avatar,
      authorSlug: body.authorSlug || "",
      text: String(body.text)
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, comments: result.comments, posts: listFeed() });
  }

  if (body.action === "delete") {
    if (!body.postId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const result = deleteFeedPost(String(body.postId), actor.userId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json({ ok: true, posts: listFeed() });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
