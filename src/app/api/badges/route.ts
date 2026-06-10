import { NextResponse } from "next/server";
import { questBoardFor } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET ?user=ID -> the user's quest board: 9 quests with progress + the 5
// advanced badges with earned/locked state.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user") || "";
  return NextResponse.json(questBoardFor(userId));
}
