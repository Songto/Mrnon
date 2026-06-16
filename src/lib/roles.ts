// Website member roles (replaces the old Discord tiers). Pure data — safe to
// import on client and server.

export type Role = "admin" | "moderator" | "vip" | "member";

export const ROLE_META: Record<Role, { label: string; emoji: string; color: string; rank: number; blurb: string }> = {
  admin: { label: "Admins", emoji: "👑", color: "#F0A848", rank: 0, blurb: "The hosts who keep the teaparty running." },
  moderator: { label: "Moderators", emoji: "🛡️", color: "#8B7DF0", rank: 1, blurb: "Friendly faces keeping things cozy." },
  vip: { label: "VIP", emoji: "💖", color: "#FF6385", rank: 2, blurb: "Beloved regulars with a permanent seat at the best table." },
  member: { label: "Members", emoji: "🌷", color: "#7FB976", rank: 3, blurb: "Everyone who's pulled up a chair." }
};

export const ROLE_ORDER: Role[] = ["admin", "moderator", "vip", "member"];

// ───────────────────────────────────────────────────────────────────────────
// ADMINS / MODS / VIPs — edit these lists to promote people.
//
// Use a person's PROFILE SLUG: their display name, lowercased, with spaces
// turned into dashes (e.g. name "Tea Mistress" → slug "tea-mistress").
// Tip: open their profile and look at the address bar — /members/<slug>.
//
// To add another admin, just add their slug to the list, e.g.:
//   export const ADMIN_SLUGS = ["uni", "unipon", "new-admin-slug"];
// (Anyone not listed is a regular member.)
// ───────────────────────────────────────────────────────────────────────────
// You can also add admins WITHOUT editing code by setting an env var in Render:
//   NEXT_PUBLIC_ADMIN_SLUGS = your-slug,another-slug
// (then redeploy). Those are merged with the list below.
const envAdminSlugs = (process.env.NEXT_PUBLIC_ADMIN_SLUGS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const ADMIN_SLUGS = ["uni", "unipon", ...envAdminSlugs];
export const MOD_SLUGS: string[] = [];
export const VIP_SLUGS: string[] = [];

// True if the given profile slug is an admin (used for cosmetic 👑 role only).
export function isAdminSlug(slug: string): boolean {
  return ADMIN_SLUGS.includes(slug);
}

// ───────────────────────────────────────────────────────────────────────────
// ADMIN POWERS are keyed off the logged-in ACCOUNT (Discord ID), which can't
// be spoofed by just copying someone's display name. To add another admin,
// add their Discord user ID below, or set NEXT_PUBLIC_ADMIN_DISCORD_IDS in
// Render (comma-separated) and redeploy.
// ───────────────────────────────────────────────────────────────────────────
const envAdminDiscordIds = (process.env.NEXT_PUBLIC_ADMIN_DISCORD_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const ADMIN_DISCORD_IDS = ["295934353903452170", ...envAdminDiscordIds];

// Identity userIds look like "discord:<id>", "email:<addr>", or "guest:<name>".
// Admin powers require a Discord account whose id is in the allow-list.
export function isAdminUserId(userId?: string | null): boolean {
  if (!userId) return false;
  if (userId.startsWith("discord:")) {
    return ADMIN_DISCORD_IDS.includes(userId.slice("discord:".length));
  }
  return false;
}

export function roleForSlug(slug: string, stored?: Role): Role {
  if (ADMIN_SLUGS.includes(slug)) return "admin";
  if (MOD_SLUGS.includes(slug)) return "moderator";
  if (VIP_SLUGS.includes(slug)) return "vip";
  return stored || "member";
}
