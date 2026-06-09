"use client";

import { useEffect, useState } from "react";
import { useIdentity } from "@/lib/identity";
import { celebrateBadges } from "@/lib/toast";
import { clsx } from "@/lib/clsx";
import { CozyButton } from "../ui/CozyButton";

type EventRecord = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  host: string;
  discordUrl?: string;
  attendees: string[];
};

function formatDate(d: string) {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function EventCalendar() {
  const { identity } = useIdentity();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "18:00", discordUrl: "" });

  const load = () =>
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const rsvp = async (eventId: string) => {
    if (!identity) return;
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rsvp", eventId, userId: identity.userId, name: identity.name })
    }).then((r) => r.json());
    if (res.events) setEvents(res.events);
    celebrateBadges(res.newBadges);
  };

  const submit = async () => {
    if (!form.title || !form.date) return;
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, host: identity?.name || "A cozy host" })
    }).then((r) => r.json());
    if (res.events) setEvents(res.events);
    setForm({ title: "", description: "", date: "", time: "18:00", discordUrl: "" });
    setCreating(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-cocoa-soft">
          {events.length} upcoming {events.length === 1 ? "gathering" : "gatherings"}
        </p>
        <CozyButton className="text-sm" onClick={() => setCreating((c) => !c)}>
          {creating ? "Close" : "Host a party 🎀"}
        </CozyButton>
      </div>

      {creating && (
        <div className="cozy-card space-y-3 p-5 animate-pop">
          <h3 className="text-lg">Plan a cozy gathering</h3>
          <input
            placeholder="Event title (e.g. Stardew co-op night)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-2xl border border-rose/30 bg-white/80 px-4 py-2 outline-none focus:border-rose-deep"
          />
          <textarea
            placeholder="What's the plan? Bring tea, bring friends…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full rounded-2xl border border-rose/30 bg-white/80 px-4 py-2 outline-none focus:border-rose-deep"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="rounded-2xl border border-rose/30 bg-white/80 px-4 py-2 outline-none focus:border-rose-deep"
            />
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="rounded-2xl border border-rose/30 bg-white/80 px-4 py-2 outline-none focus:border-rose-deep"
            />
          </div>
          <input
            placeholder="Discord channel / invite link (optional)"
            value={form.discordUrl}
            onChange={(e) => setForm({ ...form, discordUrl: e.target.value })}
            className="w-full rounded-2xl border border-rose/30 bg-white/80 px-4 py-2 outline-none focus:border-rose-deep"
          />
          <CozyButton onClick={submit} disabled={!form.title || !form.date}>
            Add to calendar ✨
          </CozyButton>
        </div>
      )}

      <div className="space-y-3">
        {events.map((evt) => {
          const going = identity ? evt.attendees.includes(identity.userId) : false;
          return (
            <div key={evt.id} className="cozy-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
              <div className="flex w-full items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-rose/30 text-center">
                  <span className="text-[10px] uppercase text-rose-deep">
                    {formatDate(evt.date).split(" ")[0]}
                  </span>
                  <span className="font-display text-xl leading-none">
                    {new Date(evt.date + "T00:00:00").getDate()}
                  </span>
                  <span className="text-[10px] text-cocoa-soft">{evt.time}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg">{evt.title}</h3>
                  <p className="line-clamp-2 text-sm text-cocoa-soft">{evt.description}</p>
                  <p className="mt-1 text-xs text-cocoa-soft">
                    Hosted by {evt.host} · {evt.attendees.length} going
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {evt.discordUrl && (
                  <a
                    href={evt.discordUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="cozy-link bg-[#5865F2] text-sm text-white"
                  >
                    Discord ↗
                  </a>
                )}
                <CozyButton
                  variant={going ? "soft" : "primary"}
                  className="text-sm"
                  onClick={() => rsvp(evt.id)}
                  disabled={!identity}
                >
                  {going ? "Going ✓" : "RSVP"}
                </CozyButton>
              </div>
            </div>
          );
        })}
      </div>
      {!identity && (
        <p className="text-center text-xs text-cocoa-soft">
          Pull up a chair (top right) to RSVP and host events.
        </p>
      )}
    </div>
  );
}
