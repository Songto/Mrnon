import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import {
  TIERS,
  PRESENCE_COLOR,
  totalMembers,
  memberSlug,
  type Member,
  type Tier
} from "@/lib/members";

export const metadata = { title: "Members · OURCHAT Teaparty 🍓" };

const PRESENCE_LEGEND: { key: keyof typeof PRESENCE_COLOR; label: string }[] = [
  { key: "online", label: "online" },
  { key: "idle", label: "idle" },
  { key: "dnd", label: "do not disturb" }
];

function MemberRow({ member, color }: { member: Member; color: string }) {
  return (
    <Link
      href={`/members/${memberSlug(member.name)}`}
      className="group flex items-center gap-3 rounded-2xl px-2 py-1.5 transition hover:-translate-y-0.5 hover:bg-surface/70"
    >
      <div className="relative shrink-0">
        <div className="rounded-full ring-2 ring-transparent transition group-hover:ring-2" style={{ ["--tw-ring-color" as string]: color }}>
          <Avatar name={member.name} size={40} />
        </div>
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface"
          style={{ background: PRESENCE_COLOR[member.presence] }}
          title={member.presence}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-display group-hover:underline" style={{ color }}>
            {member.name}
          </span>
          {member.tag && (
            <span
              className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold leading-none text-night"
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
      <span className="shrink-0 pr-1 text-cocoa-soft opacity-0 transition group-hover:opacity-100">→</span>
    </Link>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const online = tier.members.filter((m) => m.presence !== "offline").length;
  return (
    <div
      className="cozy-card overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-cozy-lg"
      style={{ borderColor: `${tier.color}55` }}
    >
      {/* accent strip */}
      <div className="h-1.5 w-full" style={{ background: tier.color }} />
      <header
        className="flex items-center justify-between gap-2 px-4 py-3"
        style={{ background: `${tier.color}1f` }}
      >
        <h3 className="flex items-center gap-2 text-base" style={{ color: tier.color }}>
          <span className="text-lg">{tier.emoji}</span>
          {tier.name}
        </h3>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="flex items-center gap-1 rounded-full bg-night/40 px-2 py-0.5 text-cocoa-soft">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: PRESENCE_COLOR.online }} />
            {online}
          </span>
          <span className="rounded-full bg-night/40 px-2 py-0.5 text-cocoa-soft">
            {tier.members.length} total
          </span>
        </div>
      </header>
      <p className="px-4 pt-3 text-xs text-cocoa-soft">{tier.blurb}</p>
      <div className="space-y-0.5 p-3">
        {tier.members.map((m) => (
          <MemberRow key={m.name} member={m} color={tier.color} />
        ))}
      </div>
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
      {/* Hero banner */}
      <div
        className="relative overflow-hidden rounded-cozy border border-cocoa/10 shadow-cozy"
        style={{ background: "linear-gradient(135deg,#FF5E7E,#E0A6FF 55%,#8B7DF0)" }}
      >
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 80% -10%, #FFD9E8, transparent 50%)" }} />
        <div className="relative flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8">
          <div className="text-night">
            <p className="font-display text-sm/none opacity-80">🍓 OURCHAT Teaparty</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">The Members</h1>
            <p className="mt-2 max-w-md text-sm text-night/80">
              Everyone who's pulled up a chair, sorted by their place at the table — tap anyone to
              visit their profile.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="rounded-2xl bg-night/15 px-4 py-2 backdrop-blur-sm">
              <p className="font-display text-2xl leading-none text-night">{total}</p>
              <p className="text-[11px] text-night/70">members</p>
            </div>
            <div className="rounded-2xl bg-night/15 px-4 py-2 backdrop-blur-sm">
              <p className="font-display text-2xl leading-none text-night">{onlineNow}</p>
              <p className="text-[11px] text-night/70">cozy now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role counts + presence legend */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TIERS.map((t) => (
            <span
              key={t.id}
              className="rounded-full px-3 py-1 text-xs font-display"
              style={{ background: `${t.color}22`, color: t.color }}
            >
              {t.emoji} {t.name} · {t.members.length}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-cocoa-soft">
          {PRESENCE_LEGEND.map((p) => (
            <span key={p.key} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: PRESENCE_COLOR[p.key] }} />
              {p.label}
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
