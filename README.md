# SmartRecruit

Recruitment / application tracker with a React frontend (`Application-Tracker`) and NestJS backend (`backend`).

## Demo mode (no database)

The frontend can run fully offline from the API with seeded demo data. Enable it with:

```env
VITE_DEMO_MODE=true
```

### Demo logins

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@smartrecruit.demo` | `demo123` |
| HR Admin | `hr@smartrecruit.demo` | `demo123` |

Demo data includes 12 jobs, 20 applications across pipeline statuses, and 2 users. Changes persist in `localStorage` until you click **Reset demo data** in the amber banner.

### Local demo

```bash
cd Application-Tracker
npm install
npm run dev:demo
```

### Deploy to Render (static site)

1. Push this repo to GitHub.
2. In Render, create a **Static Site** (or use Blueprint with `render.yaml`).
3. Settings:
   - **Root Directory:** `Application-Tracker`
   - **Build Command:** `npm install && npm run build:demo`
   - **Publish Directory:** `dist`
   - **Environment:** `VITE_DEMO_MODE=true` (also baked in via `.env.demo` + `build:demo`)
4. Add a rewrite so SPA routes work: `/*` → `/index.html`

`render.yaml` at the repo root already encodes this.

### Deploy to Vercel

Set `VITE_DEMO_MODE=true` in the Vercel project environment variables (Production), with root directory `Application-Tracker`, then redeploy.

## Full stack (with database)

When not in demo mode, point the frontend at the NestJS API:

```env
VITE_DEMO_MODE=false
VITE_API_URL=https://your-backend.example.com
```

The backend expects Postgres (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`).
