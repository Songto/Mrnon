import Link from "next/link";
import type { MemberCard } from "@/lib/db";
import { bannerCss, type ImageFit } from "@/lib/profile-presets";
import { ROLE_META, roleForSlug } from "@/lib/roles";
import { Avatar } from "@/components/ui/Avatar";

export function MemberMiniCard({ member }: { member: MemberCard }) {
  const role = roleForSlug(member.slug, member.storedRole);
  const meta = ROLE_META[role];
  const accent = member.accent || "#FF7E9B";
  const chips = [member.region && `🌍 ${member.region}`, member.vibe && `✨ ${member.vibe}`].filter(
    Boolean
  ) as string[];

  return (
    <Link
      href={`/members/${member.slug}`}
      className="group block overflow-hidden rounded-cozy border border-cocoa/10 bg-surface/80 shadow-cozy transition hover:-translate-y-1 hover:shadow-cozy-lg"
    >
      {/* mini banner */}
      <div
        className="h-14 w-full"
        style={{
          background: bannerCss(
            member.bannerId || "berry",
            member.bannerUrl,
            (member.bannerFit as ImageFit) || "fill",
            member.bannerPos || "50% 50%"
          )
        }}
      />
      <div className="px-4 pb-4">
        <div className="-mt-7 flex items-end gap-2">
          <div className="rounded-full ring-4 ring-surface">
            <Avatar name={member.displayName} src={member.avatarUrl} size={52} />
          </div>
          <span
            className="mb-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-night"
            style={{ background: meta.color }}
            title={meta.label}
          >
            {meta.emoji} {meta.label.replace(/s$/, "")}
          </span>
        </div>

        <h3 className="mt-2 flex items-center gap-1 truncate font-display text-base group-hover:underline">
          {member.displayName}
        </h3>
        {(member.cardBlurb || member.tagline) && (
          <p className="truncate text-xs" style={{ color: accent }}>
            {member.cardBlurb || `“${member.tagline}”`}
          </p>
        )}

        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <span key={c} className="rounded-full bg-cocoa/5 px-2 py-0.5 text-[11px] text-cocoa-soft">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
