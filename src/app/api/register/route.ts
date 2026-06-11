import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAuthUser } from "@/lib/db";

export const dynamic = "force-dynamic";

// POST { email, name, password } -> create an email/password account.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = (body?.email || "").toString();
  const name = (body?.name || "").toString();
  const password = (body?.password || "").toString();

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }
  if (password.length > 200) {
    return NextResponse.json({ error: "That password is too long." }, { status: 400 });
  }

  const hash = bcrypt.hashSync(password, 10);
  const result = createAuthUser(email, name, hash);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
