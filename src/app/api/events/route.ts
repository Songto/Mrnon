import { NextResponse } from "next/server";
import { listEvents, createEvent, rsvpEvent } from "@/lib/db";
import { getActor } from "@/lib/actor";
import { rateLimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

// Only http(s) links are allowed for the Discord button — otherwise the URL is
// rendered into an <a href> on the events page and a "javascript:" value would
// be a stored XSS. Returns a safe URL or undefined.
function safeUrl(raw: unknown): string | undefined {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  try {
    const u = new URL(raw.trim());
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString().slice(0, 300);
  } catch {
    /* not a valid absolute URL */
  }
  return undefined;
}

export async function GET() {
  return NextResponse.json({ events: listEvents() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  // RSVP action — always as the verified caller.
  if (body.action === "rsvp" && body.eventId) {
    const result = rsvpEvent(String(body.eventId), actor.userId, actor.name);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 404 });
    return NextResponse.json({ events: listEvents(), newBadges: result.newBadges });
  }

  // Create event
  const { title, description, date, time, host, discordUrl } = body;
  if (!title || !date) {
    return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
  }
  if (!rateLimit(`event-create:${actor.userId}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many events at once — slow down 🫖" }, { status: 429 });
  }
  const evt = createEvent({
    title: String(title).slice(0, 100),
    description: String(description || "").slice(0, 500),
    date: String(date).slice(0, 10),
    time: String(time || "18:00").slice(0, 5),
    host: String(host || actor.name).slice(0, 40),
    discordUrl: safeUrl(discordUrl)
  });
  return NextResponse.json({ event: evt, events: listEvents() });
}
