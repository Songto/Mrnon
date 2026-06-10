// Quests & badges. The 9 QUESTS are evaluated against a user's activity stats
// (db.ts -> UserRecord) and show live progress. The ADVANCED badges sit on
// top: Ourchat (all 9 quests), Famous (profile likes), Gardener (future seed
// system), and two admin-granted ones (Secret, Cutefactor).

export type UserStats = {
  messages: number;
  nightMessages: number;
  daysVisited: number;
  wateredOthers: number;
  waterReceived: number;
  growth: number;
  feedPosts: number;
  gamesFinished: number;
  profileSaves: number;
};

export type QuestDef = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  target: number;
  value: (s: UserStats) => number;
};

// The 9 website quests — all tied to features that exist today.
export const QUESTS: QuestDef[] = [
  {
    id: "first-sip",
    name: "First Sip",
    emoji: "🍵",
    description: "Send your very first message in the tearoom.",
    target: 1,
    value: (s) => s.messages
  },
  {
    id: "chatterbug",
    name: "Chatterbug",
    emoji: "💬",
    description: "Share 100 cozy messages with the table.",
    target: 100,
    value: (s) => s.messages
  },
  {
    id: "night-owl",
    name: "Night Owl",
    emoji: "🌙",
    description: "Send 10 late-night messages after midnight.",
    target: 10,
    value: (s) => s.nightMessages
  },
  {
    id: "regular",
    name: "Regular",
    emoji: "🏡",
    description: "Cozy up at Ourchat on 7 different days.",
    target: 7,
    value: (s) => s.daysVisited
  },
  {
    id: "good-neighbor",
    name: "Good Neighbor",
    emoji: "💧",
    description: "Water friends' plants 10 times in the garden.",
    target: 10,
    value: (s) => s.wateredOthers
  },
  {
    id: "in-full-bloom",
    name: "In Full Bloom",
    emoji: "🌸",
    description: "Grow your garden plant to 100 growth.",
    target: 100,
    value: (s) => s.growth
  },
  {
    id: "friend-finder",
    name: "Friend Finder",
    emoji: "🌷",
    description: "Post 5 looking-for-a-friend cards on the feed.",
    target: 5,
    value: (s) => s.feedPosts
  },
  {
    id: "game-night",
    name: "Game Night",
    emoji: "🎲",
    description: "Finish 3 mini-games in a private room.",
    target: 3,
    value: (s) => s.gamesFinished
  },
  {
    id: "dressed-up",
    name: "Dressed Up",
    emoji: "🪞",
    description: "Customize and save your profile.",
    target: 1,
    value: (s) => s.profileSaves
  }
];

export type AdvancedBadgeId = "ourchat" | "secret" | "gardener" | "cutefactor" | "famous";

export type AdvancedBadgeDef = {
  id: AdvancedBadgeId;
  name: string;
  emoji: string;
  description: string;
  granted?: boolean; // awarded by an admin, not earned automatically
  locked?: boolean; // not obtainable yet (future feature)
};

export const ADVANCED_BADGES: AdvancedBadgeDef[] = [
  {
    id: "ourchat",
    name: "Ourchat",
    emoji: "🍓",
    description: "Completed all 9 website quests. A true regular of the teaparty!"
  },
  {
    id: "secret",
    name: "Secret",
    emoji: "🤫",
    description: "A special someone. You know who you are.",
    granted: true
  },
  {
    id: "gardener",
    name: "Gardener",
    emoji: "🌱",
    description: "Collected every seed in the garden. (Coming with the seed gacha!)",
    locked: true
  },
  {
    id: "cutefactor",
    name: "Cutefactor",
    emoji: "🎀",
    description: "Officially certified cute by the teaparty.",
    granted: true
  },
  {
    id: "famous",
    name: "Famous",
    emoji: "⭐",
    description: "Collected more than 500 likes on your profile."
  }
];

export const FAMOUS_LIKES = 500;

export function questDone(q: QuestDef, s: UserStats): boolean {
  return q.value(s) >= q.target;
}

export function allQuestsDone(s: UserStats): boolean {
  return QUESTS.every((q) => questDone(q, s));
}

// Newly completed quests for the toast celebration (compat with the old API).
export function evaluateBadges(stats: UserStats, owned: string[]) {
  const ownedSet = new Set(owned);
  return QUESTS.filter((q) => !ownedSet.has(q.id) && questDone(q, stats)).map((q) => ({
    id: q.id,
    name: q.name,
    emoji: q.emoji,
    description: q.description
  }));
}
