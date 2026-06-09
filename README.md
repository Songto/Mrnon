# 🫖 Ourchat

A cute, **cozy tea-party themed** website for our game community — with a **live chat**,
a growing **member garden**, **events & collectible badges**, and a tight link to our
**Discord** server. Built to feel like a warm little corner of the internet you actually
want to hang out in.

> ✨ **Runs out of the box.** With no configuration it starts in a friendly *demo mode*
> (guest-name login + mock Discord online members). Add a few env vars to switch on real
> Discord login and the live member widget.

---

## ✨ Features

| | |
|---|---|
| 🍵 **Tea-table chat rooms** | Pull up a chair at a themed table (Chamomile Corner, Matcha Booth, Midnight Oolong, Strawberry Parlor). Real-time messages, seated avatars around the table, typing indicators and live presence (Socket.IO). |
| 🌿 **Member garden** | Every cozy action — chatting, visiting daily, attending events — grows your own little plant through 6 stages. Water a friend's plant to help it bloom. A live "lounge" shows who's seated right now. |
| 🎀 **Events & badges** | A game-night / tea-party calendar (each event links back to Discord). RSVP and host events. Earn collectible sticker badges (First Sip, Night Owl, Green Thumb, Party Host…). |
| ☕ **Tea of the Day + fortunes** | A deterministic daily tea everyone shares, plus a tap-to-draw fortune cookie. |
| 🎵 **Cozy ambience** | Floating player with synthesized rain, fireplace, and wind-chime layers (no audio files needed) + volume, remembered between visits. |
| 💌 **Discord integration** | "Sign in with Discord" (OAuth) and a live widget of who's online in the server, plus a prominent Join button. |

---

## 🚀 Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. That's it — you're in demo mode.

To test the live chat, open the **Tearoom** in **two browser tabs**, join the same table,
and watch messages, seats, typing, and presence sync in real time.

### Production

```bash
npm run build
npm start
```

> ⚠️ This app uses **websockets** (live chat) and writes a small **JSON data file**, so it
> needs a Node host (a long-running server) — it can't be deployed as a purely static export.

---

## 🔐 Enabling real Discord login + live widget

Copy `.env.example` to `.env` and fill in:

1. **Create a Discord application** at <https://discord.com/developers/applications>.
2. Under **OAuth2**, add a redirect URL: `http://localhost:3000/api/auth/callback/discord`.
   Put the client id/secret in `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET`.
3. In your **server settings → Widget**, enable the Server Widget and copy the Server ID
   into `DISCORD_GUILD_ID`. Set `DISCORD_INVITE_URL` to a permanent invite.
4. Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`.

Restart the dev server — the **Sign in with Discord** button and the **live member widget**
light up automatically. (Leave the vars blank to stay in demo mode.)

---

## 🧱 Tech & structure

- **Next.js 14** (App Router, TypeScript) + **Tailwind CSS** for the cozy theme.
- **Custom server** (`server.ts`) wrapping Next with **Socket.IO** for chat + presence.
- **NextAuth** with the Discord provider for OAuth.
- A tiny **JSON-file store** (`src/lib/db.ts`) for garden/events/badges — zero setup, and an
  easy seam to swap for SQLite/Postgres later.

```
server.ts                  # Next + Socket.IO server (chat, presence, activity)
src/app/                   # pages: / (Parlor), /tearoom, /garden, /events, /profile + API routes
src/components/            # DiscordWidget, TeaOfTheDay, AmbiencePlayer, chat/, garden/, events/, ui/
src/lib/                   # db, tea, badges, rooms, auth, identity, socket-client
```

---

## 💡 Ideas to grow next

Bookmarked for later: two-way Discord ↔ website chat bridge (bot), avatar/room customization,
co-op mini-games, daily streaks, a guestbook, and seasonal themes. The code is structured so
each of these slots in cleanly.

Made with 🫖 &amp; 🌿 for our cozy community.
