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
4. Click **Create**. First build takes a few minutes. You'll get a test URL
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

## ⚠️ Data persistence (do before a serious launch)
Member profiles, seeds, badges, likes, and chat are saved in `data/store.json`.
On Render's free tier the filesystem is **ephemeral** — it resets on every
redeploy/restart, so that data would be lost. To make it permanent, either:
- attach a **Render Persistent Disk** mounted at `/opt/render/project/src/data`
  (requires a paid instance), or
- move the store to a small database (the code in `src/lib/db.ts` is structured
  for an easy swap).

Ask and this can be wired up.
