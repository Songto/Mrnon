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

// Owner-managed role assignments by profile slug. Edit these lists to promote
// people. (Anyone not listed is a regular member.)
export const ADMIN_SLUGS = ["uni", "unipon"];
export const MOD_SLUGS: string[] = [];
export const VIP_SLUGS: string[] = [];

export function roleForSlug(slug: string, stored?: Role): Role {
  if (ADMIN_SLUGS.includes(slug)) return "admin";
  if (MOD_SLUGS.includes(slug)) return "moderator";
  if (VIP_SLUGS.includes(slug)) return "vip";
  return stored || "member";
}
