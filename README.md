# TanStack Start + Elysia Monorepo

Full-stack workspace with:

- Frontend: TanStack Start + React + Mantine + Better Auth client
- Backend: Elysia + Better Auth + Prisma + PostgreSQL

## Workspace Layout

- frontend: UI app and routes
- backend: API, auth, database access

Detailed guides:

- frontend docs: [frontend/README.md](frontend/README.md)
- backend docs: [backend/README.md](backend/README.md)
- structure guide: [project-structure.md](project-structure.md)

## Prerequisites

- Node.js 24 (see [.nvmrc](.nvmrc))
- Bun
- PostgreSQL running for backend

## Install

From repo root:

```bash
bun install
```

## Run Development

Use two terminals from repo root.

Terminal 1 (backend):

```bash
bun run dev:backend
```

Terminal 2 (frontend):

```bash
bun run dev:frontend
```

App URLs:

- frontend: http://localhost:3100
- backend: http://localhost:3000
- backend openapi: http://localhost:3000/openapi
- backend health: http://localhost:3000/api/health

## Run Development with Caddy Reverse Proxy

Use this mode when you want a single public entrypoint at `http://localhost:3000`.

Terminal 1 (backend on 3001):

```bash
bun run dev:backend:proxy
```

Terminal 2 (frontend on 3100):

```bash
bun run dev:frontend
```

Terminal 3 (caddy on 3000):

```bash
bun run dev:proxy
```

Routing behavior from `Caddyfile.prod`:

- `/api*`, `/openapi*` -> backend (`localhost:3001`)
- everything else -> frontend (`localhost:3100`)

Note: Better Auth now uses `/api/auth`, so proxying `/api` covers both API and auth paths.

## Auth Flow Routes (Frontend)

- sign up: http://localhost:3100/example/signup
- sign in: http://localhost:3100/example/signin
- authenticated page: http://localhost:3100/example/authenticated

## Root Scripts

```bash
bun run dev:backend   # start backend
bun run dev:backend:proxy   # start backend on port 3001 for caddy mode
bun run dev:frontend  # start frontend
bun run dev:proxy     # start caddy reverse proxy using Caddyfile.prod
bun run build:frontend
bun run test:frontend
bun run lint:frontend
```

## Notes

- Better Auth endpoints are exposed via backend under /api/auth.
- Frontend uses VITE_API_URL (defaults to http://localhost:3000 if not set).
- Generated backend files in backend/generated are git-ignored.
