import { notFound } from "next/navigation";
import { findMemberBySlug } from "@/lib/members";
import { ProfileView } from "@/components/profile/ProfileView";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const m = findMemberBySlug(params.slug);
  return { title: `${m?.name ?? "Member"} · OURCHAT Teaparty 🍓` };
}

export default function MemberProfilePage({ params }: { params: { slug: string } }) {
  const member = findMemberBySlug(params.slug);
  if (!member) notFound();

  return (
    <ProfileView
      slug={member.slug}
      fallback={{
        displayName: member.name,
        tag: member.tag,
        tierName: member.tierName,
        tierColor: member.tierColor,
        tierEmoji: member.tierEmoji,
        note: member.note
      }}
    />
  );
}
