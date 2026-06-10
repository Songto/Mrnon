import { NextResponse } from "next/server";
import { listTopMembers } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ members: listTopMembers() });
}
