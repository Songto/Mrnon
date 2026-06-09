"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useIdentity } from "@/lib/identity";
import { memberSlug } from "@/lib/members";
import { Avatar } from "@/components/ui/Avatar";
import { CozyButton } from "@/components/ui/CozyButton";
import { IdentityModal } from "@/components/ui/IdentityModal";

type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorSlug: string;
  text: string;
  game?: string;
  vibe?: string;
  accent: string;
  waves: string[];
  createdAt: number;
  expiresAt: number;
};

type Poke = {
  id: string;
  fromId: string;
  fromName: string;
  fromAvatar?: string;
  fromSlug: string;
  ts: number;
  seen: boolean;
};

const VIBES = [
  { label: "chill", emoji: "😌", accent: "#7FD0C0" },
  { label: "competitive", emoji: "🔥", accent: "#FF5E7E" },
  { label: "co-op", emoji: "🤝", accent: "#9FC79A" },
  { label: "late-night", emoji: "🌙", accent: "#8B7DF0" },
  { label: "just vibing", emoji: "✨", accent: "#F0C987" },
  { label: "new friends", emoji: "🌸", accent: "#FF8FB0" }
];

const TTL = 90 * 60 * 1000;

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

function timeLeft(expiresAt: number, now: number) {
  const ms = Math.max(0, expiresAt - now);
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const label = mins >= 1 ? `${mins} min left` : `${secs}s left`;
  const frac = Math.max(0, Math.min(1, ms / TTL));
  const color = mins >= 30 ? "#8FD08A" : mins >= 10 ? "#F0C987" : "#FF5E7E";
  return { label, frac, color, expired: ms <= 0 };
}

export function FeedBoard() {
  const { identity } = useIdentity();
  const now = useNow(1000);
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState("");
  const [game, setGame] = useState("");
  const [vibe, setVibe] = useState(VIBES[0]);
  const [showLogin, setShowLogin] = useState(false);
  const [posting, setPosting] = useState(false);
  const [poked, setPoked] = useState<Record<string, boolean>>({}); // authorId -> just poked
  const [pokes, setPokes] = useState<Poke[]>([]);
  const loadedOnce = useRef(false);

  const load = () =>
    fetch("/api/feed")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .catch(() => {});

  const loadPokes = (markSeen = false) => {
    if (!identity) return;
    fetch(`/api/pokes?user=${encodeURIComponent(identity.userId)}`)
      .then((r) => r.json())
      .then((d) => {
        setPokes(d.pokes ?? []);
        if (markSeen && (d.unseen ?? 0) > 0) {
          fetch("/api/pokes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "seen", user: identity.userId })
          }).catch(() => {});
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 20000); // keep the feed fresh
    loadedOnce.current = true;
    return () => clearInterval(t);
  }, []);

  // Load (and mark seen) the current member's pokes, then poll for new ones.
  useEffect(() => {
    loadPokes(true);
    const t = setInterval(() => loadPokes(false), 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity?.userId]);

  const poke = async (
    toId: string,
    toName: string,
    toAvatar?: string,
    toSlug?: string
  ) => {
    if (!identity) {
      setShowLogin(true);
      return;
    }
    setPoked((p) => ({ ...p, [toId]: true }));
    setTimeout(() => setPoked((p) => ({ ...p, [toId]: false })), 4000);
    await fetch("/api/pokes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "poke",
        toId,
        fromId: identity.userId,
        fromName: identity.name,
        fromAvatar: identity.avatar,
        fromSlug: memberSlug(identity.name)
      })
    }).catch(() => {});
  };

  const dismissPoke = async (pokeId: string) => {
    if (!identity) return;
    setPokes((ps) => ps.filter((p) => p.id !== pokeId));
    await fetch("/api/pokes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear", pokeId, user: identity.userId })
    }).catch(() => {});
  };

  const myPost = identity ? posts.find((p) => p.authorId === identity.userId) : undefined;

  const submit = async () => {
    if (!identity) {
      setShowLogin(true);
      return;
    }
    if (!text.trim()) return;
    setPosting(true);
    const res = await fetch("/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "post",
        authorId: identity.userId,
        authorName: identity.name,
        authorAvatar: identity.avatar,
        authorSlug: memberSlug(identity.name),
        text,
        game,
        vibe: `${vibe.emoji} ${vibe.label}`,
        accent: vibe.accent
      })
    })
      .then((r) => r.json())
      .catch(() => null);
    setPosting(false);
    if (res?.ok) {
      setPosts(res.posts);
      setText("");
      setGame("");
    }
  };

  const wave = async (postId: string) => {
    if (!identity) {
      setShowLogin(true);
      return;
    }
    // optimistic
    setPosts((ps) =>
      ps.map((p) =>
        p.id === postId
          ? {
              ...p,
              waves: p.waves.includes(identity.userId)
                ? p.waves.filter((w) => w !== identity.userId)
                : [...p.waves, identity.userId]
            }
          : p
      )
    );
    await fetch("/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "wave", postId, userId: identity.userId })
    }).catch(() => {});
  };

  const remove = async (postId: string) => {
    if (!identity) return;
    setPosts((ps) => ps.filter((p) => p.id !== postId));
    await fetch("/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", postId, userId: identity.userId })
    }).catch(() => {});
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      {/* Composer */}
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="cozy-card p-5" style={{ borderColor: `${vibe.accent}55` }}>
          <h2 className="text-lg">Looking for a friend? 🌷</h2>
          <p className="mt-1 text-xs text-cocoa-soft">
            Post a little card and it floats on the feed for <b>90 minutes</b>. One per person —
            posting again refreshes yours.
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {VIBES.map((v) => (
              <button
                key={v.label}
                onClick={() => setVibe(v)}
                className="rounded-full px-2.5 py-1 text-xs font-display transition"
                style={
                  vibe.label === v.label
                    ? { background: v.accent, color: "#15101b" }
                    : { background: "rgba(255,255,255,0.06)", color: "#B6A2C2" }
                }
              >
                {v.emoji} {v.label}
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={280}
            placeholder="e.g. Anyone up for chill ranked tonight? New friends welcome 💕"
            className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-surface/80 px-4 py-2.5 text-sm outline-none [overflow-wrap:anywhere] focus:border-strawberry"
          />
          <div className="mb-1 flex justify-between text-[10px] text-cocoa-soft">
            <span>{text.length}/280</span>
          </div>

          <input
            value={game}
            onChange={(e) => setGame(e.target.value)}
            maxLength={60}
            placeholder="🎮 Game / activity (optional)"
            className="mt-1 w-full rounded-full border border-white/10 bg-surface/80 px-4 py-2 text-sm outline-none focus:border-strawberry"
          />

          <CozyButton onClick={submit} disabled={posting || !text.trim()} className="mt-3 w-full">
            {myPost ? "Refresh my post 🔄" : "Post to the feed 💌"}
          </CozyButton>
          {!identity && (
            <p className="mt-2 text-center text-[11px] text-cocoa-soft">
              Pull up a chair first to post.
            </p>
          )}
        </div>

        {/* Pokes you've received */}
        {identity && pokes.length > 0 && (
          <div className="cozy-card p-4">
            <p className="mb-2 font-display text-sm">👉 Your pokes ({pokes.length})</p>
            <ul className="space-y-1.5">
              {pokes.map((pk) => (
                <li key={pk.id} className="flex items-center gap-2 rounded-2xl bg-surface/60 px-2 py-1.5">
                  <Link href={`/members/${pk.fromSlug}`} className="shrink-0">
                    <Avatar name={pk.fromName} src={pk.fromAvatar} size={32} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      <Link href={`/members/${pk.fromSlug}`} className="font-display hover:underline">
                        {pk.fromName}
                      </Link>{" "}
                      <span className="text-cocoa-soft">poked you</span>
                    </p>
                  </div>
                  <button
                    onClick={() => poke(pk.fromId, pk.fromName, pk.fromAvatar, pk.fromSlug)}
                    disabled={poked[pk.fromId]}
                    className="shrink-0 rounded-full bg-strawberry/20 px-2.5 py-1 text-[11px] font-display text-strawberry transition active:scale-95"
                  >
                    {poked[pk.fromId] ? "poked!" : "poke back 👉"}
                  </button>
                  <button
                    onClick={() => dismissPoke(pk.id)}
                    className="shrink-0 px-1 text-cocoa-soft hover:text-strawberry"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="cozy-card flex items-center gap-3 p-4 text-xs text-cocoa-soft">
          <span className="text-2xl">⏳</span>
          <span>Posts gently fade away after 90 minutes, so the feed always shows folks who are around <i>right now</i>.</span>
        </div>
      </aside>

      {/* Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">On the feed now 🌸</h2>
          <span className="rounded-full bg-surface/70 px-3 py-1 text-xs text-cocoa-soft">
            {posts.length} {posts.length === 1 ? "friend" : "friends"} looking
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="cozy-card flex flex-col items-center gap-2 p-12 text-center">
            <span className="text-5xl animate-float-slow">🍃</span>
            <p className="font-display text-lg">It's quiet on the feed</p>
            <p className="max-w-xs text-sm text-cocoa-soft">
              Be the first to post — say what you're up for and watch the waves roll in!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {posts.map((p) => {
              const t = timeLeft(p.expiresAt, now);
              const mine = identity?.userId === p.authorId;
              const iWaved = identity ? p.waves.includes(identity.userId) : false;
              return (
                <article
                  key={p.id}
                  className="cozy-card relative flex flex-col gap-3 p-4"
                  style={{ borderColor: `${p.accent}66` }}
                >
                  {/* time ribbon */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/members/${p.authorSlug}`}
                      className="flex items-center gap-2 group"
                    >
                      <div className="rounded-full ring-2" style={{ ["--tw-ring-color" as string]: p.accent }}>
                        <Avatar name={p.authorName} src={p.authorAvatar} size={40} />
                      </div>
                      <div>
                        <p className="font-display leading-tight group-hover:underline">{p.authorName}</p>
                        {p.vibe && (
                          <span className="text-[11px]" style={{ color: p.accent }}>
                            {p.vibe}
                          </span>
                        )}
                      </div>
                    </Link>
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-display"
                      style={{ background: `${t.color}22`, color: t.color }}
                      title="Time remaining"
                    >
                      ⏳ {t.label}
                    </span>
                  </div>

                  <p className="text-sm text-cocoa [overflow-wrap:anywhere]">{p.text}</p>

                  {p.game && (
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-surface/70 px-3 py-1 text-xs text-cocoa-soft">
                      🎮 {p.game}
                    </span>
                  )}

                  {/* countdown bar */}
                  <div className="h-1 w-full overflow-hidden rounded-full bg-surface/70">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.round(t.frac * 100)}%`, background: t.color }}
                    />
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => wave(p.id)}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-display transition active:scale-95"
                        style={
                          iWaved
                            ? { background: p.accent, color: "#15101b" }
                            : { background: "rgba(255,255,255,0.06)", color: "#F5E8F0" }
                        }
                      >
                        <span className={iWaved ? "animate-wiggle" : ""}>👋</span>
                        {p.waves.length > 0 ? p.waves.length : "wave"}
                      </button>

                      {!mine && (
                        <button
                          onClick={() => poke(p.authorId, p.authorName, p.authorAvatar, p.authorSlug)}
                          disabled={poked[p.authorId]}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-sm font-display text-cocoa transition active:scale-95 disabled:opacity-100"
                          title={`Poke ${p.authorName}`}
                        >
                          <span className={poked[p.authorId] ? "animate-wiggle" : ""}>👉</span>
                          {poked[p.authorId] ? "poked!" : "poke"}
                        </button>
                      )}
                    </div>

                    {mine ? (
                      <button
                        onClick={() => remove(p.id)}
                        className="text-xs text-cocoa-soft hover:text-strawberry"
                      >
                        remove
                      </button>
                    ) : (
                      <Link
                        href={`/members/${p.authorSlug}`}
                        className="text-xs text-cocoa-soft hover:text-strawberry"
                      >
                        view profile →
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {showLogin && <IdentityModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
