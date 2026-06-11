import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Cozy mock used in demo mode (no DISCORD_GUILD_ID configured).
const MOCK = {
  configured: false,
  name: "Ourchat Tea Garden",
  instant_invite: process.env.DISCORD_INVITE_URL || "https://discord.gg/your-invite",
  presence_count: 7,
  members: [
    { username: "TeaMistress", status: "online" },
    { username: "MochiBun", status: "idle" },
    { username: "PetalPip", status: "online" },
    { username: "MoonDrop", status: "dnd" },
    { username: "BeanSprout", status: "online" },
    { username: "MapleWhisk", status: "idle" },
    { username: "CloudKitten", status: "online" }
  ]
};

export async function GET() {
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId) {
    return NextResponse.json(MOCK);
  }
  try {
    const res = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`, {
      next: { revalidate: 30 }
    });
    if (!res.ok) {
      // Widget likely disabled in server settings — fall back gracefully.
      return NextResponse.json({ ...MOCK, configured: true, widgetDisabled: true });
    }
    const data = await res.json();
    return NextResponse.json({
      configured: true,
      name: data.name,
      instant_invite: data.instant_invite || process.env.DISCORD_INVITE_URL,
      presence_count: data.presence_count,
      members: (data.members || []).map((m: any) => ({
        username: m.username,
        status: m.status,
        avatar_url: m.avatar_url
      }))
    });
  } catch {
    return NextResponse.json({ ...MOCK, configured: true, error: true });
  }
}
