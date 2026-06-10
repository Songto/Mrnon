"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useIdentity } from "@/lib/identity";
import { memberSlug } from "@/lib/members";
import {
  ACCENTS,
  BANNERS,
  BACKGROUNDS,
  MUSIC_SUGGESTIONS,
  bannerCss,
  backgroundCss
} from "@/lib/profile-presets";
import { Avatar } from "@/components/ui/Avatar";
import { CozyButton } from "@/components/ui/CozyButton";
import { PhotoStudio } from "./PhotoStudio";

type Form = {
  displayName: string;
  tagline: string;
  bio: string;
  pronouns: string;
  region: string;
  ageRange: string;
  vibe: string;
  favoriteGames: string;
  lookingFor: string;
  discord: string;
  twitch: string;
  musicUrl: string;
  accent: string;
  bannerId: string;
  bannerUrl: string;
  backgroundId: string;
  backgroundUrl: string;
  photos: string[];
  showcaseStyle: "grid" | "full";
};

const EMPTY: Form = {
  displayName: "",
  tagline: "",
  bio: "",
  pronouns: "",
  region: "",
  ageRange: "",
  vibe: "",
  favoriteGames: "",
  lookingFor: "",
  discord: "",
  twitch: "",
  musicUrl: "",
  accent: ACCENTS[0],
  bannerId: "berry",
  bannerUrl: "",
  backgroundId: "plum",
  backgroundUrl: "",
  photos: [],
  showcaseStyle: "grid"
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-display text-cocoa-soft">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-cocoa/10 bg-surface/80 px-4 py-2.5 text-sm outline-none focus:border-strawberry"
      />
      {hint && <span className="mt-1 block text-[11px] text-cocoa-soft">{hint}</span>}
    </label>
  );
}

export function ProfileEditor() {
  const { identity } = useIdentity();
  const [form, setForm] = useState<Form>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const slug = identity ? memberSlug(identity.name) : "";

  useEffect(() => {
    if (!identity) return;
    fetch(`/api/profiles/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        const p = d.profile || {};
        setForm({
          ...EMPTY,
          ...Object.fromEntries(
            Object.keys(EMPTY).map((k) => [k, (p as Record<string, unknown>)[k] ?? EMPTY[k as keyof Form]])
          ),
          displayName: p.displayName || identity.name
        } as Form);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!identity) return null;

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/profiles/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save",
        editorId: identity.userId,
        editorName: identity.name,
        patch: form
      })
    })
      .then((r) => r.json())
      .catch(() => null);
    setSaving(false);
    if (res?.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="cozy-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg">Customize your profile ✨</h3>
        <Link
          href={`/members/${slug}`}
          className="text-sm text-cocoa-soft underline hover:text-strawberry"
        >
          View public profile →
        </Link>
      </div>

      {/* Live preview */}
      <div className="mb-5 overflow-hidden rounded-cozy border border-cocoa/10">
        <div
          className="h-24 w-full"
          style={{ background: bannerCss(form.bannerId, form.bannerUrl) }}
        />
        <div
          className="flex items-end gap-3 px-4 pb-3"
          style={{ background: backgroundCss(form.backgroundId, form.backgroundUrl) }}
        >
          <div className="-mt-8 rounded-full ring-4" style={{ ["--tw-ring-color" as string]: form.accent }}>
            <Avatar name={form.displayName || identity.name} size={64} />
          </div>
          <div className="pb-1">
            <p className="font-display text-lg text-cocoa">{form.displayName || identity.name}</p>
            {form.tagline && (
              <p className="text-xs" style={{ color: form.accent }}>
                “{form.tagline}”
              </p>
            )}
          </div>
        </div>
      </div>

      {!loaded ? (
        <p className="text-sm text-cocoa-soft">Loading your card…</p>
      ) : (
        <div className="space-y-5">
          {/* Banner */}
          <div>
            <p className="mb-2 text-xs font-display text-cocoa-soft">Banner</p>
            <div className="flex flex-wrap gap-2">
              {BANNERS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => set("bannerId", b.id)}
                  title={b.label}
                  className={`h-9 w-14 rounded-lg ring-2 transition ${
                    form.bannerId === b.id ? "ring-strawberry" : "ring-transparent"
                  }`}
                  style={{ background: b.css }}
                />
              ))}
            </div>
            <Field
              label=""
              value={form.bannerUrl}
              onChange={(v) => {
                set("bannerUrl", v);
                if (v) set("bannerId", "custom");
              }}
              placeholder="…or paste a custom banner image URL"
            />
          </div>

          {/* Background */}
          <div>
            <p className="mb-2 text-xs font-display text-cocoa-soft">Page background</p>
            <div className="flex flex-wrap gap-2">
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => set("backgroundId", b.id)}
                  title={b.label}
                  className={`h-9 w-14 rounded-lg ring-2 transition ${
                    form.backgroundId === b.id ? "ring-strawberry" : "ring-transparent"
                  }`}
                  style={{ background: b.css }}
                />
              ))}
            </div>
            <Field
              label=""
              value={form.backgroundUrl}
              onChange={(v) => {
                set("backgroundUrl", v);
                if (v) set("backgroundId", "custom");
              }}
              placeholder="…or paste a custom background image URL"
            />
          </div>

          {/* Accent */}
          <div>
            <p className="mb-2 text-xs font-display text-cocoa-soft">Accent colour</p>
            <div className="flex flex-wrap gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => set("accent", c)}
                  className={`h-8 w-8 rounded-full ring-2 transition ${
                    form.accent === c ? "ring-white" : "ring-transparent"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          {/* Music */}
          <div>
            <Field
              label="Profile music 🎵"
              value={form.musicUrl}
              onChange={(v) => set("musicUrl", v)}
              placeholder="YouTube link or direct .mp3 URL"
              hint="Plays when someone opens your profile."
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {MUSIC_SUGGESTIONS.map((m) => (
                <button
                  key={m.url}
                  onClick={() => set("musicUrl", m.url)}
                  className="rounded-full bg-surface/70 px-3 py-1 text-[11px] text-cocoa-soft hover:bg-surface"
                >
                  ♪ {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo showcase */}
          <div className="border-t border-cocoa/10 pt-4">
            <PhotoStudio
              photos={form.photos}
              style={form.showcaseStyle}
              onPhotosChange={(photos) => set("photos", photos)}
              onStyleChange={(s) => set("showcaseStyle", s)}
            />
          </div>

          {/* Basic info */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Display name" value={form.displayName} onChange={(v) => set("displayName", v)} />
            <Field label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} placeholder="A short headline" />
            <Field label="Pronouns" value={form.pronouns} onChange={(v) => set("pronouns", v)} placeholder="she/her, they/them…" />
            <Field label="Region" value={form.region} onChange={(v) => set("region", v)} placeholder="SEA, EU, NA…" />
            <Field label="Age" value={form.ageRange} onChange={(v) => set("ageRange", v)} placeholder="e.g. 20s" />
            <Field label="Vibe" value={form.vibe} onChange={(v) => set("vibe", v)} placeholder="chill / chaotic / sweet" />
            <Field label="Games you play" value={form.favoriteGames} onChange={(v) => set("favoriteGames", v)} placeholder="Valorant, Stardew…" />
            <Field label="Looking for" value={form.lookingFor} onChange={(v) => set("lookingFor", v)} placeholder="duo partners, chill friends…" />
            <Field label="Discord" value={form.discord} onChange={(v) => set("discord", v)} placeholder="yourname" />
            <Field label="Twitch" value={form.twitch} onChange={(v) => set("twitch", v)} placeholder="yourchannel" />
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-display text-cocoa-soft">About me</span>
            <textarea
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              rows={3}
              maxLength={600}
              placeholder="Tell people who you are…"
              className="w-full rounded-2xl border border-cocoa/10 bg-surface/80 px-4 py-2.5 text-sm outline-none focus:border-strawberry"
            />
          </label>

          <div className="flex items-center gap-3">
            <CozyButton onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save profile 🍓"}
            </CozyButton>
            {saved && <span className="text-sm text-sage-deep">Saved! ✨</span>}
          </div>
        </div>
      )}
    </div>
  );
}
