import { notFound } from "next/navigation";
import { getProfile } from "@/lib/db";
import { findMemberBySlug } from "@/lib/members";
import { ROLE_META, roleForSlug } from "@/lib/roles";
import { ProfileView, type ProfileFallback } from "@/components/profile/ProfileView";

export const dynamic = "force-dynamic";

// Resolve a member by their registered profile first, falling back to the
// legacy static directory (so old links keep working).
function resolve(slug: string): ProfileFallback | null {
  const profile = getProfile(slug);
  if (profile.ownerId) {
    const role = roleForSlug(slug, profile.role);
    const meta = ROLE_META[role];
    return {
      displayName: profile.displayName,
      tag: meta.label.replace(/s$/, ""),
      tierName: meta.label,
      tierColor: meta.color,
      tierEmoji: meta.emoji
    };
  }
  const m = findMemberBySlug(slug);
  if (m) {
    return {
      displayName: m.name,
      tag: m.tag,
      tierName: m.tierName,
      tierColor: m.tierColor,
      tierEmoji: m.tierEmoji,
      note: m.note
    };
  }
  // Fall back to a blank member card so the page always renders (e.g. a user
  // visiting their own profile before they've customized it). The owner sees
  // a "Customize" prompt via ProfileView.
  const meta = ROLE_META[roleForSlug(slug)];
  return {
    displayName: profile.displayName || slug,
    tag: meta.label.replace(/s$/, ""),
    tierName: meta.label,
    tierColor: meta.color,
    tierEmoji: meta.emoji
  };
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const f = resolve(params.slug);
  return { title: `${f?.displayName ?? "Member"} · OURCHAT Teaparty 🍓` };
}

export default function MemberProfilePage({ params }: { params: { slug: string } }) {
  const fallback = resolve(params.slug);
  if (!fallback) notFound();
  return <ProfileView slug={params.slug} fallback={fallback} />;
}
