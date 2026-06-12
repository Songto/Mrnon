import { NextResponse } from "next/server";
import { listFeed, createFeedPost, waveFeedPost, deleteFeedPost, commentFeedPost } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ posts: listFeed() });
}

// POST { action: "post" | "wave" | "delete", ... }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (body.action === "post") {
    if (!body.authorId || !body.authorName || !body.text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const result = createFeedPost({
      authorId: body.authorId,
      authorName: body.authorName,
      authorAvatar: body.authorAvatar,
      authorSlug: body.authorSlug || "",
      text: body.text,
      game: body.game,
      vibe: body.vibe,
      accent: body.accent
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, posts: listFeed() });
  }

  if (body.action === "wave") {
    if (!body.postId || !body.userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const result = waveFeedPost(body.postId, body.userId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });
    return NextResponse.json(result);
  }

  if (body.action === "comment") {
    if (!body.postId || !body.authorId || !body.text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const result = commentFeedPost(body.postId, {
      authorId: body.authorId,
      authorName: body.authorName,
      authorAvatar: body.authorAvatar,
      authorSlug: body.authorSlug || "",
      text: body.text
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, comments: result.comments, posts: listFeed() });
  }

  if (body.action === "delete") {
    if (!body.postId || !body.userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const result = deleteFeedPost(body.postId, body.userId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json({ ok: true, posts: listFeed() });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
