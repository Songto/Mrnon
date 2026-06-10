"use client";

import { useEffect, useRef, useState } from "react";
import { LOBBY } from "@/lib/rooms";
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

// Friendly code alphabet (no easily-confused characters).
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_PREFIX = "priv:";

function makeCode(len = 5): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

function cleanCode(raw: string): string {
  return raw
    .toUpperCase()
    .split("")
    .filter((c) => CODE_ALPHABET.includes(c))
    .join("")
    .slice(0, 8);
}

export function ChatRoom() {
  const { identity, ready } = useIdentity();
  const { socket, connected } = useSocket();
  const [roomId, setRoomId] = useState(LOBBY.id);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typers, setTypers] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPrivate = roomId !== LOBBY.id;
  const code = isPrivate ? roomId.slice(CODE_PREFIX.length) : "";
  const roomName = isPrivate ? `Private room ${code}` : LOBBY.name;
  const roomEmoji = isPrivate ? "🔑" : LOBBY.emoji;
  const roomAccent = isPrivate ? "bg-lavender/15" : LOBBY.accent;

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

  // Clear the view immediately when switching rooms (server sends fresh history).
  useEffect(() => {
    setMessages([]);
    setTypers({});
  }, [roomId]);

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

  const createPrivate = () => setRoomId(CODE_PREFIX + makeCode());
  const joinPrivate = () => {
    const c = cleanCode(joinInput);
    if (c.length < 3) return;
    setRoomId(CODE_PREFIX + c);
    setJoinInput("");
  };
  const copyCode = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
      {/* Left: lobby + private rooms + table */}
      <aside className="space-y-4">
        <div className="cozy-card p-3">
          <p className="mb-2 px-2 font-display text-sm text-cocoa-soft">Public table</p>
          <button
            onClick={() => setRoomId(LOBBY.id)}
            className={clsx(
              "flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition",
              !isPrivate ? "bg-strawberry/25" : "hover:bg-surface/70"
            )}
          >
            <span className="text-xl">{LOBBY.emoji}</span>
            <span>
              <span className="block font-display">{LOBBY.name}</span>
              <span className="block text-[11px] text-cocoa-soft">{LOBBY.blurb}</span>
            </span>
          </button>
        </div>

        {/* Private rooms by code */}
        <div className="cozy-card space-y-3 p-3">
          <p className="px-2 font-display text-sm text-cocoa-soft">Private room 🔑</p>

          {isPrivate ? (
            <div className="rounded-2xl bg-surface/60 p-3 text-center">
              <p className="text-[11px] text-cocoa-soft">Share this code to invite friends</p>
              <button
                onClick={copyCode}
                className="mt-1 inline-flex items-center gap-2 font-display text-2xl tracking-[0.3em] text-strawberry"
                title="Copy code"
              >
                {code}
                <span className="text-xs text-cocoa-soft">{copied ? "copied!" : "📋"}</span>
              </button>
              <button
                onClick={() => setRoomId(LOBBY.id)}
                className="mt-3 w-full rounded-full border border-cocoa/10 px-3 py-1.5 text-xs text-cocoa-soft hover:bg-surface"
              >
                ← Leave room
              </button>
              <p className="mt-2 text-[10px] text-cocoa-soft">
                This room disappears when everyone leaves.
              </p>
            </div>
          ) : (
            <>
              <CozyButton onClick={createPrivate} className="w-full text-sm">
                Open a private room ✨
              </CozyButton>
              <div className="flex items-center gap-2 px-1 text-[11px] text-cocoa-soft">
                <span className="h-px flex-1 bg-cocoa/10" /> or join by code{" "}
                <span className="h-px flex-1 bg-cocoa/10" />
              </div>
              <div className="flex gap-2">
                <input
                  value={joinInput}
                  onChange={(e) => setJoinInput(cleanCode(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && joinPrivate()}
                  placeholder="CODE"
                  className="w-full rounded-full border border-cocoa/10 bg-surface/80 px-4 py-2 text-center font-display tracking-[0.2em] outline-none focus:border-strawberry"
                />
                <CozyButton
                  variant="soft"
                  onClick={joinPrivate}
                  disabled={cleanCode(joinInput).length < 3}
                  className="px-4"
                >
                  Join
                </CozyButton>
              </div>
            </>
          )}
        </div>

        <div className={clsx("cozy-card p-4", roomAccent)}>
          <TeaTable seats={seats} meId={identity?.userId} />
        </div>
      </aside>

      {/* Right: messages + composer */}
      <section className="cozy-card flex h-[70vh] flex-col p-0">
        <div className="flex items-center justify-between border-b border-cocoa/10 px-5 py-3">
          <h2 className="flex items-center gap-2 text-lg">
            <span>{roomEmoji}</span> {roomName}
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

        <div
          ref={scrollRef}
          className="chat-scroll flex-1 space-y-3 overflow-y-auto px-5 py-4"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 8%, rgba(255,179,199,0.16), transparent 40%), radial-gradient(circle at 88% 92%, rgba(201,160,255,0.14), transparent 42%)"
          }}
        >
          {messages.length === 0 && (
            <p className="mt-10 text-center text-sm text-cocoa-soft">
              {isPrivate
                ? "Just the two of you (so far) — share the code above! 🔑"
                : "No messages yet — say hello and warm up the table! 🍵"}
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
                      "inline-block max-w-full whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm shadow-cozy [overflow-wrap:anywhere]",
                      mine ? "bg-strawberry text-night" : "bg-surface"
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-5 text-[11px] text-cocoa-soft">
          <span className="italic">
            {typingNames.length > 0 &&
              `${typingNames.slice(0, 2).join(", ")}${
                typingNames.length > 2 ? " and others" : ""
              } ${typingNames.length === 1 ? "is" : "are"} typing…`}
          </span>
          <span className="opacity-70">only the latest 30 messages are kept</span>
        </div>

        <div className="flex items-center gap-2 border-t border-cocoa/10 p-3">
          <input
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Message ${roomName}…`}
            maxLength={300}
            className="flex-1 rounded-full border border-rose/30 bg-surface/80 px-4 py-2.5 outline-none focus:border-strawberry"
          />
          <CozyButton onClick={send} disabled={!draft.trim()} className="px-5">
            Send 🫖
          </CozyButton>
        </div>
      </section>
    </div>
  );
}
