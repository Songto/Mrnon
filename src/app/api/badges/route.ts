import { NextResponse } from "next/server";
import { allBadgeDefs, badgesForUser } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET            -> all badge definitions
// GET ?user=ID   -> which of them a user has earned
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user");
  const all = allBadgeDefs();
  if (userId) {
    const owned = new Set(badgesForUser(userId));
    return NextResponse.json({
      badges: all.map((b) => ({ ...b, earned: owned.has(b.id) }))
    });
  }
  return NextResponse.json({ badges: all });
}
