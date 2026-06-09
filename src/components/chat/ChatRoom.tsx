"use client";

import { useEffect, useRef, useState } from "react";
import { ROOMS } from "@/lib/rooms";
import { useIdentity } from "@/lib/identity";
import { useSocket } from "@/lib/socket-client";
import { celebrateBadges, type BadgeToast } from "@/lib/toast";
import { clsx } from "@/lib/clsx";
import { Avatar } from "../ui/Avatar";
import { CozyButton } from "../ui/CozyButton";
import { IdentityModal } from "../ui/IdentityModal";
import { TeaTable, type Seat } from "./TeaTable";

type Message = {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  text: string;
  ts: number;
};

export function ChatRoom() {
  const { identity, ready } = useIdentity();
  const { socket, connected } = useSocket();
  const [roomId, setRoomId] = useState(ROOMS[0].id);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typers, setTypers] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState("");
  const [showModal, setShowModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const room = ROOMS.find((r) => r.id === roomId)!;

  // Join the selected room whenever identity / room / connection changes.
  useEffect(() => {
    if (!socket || !identity || !connected) return;
    socket.emit("join", {
      room: roomId,
      userId: identity.userId,
      name: identity.name,
      avatar: identity.avatar
    });
  }, [socket, identity, roomId, connected]);

  // Wire socket listeners once.
  useEffect(() => {
    if (!socket) return;
    const onHistory = (msgs: Message[]) => setMessages(msgs);
    const onMessage = (m: Message) => setMessages((prev) => [...prev, m]);
    const onSeats = (s: Seat[]) => setSeats(s);
    const onBadges = (b: BadgeToast[]) => celebrateBadges(b);
    const onTyping = (t: { userId: string; name: string; isTyping: boolean }) => {
      setTypers((prev) => {
        const next = { ...prev };
        if (t.isTyping) next[t.userId] = t.name;
        else delete next[t.userId];
        return next;
      });
    };
    socket.on("history", onHistory);
    socket.on("message", onMessage);
    socket.on("seats", onSeats);
    socket.on("typing", onTyping);
    socket.on("badges", onBadges);
    return () => {
      socket.off("history", onHistory);
      socket.off("message", onMessage);
      socket.off("seats", onSeats);
      socket.off("typing", onTyping);
      socket.off("badges", onBadges);
    };
  }, [socket]);

  // Autoscroll to newest.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text || !socket) return;
    socket.emit("message", { text });
    socket.emit("typing", false);
    setDraft("");
  };

  const onDraftChange = (v: string) => {
    setDraft(v);
    if (!socket) return;
    socket.emit("typing", true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => socket.emit("typing", false), 1200);
  };

  if (ready && !identity) {
    return (
      <>
        <div className="cozy-card flex flex-col items-center gap-3 p-10 text-center">
          <div className="text-6xl animate-wiggle">🪑</div>
          <h2 className="text-2xl">Pull up a chair to start chatting</h2>
          <p className="max-w-sm text-sm text-cocoa-soft">
            Pick a cozy name (or sign in with Discord) and join the table.
          </p>
          <CozyButton onClick={() => setShowModal(true)}>Pull up a chair ✨</CozyButton>
        </div>
        {showModal && <IdentityModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  const typingNames = Object.values(typers).filter((n) => n !== identity?.name);

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      {/* Left: room picker + table */}
      <aside className="space-y-4">
        <div className="cozy-card p-3">
          <p className="mb-2 px-2 font-display text-sm text-cocoa-soft">Choose a table</p>
          <div className="space-y-1">
            {ROOMS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRoomId(r.id)}
                className={clsx(
                  "flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition",
                  r.id === roomId ? "bg-rose/40" : "hover:bg-white/70"
                )}
              >
                <span className="text-xl">{r.emoji}</span>
                <span>
                  <span className="block font-display">{r.name}</span>
                  <span className="block text-[11px] text-cocoa-soft">{r.blurb}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className={clsx("cozy-card p-4", room.accent)}>
          <TeaTable seats={seats} meId={identity?.userId} />
        </div>
      </aside>

      {/* Right: messages + composer */}
      <section className="cozy-card flex h-[70vh] flex-col p-0">
        <div className="flex items-center justify-between border-b border-white/60 px-5 py-3">
          <h2 className="flex items-center gap-2 text-lg">
            <span>{room.emoji}</span> {room.name}
          </h2>
          <span
            className={clsx(
              "flex items-center gap-1.5 text-xs",
              connected ? "text-sage-deep" : "text-cocoa-soft"
            )}
          >
            <span
              className={clsx(
                "h-2 w-2 rounded-full",
                connected ? "bg-sage-deep" : "bg-cocoa-soft/50"
              )}
            />
            {connected ? "live" : "connecting…"}
          </span>
        </div>

        <div ref={scrollRef} className="chat-scroll flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {messages.length === 0 && (
            <p className="mt-10 text-center text-sm text-cocoa-soft">
              No messages yet — say hello and warm up the table! 🍵
            </p>
          )}
          {messages.map((m) => {
            const mine = m.userId === identity?.userId;
            return (
              <div
                key={m.id}
                className={clsx("flex items-end gap-2", mine && "flex-row-reverse")}
              >
                <Avatar name={m.name} src={m.avatar} size={32} />
                <div className={clsx("max-w-[75%]", mine && "text-right")}>
                  <div className="mb-0.5 text-[11px] text-cocoa-soft">
                    {mine ? "you" : m.name} ·{" "}
                    {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div
                    className={clsx(
                      "inline-block rounded-2xl px-3.5 py-2 text-sm shadow-cozy",
                      mine ? "bg-rose-deep text-white" : "bg-white"
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-5 px-5 text-xs italic text-cocoa-soft">
          {typingNames.length > 0 &&
            `${typingNames.slice(0, 2).join(", ")}${
              typingNames.length > 2 ? " and others" : ""
            } ${typingNames.length === 1 ? "is" : "are"} typing…`}
        </div>

        <div className="flex items-center gap-2 border-t border-white/60 p-3">
          <input
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Message ${room.name}…`}
            maxLength={600}
            className="flex-1 rounded-full border border-rose/30 bg-white/80 px-4 py-2.5 outline-none focus:border-rose-deep"
          />
          <CozyButton onClick={send} disabled={!draft.trim()} className="px-5">
            Send 🫖
          </CozyButton>
        </div>
      </section>
    </div>
  );
}
