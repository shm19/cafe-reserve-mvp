# کافه رزرو — Cafe Reserve

Mobile-first PWA for cafe reservation + group coordination (Persian, RTL).
Frontend-first MVP: React + Vite + Tailwind + shadcn/ui + Zustand, backed by a
**json-server** mock API. See `../BUILD-PLAN.md` for the full plan and roadmap.

## Getting started

```bash
npm install
npm run dev:all      # runs Vite (5173) + json-server (4000) together
```

- App: http://localhost:5173
- Mock API: http://localhost:4000 (serves `src/mocks/db.json`)

Log in with any phone number; the OTP code is **123456** (mock).

## Scripts

| script | what it does |
|---|---|
| `npm run dev` | Vite dev server only |
| `npm run mock` | json-server only |
| `npm run dev:all` | both together (use this) |
| `npm run build` | typecheck + production build |
| `npm run typecheck` | `tsc --noEmit` |

## Architecture

```
src/
  mocks/db.json     # seed data = the API contract
  lib/apiClient.ts  # the ONLY place that knows the API URL (swap here for real backend)
  services/         # typed API client per domain — components call these, never fetch directly
  store/            # Zustand (auth, booking draft)
  components/       # shared UI (+ ui/ = shadcn primitives)
  layouts/          # AppLayout = phone frame + bottom nav + auth guard
  pages/            # screens
  router.tsx        # routes: /app (B2C), /owner (B2B-lite), /admin (superadmin)
```

**Rule:** components never call `fetch`/json-server directly — always go through
`services/`. That keeps the eventual backend swap to a one-line change in `apiClient.ts`.

Add more shadcn components with: `npx shadcn@latest add dialog sheet tabs ...`
