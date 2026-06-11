# Publishing Ourchat (Render + your domain)

Ourchat needs an **always-on Node host** (it runs a live Socket.IO server for
chat, presence, and mini-games), so it can't go on static hosts like GitHub
Pages or plain Vercel. These steps use **Render** (free tier).

## 1. Put the code on GitHub `main`
The host deploys from a branch. Easiest is to merge the work into `main` (or
just point Render at the current branch).

## 2. Create the Render web service
1. Sign up at https://render.com (free) and connect your GitHub.
2. **New → Web Service** → pick the `mrnon` repo.
3. Settings (a `render.yaml` is included, so "Blueprint" auto-fills these):
   - **Runtime:** Node
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Plan:** Free
   - **Env var:** `NODE_VERSION = 20`  (do **not** set `NODE_ENV`)
4. Add the environment variables (Render → **Environment**). All optional for a
   demo, but for the real site set:

   | Variable | What it is |
   |---|---|
   | `DATABASE_URL` | Your Neon Postgres connection string (keeps profiles, badges, seeds, accounts across redeploys) |
   | `NEXTAUTH_SECRET` | A random secret — `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | Your live URL, e.g. `https://ourchat.onrender.com` (update to your domain in step 3) |
   | `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | From the Discord developer portal |
   | `DISCORD_GUILD_ID` | Your server's ID (for the live online widget) |
   | `DISCORD_INVITE_URL` | Your invite link, e.g. `https://discord.gg/sDgzXBNjx8` |

   Then in the **Discord developer portal → OAuth2 → Redirects**, add:
   `https://<your-render-or-domain>/api/auth/callback/discord`.
5. Click **Create**. First build takes a few minutes. You'll get a test URL
   like `https://ourchat.onrender.com` — open it to check everything works.

> Free tier note: the service **sleeps after ~15 min idle**, so the first visit
> after a quiet period is slow (a few seconds to wake). Fine for a community
> site; upgrade to a paid instance later to keep it always warm.

## 3. Connect your domain
1. In Render: **your service → Settings → Custom Domains → Add Custom Domain**.
2. Enter your domain (root `ourchat.com` **or** subdomain `play.ourchat.com`).
3. Render shows the DNS record to add. In your registrar's DNS settings:
   - **Subdomain** (e.g. `play.yourdomain.com`) → add a **CNAME** record
     pointing to the `…onrender.com` host Render gives you.
   - **Root/bare domain** (e.g. `yourdomain.com`) → add an **A record** to the
     IP Render shows (and usually a `www` CNAME).
4. Save. DNS can take a few minutes to a couple of hours to propagate. Render
   issues a free **HTTPS certificate** automatically once it sees the record.

Done — the site is live on your domain. 🎉

## 4. Updating later
Just push to the deployed branch — Render **auto-redeploys**, same URL.

## ✅ Data persistence
Member profiles, seeds, badges, likes, accounts, and events persist to a
**Neon Postgres** database when `DATABASE_URL` is set — so the data survives
Render's free-tier redeploys and restarts (the filesystem there is ephemeral).

With **no** `DATABASE_URL` the app falls back to a local `data/store.json` file,
which is fine for local dev but **resets on each redeploy** on free Render — so
set `DATABASE_URL` for the live site.

Live chat messages are intentionally in-memory only (last ~30 per room) and are
not persisted.

### Getting a free Neon database
1. Sign up at https://neon.tech (free) → create a project.
2. Copy the **connection string** (looks like
   `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`).
3. Paste it as `DATABASE_URL` in Render. The app creates its own table on first
   boot — nothing else to set up.
