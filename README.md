# LevelUp

LevelUp is a student-life RPG dashboard. Turn study, coding, fitness, reading, and personal goals into daily quests, earn XP, build streaks, unlock achievement badges, and compare progress on the campus leaderboard.

## Run locally

```sh
npm install
npm run dev
```

## Checks

```sh
npm run lint
npm run build
```

## Supabase sync and history

The app keeps a local copy in `localStorage` and syncs the same progress state to Supabase when credentials are configured. It uses Supabase anonymous sign-in, so each browser gets a private session and can reload its previous quest history without a separate sign-up.

1. Create a Supabase project and enable anonymous sign-ins under **Authentication → Providers → Anonymous**.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor. The table uses row-level security so a session can access only its own progress row.
3. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from **Project Settings → API**.
4. Restart `npm run dev`. The header reports whether progress is saved locally, connecting, or cloud-synced.

Previous completed quests appear under **Progress log** in the app sidebar. Anonymous sessions persist in the same browser; cross-device history needs a permanent sign-in flow to link sessions.
