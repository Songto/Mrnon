import { NextResponse } from "next/server";
import { storeStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

// Diagnostic: reports whether the live server is persisting to the database or
// falling back to temporary file storage. Safe to expose — contains no secrets.
export async function GET() {
  const status = await storeStatus();
  return NextResponse.json(status);
}
