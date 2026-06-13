import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { memberSlug } from "@/lib/members";
import { isAdminSlug } from "@/lib/roles";
import {
  adminListMembers,
  adminSetBanned,
  adminSetRole,
  adminAdjustStage,
  adminDeleteProfile,
  grantProfileBadge
} from "@/lib/db";

export const dynamic = "force-dynamic";

const ROLES = ["admin", "moderator", "vip", "member"] as const;

// Returns the caller's admin slug, or null if they're not an admin.
async function requireAdmin(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name;
  if (!name) return null;
  const slug = memberSlug(name);
  return isAdminSlug(slug) ? slug : null;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admins only" }, { status: 403 });
  return NextResponse.json({ members: adminListMembers() });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Admins only" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const action = body?.action as string | undefined;
  const slug = (body?.slug || "").toString();
  if (!slug) return NextResponse.json({ error: "Missing member" }, { status: 400 });

  // Don't let an admin lock themselves out.
  if (slug === admin && (action === "ban" || action === "delete")) {
    return NextResponse.json({ error: "You can't ban or delete your own account." }, { status: 400 });
  }

  switch (action) {
    case "ban":
      return NextResponse.json(adminSetBanned(slug, true));
    case "unban":
      return NextResponse.json(adminSetBanned(slug, false));
    case "role": {
      const role = body?.role;
      if (!ROLES.includes(role)) return NextResponse.json({ error: "Bad role" }, { status: 400 });
      return NextResponse.json(adminSetRole(slug, role));
    }
    case "stage":
      return NextResponse.json(adminAdjustStage(slug, Number(body?.delta) || 0));
    case "badge":
      return NextResponse.json(grantProfileBadge(slug, (body?.badge || "").toString(), true));
    case "delete":
      return NextResponse.json(adminDeleteProfile(slug));
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
