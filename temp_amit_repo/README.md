# GamesDealsHub

Track free PC games from Steam, Epic Games Store, and GOG before giveaways expire.

**Live site:** https://www.gamesdealshub.me

## Deploy on Vercel (gamesdealshub.me)

This app is built for **Vercel** with server-side HTML for SEO (`api/render`) and API routes (`api/index`).

### 1. Connect the repo

1. Push this project to GitHub (repo root must contain `package.json`, `vercel.json`, `api/`, `src/`).
2. [Vercel Dashboard](https://vercel.com) → **Add New Project** → import your repo.
3. If the app lives in a subfolder, set **Root Directory** to that folder (e.g. `apps/gamesdealshub`).

### 2. Project settings

| Setting | Value |
|--------|--------|
| Framework Preset | **Other** (not “Vite” only — `vercel.json` controls the build) |
| Build Command | `npm run build` (or leave empty to use `vercel.json`) |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js Version | **20.x** or **22.x** |

### 3. Domains

In **Project → Settings → Domains**:

- `www.gamesdealshub.me` → **Production**
- `gamesdealshub.me` → redirect to `www` (or add both; the server redirects non-www to www)

DNS at your registrar (for `.me`):

- `A` record `@` → `76.76.21.21` (Vercel)
- `CNAME` `www` → `cname.vercel-dns.com`

### 4. Environment variables (optional)

Add in **Project → Settings → Environment Variables**:

| Variable | Purpose |
|----------|---------|
| `SMTP_USER` / `SMTP_PASS` | Email deal alerts |
| `RAWG_API_KEY` | Game metadata |
| `TWITCH_CLIENT_ID` / `TWITCH_CLIENT_SECRET` | IGDB enrichment |
| `GEMINI_API_KEY` | AI Studio features |

### 5. Deploy

Push to `main` (or click **Redeploy**). Build log should end with:

```
========== BUILD SUCCESS ==========
```

### 6. Verify SSR (after deploy)

```bash
curl -A "Googlebot" https://www.gamesdealshub.me/ | findstr "h2 Claim free"
```

You should see game titles in the HTML, not only `<div id="root"></div>`.

Also check:

- https://www.gamesdealshub.me/robots.txt
- https://www.gamesdealshub.me/sitemap.xml
- https://www.gamesdealshub.me/about → canonical should be `.../about`

### 7. Google Search Console

1. Add property `https://www.gamesdealshub.me`
2. Submit sitemap: `https://www.gamesdealshub.me/sitemap.xml`
3. URL Inspection → request indexing for `/`

---

## Run locally

```bash
npm install
cp .env.example .env.local   # optional API keys
npm run dev
```

Open http://localhost:3000

## Build (same as Vercel)

```bash
npm run build
```

Produces `dist/ssr-template.html` (no `dist/index.html`), `dist/ssr-render.cjs`, `dist/server.cjs`, and static assets.
