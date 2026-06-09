import { Avatar } from "@/components/ui/Avatar";
import { SectionHeading } from "@/components/ui/CozyCard";
import { TIERS, PRESENCE_COLOR, totalMembers, type Member, type Tier } from "@/lib/members";

export const metadata = { title: "Members · OURCHAT Teaparty 🍓" };

function MemberRow({ member, color }: { member: Member; color: string }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition hover:bg-surface/70">
      <div className="relative shrink-0">
        <Avatar name={member.name} size={38} />
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface"
          style={{ background: PRESENCE_COLOR[member.presence] }}
          title={member.presence}
        />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-display" style={{ color }}>
            {member.name}
          </span>
          {member.tag && (
            <span
              className="rounded-md px-1.5 py-0.5 text-[10px] font-bold leading-none text-night"
              style={{ background: color }}
            >
              {member.tag}
            </span>
          )}
        </div>
        {member.note && (
          <span className="block truncate text-[11px] text-cocoa-soft">{member.note}</span>
        )}
      </div>
    </li>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const online = tier.members.filter((m) => m.presence !== "offline").length;
  return (
    <div
      className="cozy-card overflow-hidden p-0"
      style={{ borderColor: `${tier.color}55` }}
    >
      <header
        className="flex items-center justify-between gap-2 px-4 py-3"
        style={{ background: `${tier.color}1f` }}
      >
        <h3 className="flex items-center gap-2 text-base" style={{ color: tier.color }}>
          <span>{tier.emoji}</span>
          {tier.name}
        </h3>
        <span className="rounded-full bg-night/40 px-2 py-0.5 text-[11px] text-cocoa-soft">
          {online} online
        </span>
      </header>
      <p className="px-4 pt-3 text-xs text-cocoa-soft">{tier.blurb}</p>
      <ul className="space-y-0.5 p-3">
        {tier.members.map((m) => (
          <MemberRow key={m.name} member={m} color={tier.color} />
        ))}
      </ul>
    </div>
  );
}

export default function MembersPage() {
  const total = totalMembers();
  const onlineNow = TIERS.reduce(
    (sum, t) => sum + t.members.filter((m) => m.presence !== "offline").length,
    0
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        emoji="🪪"
        title="The Teaparty Members"
        subtitle="Everyone who's pulled up a chair, sorted by their place at the table — just like our Discord."
      />

      {/* Summary banner */}
      <div className="cozy-card flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-float-slow">🍓</span>
          <div>
            <p className="font-display text-lg">OURCHAT Teaparty</p>
            <p className="text-sm text-cocoa-soft">
              {total} members across {TIERS.length} roles · {onlineNow} cozy right now
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {TIERS.map((t) => (
            <span
              key={t.id}
              className="hidden rounded-full px-3 py-1 text-xs font-display sm:inline"
              style={{ background: `${t.color}22`, color: t.color }}
            >
              {t.emoji} {t.members.length}
            </span>
          ))}
        </div>
      </div>

      {/* Tier grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TIERS.map((t) => (
          <TierCard key={t.id} tier={t} />
        ))}
      </div>
    </div>
  );
}
