// Tiny JSON-file-backed store. Chosen over a native DB so the app runs with
// ZERO setup (no compilation, no migrations). It's a clean seam: swap the
// read()/write() internals for SQLite/Postgres later without touching callers.

import fs from "node:fs";
import path from "node:path";
import { BADGES, evaluateBadges, type UserStats } from "./badges";

export type UserRecord = {
  id: string;
  name: string;
  avatar?: string;
  messages: number;
  nightMessages: number;
  visitDays: string[]; // ISO date strings, deduped
  eventsAttended: number;
  eventsHosted: number;
  wateredOthers: number;
  waterReceived: number;
  badges: string[];
  createdAt: number;
  lastSeen: number;
};

export type EventRecord = {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "19:00"
  host: string;
  discordUrl?: string;
  attendees: string[]; // userIds
};

export type ProfileComment = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  ts: number;
};

export type ProfileReport = {
  id: string;
  slug: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  ts: number;
};

// Customizable "find-a-friend" profile card for a member.
export type ProfileRecord = {
  slug: string;
  ownerId?: string; // locked to the first person who edits it
  displayName: string;
  tagline?: string;
  bio?: string;
  pronouns?: string;
  region?: string;
  ageRange?: string;
  favoriteGames?: string;
  lookingFor?: string;
  vibe?: string;
  cardBlurb?: string; // short status shown on the member mini-card
  motto?: string; // the member's motto, shown in the card's motto box
  role?: "admin" | "moderator" | "member";
  accent: string;
  avatarUrl?: string;
  avatarPos?: string;
  bannerId: string;
  bannerUrl?: string;
  bannerFit?: string;
  bannerPos?: string;
  backgroundId: string;
  backgroundUrl?: string;
  backgroundFit?: string;
  backgroundPos?: string;
  musicUrl?: string;
  discord?: string;
  twitch?: string;
  photos?: string[]; // legacy showcase images (kept for back-compat)
  showcaseStyle?: "grid" | "full";
  showcases?: Showcase[]; // Steam-style reorderable, named showcase blocks
  comments: ProfileComment[];
  updatedAt: number;
};

export type ShowcaseImage = { url: string; pos?: string };
export type Showcase = {
  id: string;
  type: "about" | "screenshot" | "feature";
  title: string;
  text?: string;
  images?: ShowcaseImage[];
};

// A short-lived "looking for a friend" feed post. One active post per person;
// it disappears 90 minutes after it's made.
export type FeedPost = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorSlug: string;
  text: string;
  game?: string;
  vibe?: string;
  accent: string;
  waves: string[]; // userIds who waved 👋
  createdAt: number;
  expiresAt: number;
};

export const FEED_TTL_MS = 90 * 60 * 1000;

// A friendly "poke" — a little nudge from one member to another.
export type Poke = {
  id: string;
  toId: string;
  fromId: string;
  fromName: string;
  fromAvatar?: string;
  fromSlug: string;
  ts: number;
  seen: boolean;
};

type DBShape = {
  users: Record<string, UserRecord>;
  events: EventRecord[];
  profiles: Record<string, ProfileRecord>;
  profileReports: ProfileReport[];
  feedPosts: FeedPost[];
  pokes: Poke[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

let cache: DBShape | null = null;
let cachedMtime = 0;

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function seed(): DBShape {
  const t = new Date();
  const inDays = (n: number) => {
    const d = new Date(t);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  return {
    users: {},
    events: [
      {
        id: "evt-cozy-cottage-night",
        title: "Cozy Cottage Game Night 🏡",
        description:
          "We're booting up our favourite farming sim and tending fields together. Bring tea, bring snacks, claim a plot!",
        date: inDays(2),
        time: "19:00",
        host: "TeaMistress",
        discordUrl: "https://discord.gg/your-invite",
        attendees: []
      },
      {
        id: "evt-midnight-tea",
        title: "Midnight Tea & Chill ☕🌙",
        description:
          "A quiet late-night hangout in the Midnight Oolong room. Lo-fi on, cameras off, just vibes and slow conversation.",
        date: inDays(5),
        time: "23:30",
        host: "MoonDrop",
        discordUrl: "https://discord.gg/your-invite",
        attendees: []
      },
      {
        id: "evt-spring-teaparty",
        title: "Spring Tea Party Festival 🌸",
        description:
          "Our monthly themed bash! Dress your avatar in pastels, join the costume showcase, and win flower badges.",
        date: inDays(12),
        time: "16:00",
        host: "PetalPip",
        discordUrl: "https://discord.gg/your-invite",
        attendees: []
      }
    ],
    profiles: {},
    profileReports: [],
    feedPosts: [],
    pokes: []
  };
}

function loadFromDisk(): DBShape | null {
  try {
    const stat = fs.statSync(DATA_FILE);
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as DBShape;
    if (!data.users) data.users = {};
    if (!data.events) data.events = [];
    if (!data.profiles) data.profiles = {};
    if (!data.profileReports) data.profileReports = [];
    if (!data.feedPosts) data.feedPosts = [];
    if (!data.pokes) data.pokes = [];
    cachedMtime = stat.mtimeMs;
    return data;
  } catch {
    return null;
  }
}

// NOTE: the Socket.IO server (run via tsx) and the Next API routes (bundled by
// Next) load this module as SEPARATE instances, so each keeps its own `cache`.
// To stay coherent we re-read the shared file whenever its mtime changes.
function read(): DBShape {
  if (cache) {
    try {
      const stat = fs.statSync(DATA_FILE);
      if (stat.mtimeMs !== cachedMtime) {
        const fresh = loadFromDisk();
        if (fresh) cache = fresh;
      }
    } catch {
      /* file missing/unreadable — keep the in-memory cache */
    }
    return cache;
  }
  const loaded = loadFromDisk();
  if (loaded) {
    cache = loaded;
    return cache;
  }
  cache = seed();
  write();
  return cache;
}

function write(): void {
  if (!cache) return;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(cache, null, 2), "utf8");
    cachedMtime = fs.statSync(DATA_FILE).mtimeMs;
  } catch {
    /* best-effort persistence; ephemeral environments may be read-only */
  }
}

function statsOf(u: UserRecord): UserStats {
  return {
    messages: u.messages,
    nightMessages: u.nightMessages,
    daysVisited: u.visitDays.length,
    eventsAttended: u.eventsAttended,
    eventsHosted: u.eventsHosted,
    wateredOthers: u.wateredOthers,
    waterReceived: u.waterReceived,
    growth: growthScore(u)
  };
}

// ---- Garden growth model ----
export const GROWTH_STAGES = [
  { key: "seed", label: "Seedling", emoji: "🌰", min: 0 },
  { key: "sprout", label: "Sprout", emoji: "🌱", min: 5 },
  { key: "leafy", label: "Leafy", emoji: "🌿", min: 20 },
  { key: "budding", label: "Budding", emoji: "🪴", min: 50 },
  { key: "bloom", label: "In Bloom", emoji: "🌸", min: 100 },
  { key: "flourishing", label: "Flourishing", emoji: "🌺", min: 200 }
] as const;

export function growthScore(u: UserRecord): number {
  return (
    u.messages +
    u.eventsAttended * 5 +
    u.eventsHosted * 8 +
    u.visitDays.length * 3 +
    u.waterReceived * 2
  );
}

export function stageFor(score: number) {
  let stage: (typeof GROWTH_STAGES)[number] = GROWTH_STAGES[0];
  let index = 0;
  GROWTH_STAGES.forEach((s, i) => {
    if (score >= s.min) {
      stage = s;
      index = i;
    }
  });
  const next = GROWTH_STAGES[index + 1];
  const progress = next
    ? Math.min(1, (score - stage.min) / (next.min - stage.min))
    : 1;
  return { stage, index, next, progress };
}

function ensureUser(userId: string, name: string, avatar?: string): UserRecord {
  const db = read();
  let u = db.users[userId];
  if (!u) {
    u = {
      id: userId,
      name,
      avatar,
      messages: 0,
      nightMessages: 0,
      visitDays: [],
      eventsAttended: 0,
      eventsHosted: 0,
      wateredOthers: 0,
      waterReceived: 0,
      badges: [],
      createdAt: Date.now(),
      lastSeen: Date.now()
    };
    db.users[userId] = u;
  }
  u.name = name || u.name;
  if (avatar) u.avatar = avatar;
  u.lastSeen = Date.now();
  const day = todayISO();
  if (!u.visitDays.includes(day)) u.visitDays.push(day);
  return u;
}

function awardNewBadges(u: UserRecord) {
  const fresh = evaluateBadges(statsOf(u), u.badges);
  fresh.forEach((b) => u.badges.push(b.id));
  return fresh.map((b) => ({ id: b.id, name: b.name, emoji: b.emoji, description: b.description }));
}

// ---- Public API ----

export type ActivityType = "message" | "visit" | "attend" | "host";

export function recordActivity(userId: string, name: string, type: ActivityType, avatar?: string) {
  const db = read();
  const u = ensureUser(userId, name, avatar);
  if (type === "message") {
    u.messages += 1;
    const hr = new Date().getHours();
    if (hr >= 0 && hr < 5) u.nightMessages += 1;
  } else if (type === "attend") {
    u.eventsAttended += 1;
  } else if (type === "host") {
    u.eventsHosted += 1;
  }
  const newBadges = awardNewBadges(u);
  cache = db;
  write();
  return { user: u, newBadges };
}

export function getUser(userId: string): UserRecord | undefined {
  return read().users[userId];
}

export function listGarden() {
  const db = read();
  return Object.values(db.users)
    .map((u) => {
      const score = growthScore(u);
      const { stage, progress } = stageFor(score);
      return {
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        score,
        stage: stage.key,
        stageLabel: stage.label,
        emoji: stage.emoji,
        progress,
        waterReceived: u.waterReceived,
        badges: u.badges
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function waterPlant(targetId: string, gardenerId: string, gardenerName: string) {
  const db = read();
  const target = db.users[targetId];
  if (!target) return { ok: false as const, error: "No such plant" };
  target.waterReceived += 1;
  // The gardener gets credit too (for the Good Neighbor badge).
  const gardener = ensureUser(gardenerId, gardenerName);
  gardener.wateredOthers += 1;
  const newBadges = awardNewBadges(gardener);
  cache = db;
  write();
  return { ok: true as const, target: target.name, newBadges };
}

export function listEvents(): EventRecord[] {
  return [...read().events].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function createEvent(input: Omit<EventRecord, "id" | "attendees">) {
  const db = read();
  const evt: EventRecord = {
    ...input,
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    attendees: []
  };
  db.events.push(evt);
  // Hosting earns activity/badges.
  if (input.host) recordActivity(slugUser(input.host), input.host, "host");
  cache = db;
  write();
  return evt;
}

export function rsvpEvent(eventId: string, userId: string, name: string) {
  const db = read();
  const evt = db.events.find((e) => e.id === eventId);
  if (!evt) return { ok: false as const, error: "No such event" };
  let newBadges: { id: string; name: string; emoji: string; description: string }[] = [];
  if (!evt.attendees.includes(userId)) {
    evt.attendees.push(userId);
    newBadges = recordActivity(userId, name, "attend").newBadges;
  }
  cache = db;
  write();
  return { ok: true as const, event: evt, newBadges };
}

export function badgesForUser(userId: string): string[] {
  return read().users[userId]?.badges ?? [];
}

export function allBadgeDefs() {
  return BADGES.map((b) => ({ id: b.id, name: b.name, emoji: b.emoji, description: b.description }));
}

// Deterministic id for free-text names (used for demo guests / event hosts).
export function slugUser(name: string): string {
  return "guest:" + name.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 40);
}

// ---- Member profiles (customizable cards + comments + reports) ----

function defaultProfile(slug: string, displayName: string): ProfileRecord {
  return {
    slug,
    displayName,
    accent: "#FF5E7E",
    bannerId: "berry",
    backgroundId: "plum",
    comments: [],
    updatedAt: 0
  };
}

// Returns the stored profile, or a fresh default (not yet persisted) so the
// view always has something to render. `displayName` seeds new profiles.
export function getProfile(slug: string, displayName?: string): ProfileRecord {
  const db = read();
  const existing = db.profiles[slug];
  if (existing) {
    if (displayName && !existing.displayName) existing.displayName = displayName;
    return existing;
  }
  return defaultProfile(slug, displayName || slug);
}

export type MemberCard = {
  slug: string;
  displayName: string;
  avatarUrl?: string;
  accent: string;
  bannerId: string;
  bannerUrl?: string;
  bannerFit?: string;
  bannerPos?: string;
  tagline?: string;
  cardBlurb?: string;
  motto?: string;
  region?: string;
  vibe?: string;
  storedRole?: "admin" | "moderator" | "member";
  joinedAt: number;
};

// Registered website members = profiles someone has actually claimed/edited.
export function listMembers(): MemberCard[] {
  const db = read();
  return Object.values(db.profiles)
    .filter((p) => p.ownerId)
    .map((p) => ({
      slug: p.slug,
      displayName: p.displayName,
      avatarUrl: p.avatarUrl,
      accent: p.accent,
      bannerId: p.bannerId,
      bannerUrl: p.bannerUrl,
      bannerFit: p.bannerFit,
      bannerPos: p.bannerPos,
      tagline: p.tagline,
      cardBlurb: p.cardBlurb,
      motto: p.motto,
      region: p.region,
      vibe: p.vibe,
      storedRole: p.role,
      joinedAt: p.updatedAt
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

// Plain text/string fields that get length-capped to 600 chars on save.
const EDITABLE_FIELDS: (keyof ProfileRecord)[] = [
  "displayName", "tagline", "bio", "pronouns", "region", "ageRange",
  "favoriteGames", "lookingFor", "vibe", "cardBlurb", "motto", "accent", "bannerId",
  "backgroundId", "discord", "twitch",
  "avatarPos", "bannerFit", "bannerPos", "backgroundFit", "backgroundPos"
];

// URL / image fields that may hold long values (a pasted link OR an uploaded,
// client-resized image data URL) — capped by size, never truncated to 600.
const IMAGE_FIELDS: (keyof ProfileRecord)[] = ["avatarUrl", "bannerUrl", "backgroundUrl", "musicUrl"];

const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 1100 * 1024; // ~1.1MB per image (covers small GIFs)
const MAX_SHOWCASES = 3;
const MAX_SHOWCASE_IMAGES = 12;
const MAX_IMAGE_BYTES = 1200 * 1024; // banner/background may be a touch larger

export function saveProfile(
  slug: string,
  patch: Partial<ProfileRecord>,
  editorId: string,
  editorName: string
): { ok: true; profile: ProfileRecord } | { ok: false; error: string } {
  const db = read();
  const existing = db.profiles[slug];
  // Ownership: first editor claims the card; afterwards only they may edit it.
  if (existing?.ownerId && existing.ownerId !== editorId) {
    return { ok: false, error: "This profile belongs to someone else." };
  }
  const base = existing ?? defaultProfile(slug, editorName);
  for (const key of EDITABLE_FIELDS) {
    if (key in patch && patch[key] !== undefined) {
      // @ts-expect-error indexed assignment across a union of string fields
      base[key] = typeof patch[key] === "string" ? (patch[key] as string).slice(0, 600) : patch[key];
    }
  }
  // Banner/background/music URLs: accept long values (data URLs), size-capped.
  for (const key of IMAGE_FIELDS) {
    if (key in patch) {
      const val = patch[key];
      if (typeof val === "string" && val.length <= MAX_IMAGE_BYTES) {
        // @ts-expect-error indexed assignment across string fields
        base[key] = val;
      }
    }
  }
  // Photo showcase: keep only reasonably-sized images, capped in count.
  if (Array.isArray(patch.photos)) {
    base.photos = patch.photos
      .filter((p) => typeof p === "string" && p.length <= MAX_PHOTO_BYTES)
      .slice(0, MAX_PHOTOS);
  }
  if (patch.showcaseStyle === "grid" || patch.showcaseStyle === "full") {
    base.showcaseStyle = patch.showcaseStyle;
  }
  if (patch.role === "admin" || patch.role === "moderator" || patch.role === "member") {
    base.role = patch.role;
  }
  // Steam-style showcases: validate, cap counts/sizes.
  if (Array.isArray(patch.showcases)) {
    base.showcases = patch.showcases
      .filter((s) => s && ["about", "screenshot", "feature"].includes(s.type))
      .slice(0, MAX_SHOWCASES)
      .map((s) => ({
        id: typeof s.id === "string" ? s.id : `sc-${Math.random().toString(36).slice(2, 8)}`,
        type: s.type,
        title: (s.title || "").slice(0, 60),
        text: typeof s.text === "string" ? s.text.slice(0, 1200) : undefined,
        images: Array.isArray(s.images)
          ? s.images
              .filter((im) => im && typeof im.url === "string" && im.url.length <= MAX_PHOTO_BYTES)
              .slice(0, MAX_SHOWCASE_IMAGES)
              .map((im) => ({ url: im.url, pos: typeof im.pos === "string" ? im.pos : undefined }))
          : undefined
      }));
  }
  base.ownerId = existing?.ownerId ?? editorId;
  base.updatedAt = Date.now();
  db.profiles[slug] = base;
  cache = db;
  write();
  return { ok: true, profile: base };
}

export function addProfileComment(
  slug: string,
  comment: Omit<ProfileComment, "id" | "ts">,
  displayName?: string
): { ok: true; comment: ProfileComment } | { ok: false; error: string } {
  const text = comment.text.trim();
  if (!text) return { ok: false, error: "Empty comment" };
  const db = read();
  const profile = db.profiles[slug] ?? defaultProfile(slug, displayName || slug);
  const entry: ProfileComment = {
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    authorId: comment.authorId,
    authorName: comment.authorName,
    authorAvatar: comment.authorAvatar,
    text: text.slice(0, 500),
    ts: Date.now()
  };
  profile.comments.push(entry);
  db.profiles[slug] = profile;
  cache = db;
  write();
  return { ok: true, comment: entry };
}

export function deleteProfileComment(slug: string, commentId: string, requesterId: string) {
  const db = read();
  const profile = db.profiles[slug];
  if (!profile) return { ok: false as const, error: "No profile" };
  const c = profile.comments.find((x) => x.id === commentId);
  if (!c) return { ok: false as const, error: "No comment" };
  // Comment author or the profile owner may remove a comment.
  if (c.authorId !== requesterId && profile.ownerId !== requesterId) {
    return { ok: false as const, error: "Not allowed" };
  }
  profile.comments = profile.comments.filter((x) => x.id !== commentId);
  cache = db;
  write();
  return { ok: true as const };
}

export function reportProfile(report: Omit<ProfileReport, "id" | "ts">) {
  const db = read();
  const entry: ProfileReport = {
    ...report,
    reason: report.reason.slice(0, 500),
    id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ts: Date.now()
  };
  db.profileReports.push(entry);
  cache = db;
  write();
  return entry;
}

// ---- Friend Feed (90-minute "looking for a friend" posts) ----

function pruneFeed(db: DBShape): boolean {
  const now = Date.now();
  const before = db.feedPosts.length;
  db.feedPosts = db.feedPosts.filter((p) => p.expiresAt > now);
  return db.feedPosts.length !== before;
}

export function listFeed(): FeedPost[] {
  const db = read();
  if (pruneFeed(db)) {
    cache = db;
    write();
  }
  return [...db.feedPosts].sort((a, b) => b.createdAt - a.createdAt);
}

export function createFeedPost(input: {
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorSlug: string;
  text: string;
  game?: string;
  vibe?: string;
  accent?: string;
}): { ok: true; post: FeedPost } | { ok: false; error: string } {
  const text = input.text.trim();
  if (!text) return { ok: false, error: "Say something about who you're looking for!" };
  const db = read();
  pruneFeed(db);
  // One active post per person — a new post replaces the previous one.
  db.feedPosts = db.feedPosts.filter((p) => p.authorId !== input.authorId);
  const now = Date.now();
  const post: FeedPost = {
    id: `f-${now}-${Math.random().toString(36).slice(2, 6)}`,
    authorId: input.authorId,
    authorName: input.authorName,
    authorAvatar: input.authorAvatar,
    authorSlug: input.authorSlug,
    text: text.slice(0, 280),
    game: input.game?.trim().slice(0, 60) || undefined,
    vibe: input.vibe?.trim().slice(0, 40) || undefined,
    accent: input.accent || "#FF5E7E",
    waves: [],
    createdAt: now,
    expiresAt: now + FEED_TTL_MS
  };
  db.feedPosts.push(post);
  cache = db;
  write();
  return { ok: true, post };
}

export function waveFeedPost(postId: string, userId: string) {
  const db = read();
  const post = db.feedPosts.find((p) => p.id === postId);
  if (!post) return { ok: false as const, error: "Post expired" };
  if (post.waves.includes(userId)) post.waves = post.waves.filter((w) => w !== userId);
  else post.waves.push(userId);
  cache = db;
  write();
  return { ok: true as const, waves: post.waves.length, waved: post.waves.includes(userId) };
}

export function deleteFeedPost(postId: string, userId: string) {
  const db = read();
  const post = db.feedPosts.find((p) => p.id === postId);
  if (!post) return { ok: false as const, error: "No post" };
  if (post.authorId !== userId) return { ok: false as const, error: "Not your post" };
  db.feedPosts = db.feedPosts.filter((p) => p.id !== postId);
  cache = db;
  write();
  return { ok: true as const };
}

// ---- Pokes (friendly nudges between members) ----

const POKE_THROTTLE_MS = 30 * 1000; // ignore repeat pokes to the same person
const MAX_POKES_PER_USER = 50;

export function pokeUser(input: {
  toId: string;
  fromId: string;
  fromName: string;
  fromAvatar?: string;
  fromSlug: string;
}): { ok: true; poke: Poke } | { ok: false; error: string } {
  if (input.toId === input.fromId) return { ok: false, error: "You can't poke yourself!" };
  const db = read();
  const now = Date.now();
  // Throttle: collapse rapid repeat pokes from the same person into one (refresh it).
  const recent = db.pokes.find(
    (p) => p.toId === input.toId && p.fromId === input.fromId && now - p.ts < POKE_THROTTLE_MS
  );
  if (recent) {
    recent.ts = now;
    recent.seen = false;
    cache = db;
    write();
    return { ok: true, poke: recent };
  }
  const poke: Poke = {
    id: `p-${now}-${Math.random().toString(36).slice(2, 6)}`,
    toId: input.toId,
    fromId: input.fromId,
    fromName: input.fromName,
    fromAvatar: input.fromAvatar,
    fromSlug: input.fromSlug,
    ts: now,
    seen: false
  };
  db.pokes.push(poke);
  // Keep only the most recent pokes per recipient.
  const mine = db.pokes.filter((p) => p.toId === input.toId);
  if (mine.length > MAX_POKES_PER_USER) {
    const excess = mine.slice(0, mine.length - MAX_POKES_PER_USER).map((p) => p.id);
    db.pokes = db.pokes.filter((p) => !excess.includes(p.id));
  }
  cache = db;
  write();
  return { ok: true, poke };
}

export function listPokes(userId: string): { pokes: Poke[]; unseen: number } {
  const pokes = read()
    .pokes.filter((p) => p.toId === userId)
    .sort((a, b) => b.ts - a.ts);
  return { pokes, unseen: pokes.filter((p) => !p.seen).length };
}

export function markPokesSeen(userId: string) {
  const db = read();
  let changed = false;
  for (const p of db.pokes) {
    if (p.toId === userId && !p.seen) {
      p.seen = true;
      changed = true;
    }
  }
  if (changed) {
    cache = db;
    write();
  }
  return { ok: true as const };
}

export function clearPoke(pokeId: string, userId: string) {
  const db = read();
  const poke = db.pokes.find((p) => p.id === pokeId);
  if (!poke || poke.toId !== userId) return { ok: false as const, error: "Not allowed" };
  db.pokes = db.pokes.filter((p) => p.id !== pokeId);
  cache = db;
  write();
  return { ok: true as const };
}
