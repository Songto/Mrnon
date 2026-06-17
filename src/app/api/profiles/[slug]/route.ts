import { NextResponse } from "next/server";
import {
  getProfile,
  saveProfile,
  addProfileComment,
  deleteProfileComment,
  reportProfile,
  likeProfile,
  grantProfileBadge,
  earnedAdvancedBadges,
  displayedPlantFor
} from "@/lib/db";
import { getActor } from "@/lib/actor";
import { isAdminUserId } from "@/lib/roles";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const profile = getProfile(params.slug);
  return NextResponse.json({
    profile,
    earnedBadges: earnedAdvancedBadges(params.slug),
    displayedPlant: displayedPlantFor(params.slug)
  });
}

// POST { action: "save" | "comment" | "report" | "delete-comment" | "like" | "grant-badge", ... }
// The acting identity ALWAYS comes from the verified session (or an anonymous
// guest) — never from ids in the request body.
export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  if (body.action === "save") {
    const result = saveProfile(slug, body.patch ?? {}, actor.userId, actor.name);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json({ ok: true, profile: result.profile });
  }

  if (body.action === "comment") {
    if (!body.text) return NextResponse.json({ error: "Missing comment text" }, { status: 400 });
    const result = addProfileComment(
      slug,
      {
        authorId: actor.userId,
        authorName: actor.name,
        authorAvatar: actor.avatar,
        text: String(body.text)
      },
      actor.name
    );
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, comment: result.comment });
  }

  if (body.action === "delete-comment") {
    if (!body.commentId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const result = deleteProfileComment(slug, String(body.commentId), actor.userId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "like") {
    const result = likeProfile(slug, actor.userId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json(result);
  }

  if (body.action === "grant-badge") {
    if (!body.badge) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    // Admin powers are keyed off the verified account id — not a body field.
    const result = grantProfileBadge(slug, String(body.badge), isAdminUserId(actor.userId));
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json({ ok: true, grantedBadges: result.grantedBadges });
  }

  if (body.action === "report") {
    if (!body.reason) return NextResponse.json({ error: "Missing report fields" }, { status: 400 });
    const entry = reportProfile({
      slug,
      reporterId: actor.userId,
      reporterName: actor.name,
      reason: String(body.reason)
    });
    return NextResponse.json({ ok: true, id: entry.id });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
