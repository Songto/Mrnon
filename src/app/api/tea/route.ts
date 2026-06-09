import { NextResponse } from "next/server";
import { teaOfTheDay, drawFortune } from "@/lib/tea";

export const dynamic = "force-dynamic";

// GET -> today's tea. GET ?fortune=1 -> also include a fresh fortune draw.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wantFortune = searchParams.has("fortune");
  return NextResponse.json({
    tea: teaOfTheDay(),
    fortune: wantFortune ? drawFortune() : undefined
  });
}
