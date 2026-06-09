// Collectible cozy sticker badges. Rules are evaluated against a user's stats
// (see db.ts -> UserRecord). Keep these pure + data-driven so new badges are
// just one more entry in the array.

export type UserStats = {
  messages: number;
  nightMessages: number;
  daysVisited: number;
  eventsAttended: number;
  eventsHosted: number;
  wateredOthers: number;
  waterReceived: number;
  growth: number;
};

export type BadgeDef = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rule: (s: UserStats) => boolean;
};

export const BADGES: BadgeDef[] = [
  {
    id: "first-sip",
    name: "First Sip",
    emoji: "🍵",
    description: "Sent your very first message in the tearoom.",
    rule: (s) => s.messages >= 1
  },
  {
    id: "chatterbug",
    name: "Chatterbug",
    emoji: "💬",
    description: "Shared 50 cozy messages with the table.",
    rule: (s) => s.messages >= 50
  },
  {
    id: "night-owl",
    name: "Night Owl",
    emoji: "🌙",
    description: "Brewed some late-night conversation after midnight.",
    rule: (s) => s.nightMessages >= 1
  },
  {
    id: "green-thumb",
    name: "Green Thumb",
    emoji: "🌿",
    description: "Grew your garden plant to a leafy stage.",
    rule: (s) => s.growth >= 20
  },
  {
    id: "in-full-bloom",
    name: "In Full Bloom",
    emoji: "🌸",
    description: "Your plant burst into flower — a true regular.",
    rule: (s) => s.growth >= 100
  },
  {
    id: "good-neighbor",
    name: "Good Neighbor",
    emoji: "💧",
    description: "Watered a friend's plant in the garden.",
    rule: (s) => s.wateredOthers >= 1
  },
  {
    id: "party-host",
    name: "Party Host",
    emoji: "🎀",
    description: "Hosted a tea party or game night for the community.",
    rule: (s) => s.eventsHosted >= 1
  },
  {
    id: "party-goer",
    name: "Party Goer",
    emoji: "✨",
    description: "RSVP'd to your first community event.",
    rule: (s) => s.eventsAttended >= 1
  },
  {
    id: "regular",
    name: "Regular",
    emoji: "🏡",
    description: "Cozied up at Ourchat on three different days.",
    rule: (s) => s.daysVisited >= 3
  }
];

export function evaluateBadges(stats: UserStats, owned: string[]): BadgeDef[] {
  const ownedSet = new Set(owned);
  return BADGES.filter((b) => !ownedSet.has(b.id) && b.rule(stats));
}

export function badgeById(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}
