// Member showcase data, modelled on our OURCHAT Teaparty Discord roles.
// Edit this list freely — add members, change tags, statuses, or notes.
// (When real Discord login is enabled later, this can be replaced by a live
//  pull from the guild member list.)

export type Presence = "online" | "idle" | "dnd" | "offline";

export type Member = {
  name: string;
  tag?: string; // little role badge shown next to the name (e.g. ORCT, CIV)
  presence: Presence;
  note?: string; // status / now-playing line, like on Discord
};

export type Tier = {
  id: string;
  name: string;
  emoji: string;
  color: string; // hex used for the role accent + name color
  blurb: string;
  members: Member[];
};

// Ordered most-honoured first, mirroring the Discord member sidebar.
export const TIERS: Tier[] = [
  {
    id: "householder",
    name: "Householder",
    emoji: "🏠",
    color: "#FF5E7E",
    blurb: "The hosts who keep the teapot warm and the house in order.",
    members: [
      { name: "Lady Sugar", tag: "🍓", presence: "online", note: "in voice · ourchat" },
      { name: "Uni", tag: "ORCT", presence: "online", note: "tending the parlor 👑" }
    ]
  },
  {
    id: "vip",
    name: "VIP members",
    emoji: "💜",
    color: "#E0A6FF",
    blurb: "Beloved regulars with a permanent seat at the best table.",
    members: [
      { name: "aHngSa", presence: "idle" },
      { name: "Pythonite", tag: "CIV", presence: "dnd", note: "Dead by Daylight +1" },
      { name: "Valkyr", presence: "online", note: "in voice" }
    ]
  },
  {
    id: "inner",
    name: "Inner Members",
    emoji: "🌼",
    color: "#9FC79A",
    blurb: "The lively heart of the teaparty.",
    members: [
      { name: "1%", tag: "永劫无伺", presence: "online", note: "when i was blue" },
      { name: "8as", tag: "YEVA", presence: "online" },
      { name: "Erik", tag: "CHAD", presence: "online", note: "in voice · friendship" },
      { name: "kaiwa030", presence: "online", note: "Monster Hunter Wilds" },
      { name: "Nus", presence: "online" },
      { name: "Phum", presence: "online" },
      { name: "Vik", presence: "idle" },
      { name: "xMarabou", presence: "online" },
      { name: "Zixuss", presence: "online" }
    ]
  },
  {
    id: "members",
    name: "Members",
    emoji: "🫖",
    color: "#B6A2C2",
    blurb: "Everyone pulling up a chair — welcome home.",
    members: [
      { name: "Anote", presence: "online", note: "Just Me&Myself" },
      { name: "CKJ", presence: "online" },
      { name: "dragonslayer", presence: "online", note: "RuneLite" },
      { name: "EMTHY", presence: "online", note: "Morning Whiskey, Evening Lamp…" },
      { name: "Ginrin", tag: "MEOW", presence: "online" },
      { name: "GlennM8", presence: "online" },
      { name: "Goburin", presence: "online" },
      { name: "Hi an Bank", presence: "online" },
      { name: "Hirvikoski", presence: "online", note: "RuneLite" },
      { name: "Im Sexy", presence: "online", note: "Apex Legends" }
    ]
  }
];

export const PRESENCE_COLOR: Record<Presence, string> = {
  online: "#8FD08A",
  idle: "#F0C987",
  dnd: "#FF5E7E",
  offline: "#6c6076"
};

export function totalMembers(): number {
  return TIERS.reduce((sum, t) => sum + t.members.length, 0);
}

// Stable url-friendly id for a member name.
export function memberSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export type MemberWithTier = Member & {
  slug: string;
  tierId: string;
  tierName: string;
  tierColor: string;
  tierEmoji: string;
};

// Flattened directory so any page/route can resolve a member by slug.
export function allMembers(): MemberWithTier[] {
  return TIERS.flatMap((t) =>
    t.members.map((m) => ({
      ...m,
      slug: memberSlug(m.name),
      tierId: t.id,
      tierName: t.name,
      tierColor: t.color,
      tierEmoji: t.emoji
    }))
  );
}

export function findMemberBySlug(slug: string): MemberWithTier | undefined {
  return allMembers().find((m) => m.slug === slug);
}
