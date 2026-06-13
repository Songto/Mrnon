"use client";

import { useCallback, useEffect, useState } from "react";
import { useIdentity } from "@/lib/identity";
import { memberSlug } from "@/lib/members";
import { isAdminSlug, ROLE_META, type Role } from "@/lib/roles";
import { Avatar } from "@/components/ui/Avatar";

type AdminMember = {
  slug: string;
  displayName: string;
  avatarUrl?: string;
  storedRole: Role;
  banned: boolean;
  stageIndex: number;
  stageLabel: string;
  score: number;
  grantedBadges: string[];
  likes: number;
  seeds: number;
};

const ROLE_OPTIONS: Role[] = ["admin", "moderator", "vip", "member"];
const GRANTABLE = [
  { id: "secret", label: "Secret 🔒" },
  { id: "cutefactor", label: "Cutefactor 🎀" }
];

export default function AdminPage() {
  const { identity, ready } = useIdentity();
  const isAdmin = !!identity && isAdminSlug(memberSlug(identity.name));
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => setMembers(d.members ?? []))
      .catch(() => setError("Couldn't load members (are you logged in as an admin?)"));
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const act = async (slug: string, body: Record<string, unknown>, confirmMsg?: string) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setBusy(slug);
    setError(null);
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, ...body })
    })
      .then((r) => r.json())
      .catch(() => null);
    setBusy(null);
    if (!res || res.error) setError(res?.error || "Something went wrong");
    load();
  };

  if (ready && !isAdmin) {
    return (
      <div className="cozy-card mx-auto mt-10 max-w-md p-10 text-center">
        <div className="text-5xl">🔒</div>
        <h1 className="mt-3 text-2xl">Admins only</h1>
        <p className="mt-2 text-sm text-cocoa-soft">
          This page is for teaparty admins. If that should be you, add your profile slug to the
          admin list (ask your developer, or set <code>NEXT_PUBLIC_ADMIN_SLUGS</code> in Render).
        </p>
      </div>
    );
  }

  const filtered = members.filter(
    (m) =>
      m.displayName.toLowerCase().includes(q.toLowerCase()) ||
      m.slug.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl">🛠️ Admin panel</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search members…"
          className="rounded-full border border-cocoa/10 bg-surface/80 px-4 py-2 text-sm outline-none focus:border-strawberry"
        />
      </div>

      {error && <p className="rounded-2xl bg-strawberry/15 px-4 py-2 text-sm text-strawberry">{error}</p>}

      <p className="text-xs text-cocoa-soft">
        {members.length} members · ban hides someone from the site; garden ± moves their plant a
        stage; badges toggle the grantable ones.
      </p>

      <div className="space-y-3">
        {filtered.map((m) => (
          <div
            key={m.slug}
            className={`cozy-card flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between ${
              m.banned ? "opacity-70" : ""
            }`}
          >
            {/* identity */}
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={m.displayName} src={m.avatarUrl} size={40} />
              <div className="min-w-0">
                <p className="truncate font-display">
                  {m.displayName}{" "}
                  <span className="text-xs" title={ROLE_META[m.storedRole].label}>
                    {ROLE_META[m.storedRole].emoji}
                  </span>
                  {m.banned && <span className="ml-1 text-[11px] text-strawberry">· banned</span>}
                </p>
                <p className="truncate text-[11px] text-cocoa-soft">
                  /{m.slug} · 💗{m.likes} · 🌱{m.seeds}/10
                </p>
              </div>
            </div>

            {/* controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* role */}
              <select
                value={m.storedRole}
                disabled={busy === m.slug}
                onChange={(e) => act(m.slug, { action: "role", role: e.target.value })}
                className="rounded-full border border-cocoa/10 bg-surface px-2 py-1 font-display"
                title="Role"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_META[r].emoji} {r}
                  </option>
                ))}
              </select>

              {/* garden stage */}
              <div className="flex items-center gap-1 rounded-full bg-cocoa/5 px-1 py-0.5">
                <button
                  onClick={() => act(m.slug, { action: "stage", delta: -1 })}
                  disabled={busy === m.slug}
                  className="h-6 w-6 rounded-full hover:bg-strawberry/20"
                  title="Lower garden stage"
                >
                  −
                </button>
                <span className="px-1" title="Garden stage">
                  🪴 {m.stageLabel}
                </span>
                <button
                  onClick={() => act(m.slug, { action: "stage", delta: 1 })}
                  disabled={busy === m.slug}
                  className="h-6 w-6 rounded-full hover:bg-sage/40"
                  title="Raise garden stage"
                >
                  +
                </button>
              </div>

              {/* badges */}
              {GRANTABLE.map((b) => {
                const has = m.grantedBadges.includes(b.id);
                return (
                  <button
                    key={b.id}
                    onClick={() => act(m.slug, { action: "badge", badge: b.id })}
                    disabled={busy === m.slug}
                    className={`rounded-full px-2.5 py-1 font-display transition ${
                      has ? "bg-lavender text-cocoa" : "bg-cocoa/5 text-cocoa-soft hover:bg-cocoa/10"
                    }`}
                    title={has ? `Remove ${b.label}` : `Grant ${b.label}`}
                  >
                    {has ? "✓ " : "+ "}
                    {b.label}
                  </button>
                );
              })}

              {/* ban / unban */}
              <button
                onClick={() =>
                  act(
                    m.slug,
                    { action: m.banned ? "unban" : "ban" },
                    m.banned ? undefined : `Ban ${m.displayName}? They'll be hidden from the site.`
                  )
                }
                disabled={busy === m.slug}
                className="rounded-full bg-honey/40 px-3 py-1 font-display hover:bg-honey/70"
              >
                {m.banned ? "Unban" : "Ban"}
              </button>

              {/* delete */}
              <button
                onClick={() =>
                  act(m.slug, { action: "delete" }, `Permanently delete ${m.displayName}'s profile and garden? This can't be undone.`)
                }
                disabled={busy === m.slug}
                className="rounded-full px-3 py-1 font-display text-strawberry hover:bg-strawberry/15"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="cozy-card p-8 text-center text-sm text-cocoa-soft">No members found.</p>
        )}
      </div>
    </div>
  );
}
