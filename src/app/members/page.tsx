import Link from "next/link";
import { listMembers, type MemberCard } from "@/lib/db";
import { ROLE_META, ROLE_ORDER, roleForSlug, type Role } from "@/lib/roles";
import { MemberMiniCard } from "@/components/members/MemberMiniCard";

export const metadata = { title: "Members · OURCHAT Teaparty 🍓" };
export const dynamic = "force-dynamic";

export default function MembersPage() {
  const members = listMembers();
  const byRole: Record<Role, MemberCard[]> = { admin: [], moderator: [], member: [] };
  for (const m of members) byRole[roleForSlug(m.slug, m.storedRole)].push(m);

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div
        className="relative overflow-hidden rounded-cozy border border-cocoa/10 shadow-cozy"
        style={{ background: "linear-gradient(135deg,#FF7E9B,#E0A6FF 55%,#8B7DF0)" }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(circle at 80% -10%, #FFF, transparent 50%)" }}
        />
        <div className="relative flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8">
          <div className="text-night">
            <p className="font-display text-sm/none opacity-80">🍓 OURCHAT Teaparty</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Our Members</h1>
            <p className="mt-2 max-w-md text-sm text-night/80">
              Everyone who&apos;s registered on the site — tap a card to visit their full profile.
            </p>
          </div>
          <div className="rounded-2xl bg-night/15 px-4 py-2 backdrop-blur-sm">
            <p className="font-display text-2xl leading-none text-night">{members.length}</p>
            <p className="text-[11px] text-night/70">members</p>
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="cozy-card flex flex-col items-center gap-2 p-12 text-center">
          <span className="text-5xl animate-float-slow">🪑</span>
          <p className="font-display text-lg">No members yet</p>
          <p className="max-w-xs text-sm text-cocoa-soft">
            Be the first — pull up a chair and set up your profile, and your card will appear here.
          </p>
          <Link href="/profile" className="mt-2 rounded-full bg-strawberry px-4 py-2 text-sm font-display text-night">
            Create your profile 🌷
          </Link>
        </div>
      ) : (
        ROLE_ORDER.map((role) => {
          const list = byRole[role];
          if (list.length === 0) return null;
          const meta = ROLE_META[role];
          return (
            <section key={role}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="flex items-center gap-2 text-lg" style={{ color: meta.color }}>
                  <span>{meta.emoji}</span> {meta.label}
                </h2>
                <span className="rounded-full bg-cocoa/5 px-2 py-0.5 text-[11px] text-cocoa-soft">
                  {list.length}
                </span>
                <span className="hidden text-xs text-cocoa-soft sm:inline">· {meta.blurb}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {list.map((m) => (
                  <MemberMiniCard key={m.slug} member={m} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
