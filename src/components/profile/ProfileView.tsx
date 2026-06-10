"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useIdentity } from "@/lib/identity";
import { memberSlug } from "@/lib/members";
import { backgroundCss, bannerCss, type ImageFit } from "@/lib/profile-presets";
import { Avatar } from "@/components/ui/Avatar";
import { CozyButton } from "@/components/ui/CozyButton";
import { IdentityModal } from "@/components/ui/IdentityModal";
import { ProfileMusic } from "./ProfileMusic";
import { PhotoShowcase } from "./PhotoShowcase";
import { ShowcaseList } from "./ShowcaseList";
import type { Showcase } from "@/lib/db";

type Comment = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  ts: number;
};

type Profile = {
  slug: string;
  ownerId?: string;
  displayName: string;
  tagline?: string;
  bio?: string;
  pronouns?: string;
  region?: string;
  ageRange?: string;
  favoriteGames?: string;
  lookingFor?: string;
  vibe?: string;
  accent: string;
  avatarUrl?: string;
  bannerId: string;
  bannerUrl?: string;
  bannerFit?: string;
  bannerPos?: string;
  backgroundId: string;
  backgroundUrl?: string;
  backgroundFit?: string;
  backgroundPos?: string;
  musicUrl?: string;
  discord?: string;
  twitch?: string;
  photos?: string[];
  showcaseStyle?: "grid" | "full";
  showcases?: Showcase[];
  comments: Comment[];
};

export type ProfileFallback = {
  displayName: string;
  tag?: string;
  tierName: string;
  tierColor: string;
  tierEmoji: string;
  note?: string;
};

const INFO_FIELDS: { key: keyof Profile; label: string; icon: string }[] = [
  { key: "pronouns", label: "Pronouns", icon: "🏷️" },
  { key: "region", label: "Region", icon: "🌍" },
  { key: "ageRange", label: "Age", icon: "🎂" },
  { key: "vibe", label: "Vibe", icon: "✨" },
  { key: "favoriteGames", label: "Plays", icon: "🎮" },
  { key: "lookingFor", label: "Looking for", icon: "🤝" }
];

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function ProfileView({ slug, fallback }: { slug: string; fallback: ProfileFallback }) {
  const { identity } = useIdentity();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDone, setReportDone] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [sending, setSending] = useState(false);
  const reasonRef = useRef<HTMLTextAreaElement | null>(null);

  const load = () =>
    fetch(`/api/profiles/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.profile);
        setComments(d.profile?.comments ?? []);
      })
      .catch(() => {});

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const accent = profile?.accent || fallback.tierColor;
  const isOwner = !!identity && memberSlug(identity.name) === slug;

  const sendComment = async () => {
    const text = draft.trim();
    if (!text || !identity) {
      if (!identity) setShowLogin(true);
      return;
    }
    setSending(true);
    const res = await fetch(`/api/profiles/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "comment",
        authorId: identity.userId,
        authorName: identity.name,
        authorAvatar: identity.avatar,
        text,
        displayName: fallback.displayName
      })
    })
      .then((r) => r.json())
      .catch(() => null);
    setSending(false);
    if (res?.ok) {
      setComments((c) => [...c, res.comment]);
      setDraft("");
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!identity) return;
    setComments((c) => c.filter((x) => x.id !== commentId));
    await fetch(`/api/profiles/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-comment", commentId, requesterId: identity.userId })
    }).catch(() => {});
  };

  const submitReport = async () => {
    if (!reportReason.trim()) return;
    await fetch(`/api/profiles/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "report",
        reporterId: identity?.userId || "anon",
        reporterName: identity?.name || "Someone",
        reason: reportReason
      })
    }).catch(() => {});
    setReportDone(true);
  };

  const filledInfo = INFO_FIELDS.filter((f) => (profile?.[f.key] as string)?.trim());

  return (
    <div className="relative">
      {/* Full-bleed custom background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: backgroundCss(
            profile?.backgroundId || "plum",
            profile?.backgroundUrl,
            (profile?.backgroundFit as ImageFit) || "fill",
            profile?.backgroundPos || "50% 50%"
          )
        }}
      />

      <div className="space-y-5">
        <Link href="/members" className="inline-block text-sm text-cocoa-soft hover:text-cocoa">
          ← back to members
        </Link>

        {/* Banner + header */}
        <div className="cozy-card overflow-hidden p-0" style={{ borderColor: `${accent}55` }}>
          <div
            className="h-36 w-full sm:h-44"
            style={{
              background: bannerCss(
                profile?.bannerId || "berry",
                profile?.bannerUrl,
                (profile?.bannerFit as ImageFit) || "fill",
                profile?.bannerPos || "50% 50%"
              )
            }}
          />
          <div className="px-5 pb-5">
            <div className="-mt-12 flex flex-wrap items-end justify-between gap-3">
              <div className="flex items-end gap-3">
                <div className="rounded-full ring-4" style={{ ["--tw-ring-color" as string]: accent }}>
                  <Avatar name={fallback.displayName} src={profile?.avatarUrl} size={88} />
                </div>
                <div className="pb-1">
                  <h1 className="flex items-center gap-2 text-2xl">
                    {profile?.displayName || fallback.displayName}
                    {fallback.tag && (
                      <span
                        className="rounded-md px-1.5 py-0.5 text-[11px] font-bold text-night"
                        style={{ background: accent }}
                      >
                        {fallback.tag}
                      </span>
                    )}
                  </h1>
                  <span className="text-sm" style={{ color: accent }}>
                    {fallback.tierEmoji} {fallback.tierName}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pb-1">
                <ProfileMusic url={profile?.musicUrl} accent={accent} />
                {isOwner ? (
                  <Link href="/profile">
                    <CozyButton className="px-4 py-2 text-sm">Customize ✏️</CozyButton>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setShowReport(true);
                      setReportDone(false);
                      setReportReason("");
                      setTimeout(() => reasonRef.current?.focus(), 50);
                    }}
                    className="rounded-full border border-cocoa/10 px-3 py-2 text-xs text-cocoa-soft hover:bg-surface"
                  >
                    🚩 Report
                  </button>
                )}
              </div>
            </div>

            {profile?.tagline && (
              <p className="mt-3 break-words font-display text-lg [overflow-wrap:anywhere]" style={{ color: accent }}>
                “{profile.tagline}”
              </p>
            )}
            {(profile?.bio || (isOwner && !profile?.bio)) && (
              <p className="mt-2 max-w-2xl whitespace-pre-wrap break-words text-sm text-cocoa-soft [overflow-wrap:anywhere]">
                {profile?.bio ||
                  "This is your profile — tap Customize to add a bio, banner, background, and theme music. 🍓"}
              </p>
            )}
          </div>
        </div>

        {/* Showcases (Steam-style: About / Screenshots / Featured) */}
        {profile?.showcases && profile.showcases.length > 0 ? (
          <ShowcaseList showcases={profile.showcases} accent={accent} />
        ) : (
          profile?.photos &&
          profile.photos.length > 0 && (
            <PhotoShowcase photos={profile.photos} style={profile.showcaseStyle || "grid"} />
          )
        )}

        {/* Info panel — clean, Discord-style (uppercase labels, accent bar) */}
        {(filledInfo.length > 0 || profile?.discord || profile?.twitch || isOwner) && (
          <div className="cozy-card overflow-hidden p-0">
            <div className="h-1.5 w-full" style={{ background: accent }} />
            <div className="p-5">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-cocoa-soft">
                About {profile?.displayName || fallback.displayName}
              </h2>
              {filledInfo.length === 0 && !profile?.discord && !profile?.twitch ? (
                <p className="text-sm text-cocoa-soft">
                  Nothing here yet{isOwner ? " — tap Customize to add your details. 🌷" : "."}
                </p>
              ) : (
                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {filledInfo.map((f) => (
                    <div key={f.key}>
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-cocoa-soft">
                        {f.icon} {f.label}
                      </p>
                      <p className="break-words text-sm [overflow-wrap:anywhere]">
                        {profile?.[f.key] as string}
                      </p>
                    </div>
                  ))}
                  {profile?.discord && (
                    <div>
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-cocoa-soft">
                        💬 Discord
                      </p>
                      <p className="break-words text-sm [overflow-wrap:anywhere]">{profile.discord}</p>
                    </div>
                  )}
                  {profile?.twitch && (
                    <div>
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-cocoa-soft">
                        🟣 Twitch
                      </p>
                      <p className="break-words text-sm [overflow-wrap:anywhere]">{profile.twitch}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comment wall */}
        <div className="cozy-card p-5">
          <h2 className="mb-3 text-lg">
            Guestbook 💬{" "}
            <span className="text-sm text-cocoa-soft">({comments.length})</span>
          </h2>

          <div className="mb-4 flex items-start gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendComment()}
              placeholder={
                identity ? `Leave a kind word for ${fallback.displayName}…` : "Pull up a chair to comment…"
              }
              maxLength={500}
              className="flex-1 rounded-full border border-cocoa/10 bg-surface/80 px-4 py-2.5 text-sm outline-none focus:border-strawberry"
            />
            <CozyButton onClick={sendComment} disabled={sending} className="px-5">
              Post
            </CozyButton>
          </div>

          {comments.length === 0 ? (
            <p className="py-6 text-center text-sm text-cocoa-soft">
              No notes yet — be the first to say hi! 🌸
            </p>
          ) : (
            <ul className="space-y-3">
              {[...comments].reverse().map((c) => {
                const mine = identity && (c.authorId === identity.userId || isOwner);
                return (
                  <li key={c.id} className="flex items-start gap-3">
                    <Avatar name={c.authorName} src={c.authorAvatar} size={34} />
                    <div className="min-w-0 flex-1 rounded-2xl bg-surface/60 px-4 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-display text-sm">{c.authorName}</span>
                        <span className="flex shrink-0 items-center gap-2 text-[11px] text-cocoa-soft">
                          {timeAgo(c.ts)}
                          {mine && (
                            <button
                              onClick={() => deleteComment(c.id)}
                              className="hover:text-strawberry"
                              title="Remove"
                            >
                              ✕
                            </button>
                          )}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm text-cocoa [overflow-wrap:anywhere]">
                        {c.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Report modal */}
      {showReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/70 p-4"
          onClick={() => setShowReport(false)}
        >
          <div
            className="cozy-card w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {reportDone ? (
              <div className="text-center">
                <div className="text-5xl">🛟</div>
                <h3 className="mt-2 text-xl">Thanks for looking out</h3>
                <p className="mt-1 text-sm text-cocoa-soft">
                  Your report was sent to the Householders. We keep the teaparty cozy.
                </p>
                <CozyButton onClick={() => setShowReport(false)} className="mt-4">
                  Close
                </CozyButton>
              </div>
            ) : (
              <>
                <h3 className="text-xl">Report {fallback.displayName}</h3>
                <p className="mt-1 text-sm text-cocoa-soft">
                  Tell the Householders what's wrong. Reports are private.
                </p>
                <textarea
                  ref={reasonRef}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="What happened?"
                  maxLength={500}
                  rows={4}
                  className="mt-3 w-full rounded-2xl border border-cocoa/10 bg-surface/80 px-4 py-2.5 text-sm outline-none focus:border-strawberry"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setShowReport(false)}
                    className="rounded-full px-4 py-2 text-sm text-cocoa-soft hover:bg-surface"
                  >
                    Cancel
                  </button>
                  <CozyButton onClick={submitReport} disabled={!reportReason.trim()}>
                    Send report 🚩
                  </CozyButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showLogin && <IdentityModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
