import { NextResponse } from "next/server";
import { listEvents, createEvent, rsvpEvent } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ events: listEvents() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  // RSVP action
  if (body.action === "rsvp" && body.eventId && body.userId) {
    const result = rsvpEvent(body.eventId, body.userId, body.name || "Guest");
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });
    return NextResponse.json({ events: listEvents(), newBadges: result.newBadges });
  }

  // Create event
  const { title, description, date, time, host, discordUrl } = body;
  if (!title || !date) {
    return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
  }
  const evt = createEvent({
    title: String(title).slice(0, 100),
    description: String(description || "").slice(0, 500),
    date: String(date),
    time: String(time || "18:00"),
    host: String(host || "A cozy host").slice(0, 40),
    discordUrl: discordUrl ? String(discordUrl) : undefined
  });
  return NextResponse.json({ event: evt, events: listEvents() });
}
