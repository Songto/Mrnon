import Link from "next/link";
import type { MemberCard } from "@/lib/db";
import { bannerCss, type ImageFit } from "@/lib/profile-presets";
import { ROLE_META, roleForSlug } from "@/lib/roles";
import { Avatar } from "@/components/ui/Avatar";

export function MemberMiniCard({ member }: { member: MemberCard }) {
  const role = roleForSlug(member.slug, member.storedRole);
  const meta = ROLE_META[role];
  const accent = member.accent || "#FF7E9B";
  const motto = member.motto || member.cardBlurb || member.tagline;
  const chips = [member.region && `🌍 ${member.region}`, member.vibe && `✨ ${member.vibe}`].filter(
    Boolean
  ) as string[];

  return (
    <Link
      href={`/members/${member.slug}`}
      className="group block w-[200px] max-w-full overflow-hidden rounded-cozy border border-cocoa/10 bg-surface/80 text-center shadow-cozy transition hover:-translate-y-1 hover:shadow-cozy-lg"
    >
      {/* banner */}
      <div
        className="h-20 w-full"
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
        {/* avatar centered, overlapping the banner */}
        <div className="-mt-10 flex justify-center">
          <div className="rounded-full ring-4 ring-surface">
            <Avatar name={member.displayName} src={member.avatarUrl} size={72} />
          </div>
        </div>

        {/* name + role */}
        <h3 className="mt-2 truncate font-display text-lg group-hover:underline">
          {member.displayName}
        </h3>
        <span
          className="mt-0.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold text-night"
          style={{ background: meta.color }}
        >
          {meta.emoji} {meta.label.replace(/s$/, "")}
        </span>

        {/* motto box */}
        {motto && (
          <div
            className="mt-3 rounded-2xl px-3 py-2.5"
            style={{ background: `${accent}1a`, border: `1px solid ${accent}33` }}
          >
            <p className="break-words text-sm font-display [overflow-wrap:anywhere]" style={{ color: accent }}>
              “{motto}”
            </p>
          </div>
        )}

        {/* chips */}
        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
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
