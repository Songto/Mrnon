import { NextResponse } from "next/server";
import {
  getProfile,
  saveProfile,
  addProfileComment,
  deleteProfileComment,
  reportProfile,
  toggleProfileLike,
  grantProfileBadge,
  isAdminUser,
  earnedAdvancedBadges
} from "@/lib/db";
import { ADMIN_SLUGS } from "@/lib/roles";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const profile = getProfile(params.slug);
  return NextResponse.json({ profile, earnedBadges: earnedAdvancedBadges(params.slug) });
}

// POST { action: "save" | "comment" | "report" | "delete-comment", ... }
export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (body.action === "save") {
    if (!body.editorId || !body.editorName) {
      return NextResponse.json({ error: "Who are you?" }, { status: 400 });
    }
    const result = saveProfile(slug, body.patch ?? {}, body.editorId, body.editorName);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json({ ok: true, profile: result.profile });
  }

  if (body.action === "comment") {
    if (!body.authorId || !body.authorName || !body.text) {
      return NextResponse.json({ error: "Missing comment fields" }, { status: 400 });
    }
    const result = addProfileComment(slug, {
      authorId: body.authorId,
      authorName: body.authorName,
      authorAvatar: body.authorAvatar,
      text: body.text
    }, body.displayName);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, comment: result.comment });
  }

  if (body.action === "delete-comment") {
    if (!body.commentId || !body.requesterId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const result = deleteProfileComment(slug, body.commentId, body.requesterId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "like") {
    if (!body.userId) return NextResponse.json({ error: "Missing user" }, { status: 400 });
    const result = toggleProfileLike(slug, body.userId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json(result);
  }

  if (body.action === "grant-badge") {
    if (!body.granterId || !body.badge) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const result = grantProfileBadge(slug, body.badge, isAdminUser(body.granterId, ADMIN_SLUGS));
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json({ ok: true, grantedBadges: result.grantedBadges });
  }

  if (body.action === "report") {
    if (!body.reporterId || !body.reason) {
      return NextResponse.json({ error: "Missing report fields" }, { status: 400 });
    }
    const entry = reportProfile({
      slug,
      reporterId: body.reporterId,
      reporterName: body.reporterName || "Someone",
      reason: body.reason
    });
    return NextResponse.json({ ok: true, id: entry.id });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
