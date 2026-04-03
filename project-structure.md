# Project Structure Guide

This document defines the monorepo structure for this project and where each part of the Elysia + TanStack Start stack should live.

## Architecture Goals

- Use Bun workspaces to run frontend and backend in one repository.
- Keep Better Auth running on the Elysia backend as the source of truth.
- Use Eden Treaty for end-to-end type safety between frontend and backend routes.
- Keep frontend route handlers focused on UI concerns while backend owns API and auth.

## Workspace Layout

```text
tanstackstart-elysia-ssr/
├── package.json                 # Root Bun workspace config
├── .nvmrc                       # Node version for tool compatibility
├── project-structure.md         # This guide
├── backend/
│   ├── package.json
│   ├── prisma.config.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── generated/
│   │   ├── prisma/
│   │   └── prismabox/
│   └── src/
│       ├── index.ts             # Elysia app entrypoint
│       └── lib/
│           ├── auth.ts          # Better Auth server instance
│           └── db.ts            # Prisma client / database wiring
└── frontend/
    ├── package.json
    ├── project-structure.md     # Frontend-only convention guide (legacy)
    └── src/
        ├── router.tsx
        ├── routeTree.gen.ts
        ├── theme.ts
        ├── routes/
        │   ├── __root.tsx
        │   ├── index.tsx
        │   ├── not-found.tsx
        ├── lib/
        │   ├── auth-client.ts   # Better Auth client for React
        │   ├── auth.ts          # TanStack Start Better Auth helper (if used)
        │   └── axios.ts
        ├── components/
        │   ├── ui/
        │   ├── form/
        │   ├── common/
        │   └── layouts/
        ├── hooks/
        ├── constants/
        ├── integrations/
        ├── middleware/
        ├── styles/
        ├── assets/
        └── types/
```

## Backend Conventions (Elysia + Better Auth)

- Keep Better Auth server config in `backend/src/lib/auth.ts`.
- Mount Better Auth handler from Elysia in `backend/src/index.ts`.
- Prefer explicit auth mount path for clarity:
  - Mount style: `app.mount('/api', auth.handler)`
  - Better Auth `basePath`: `/auth`
  - Resulting endpoint base: `/api/auth`.
- Keep CORS in backend and enable credentials when frontend consumes auth cookies.

## Frontend Conventions (TanStack Start)

- Use `frontend/src/lib/auth-client.ts` for browser auth client (`createAuthClient`).
- Keep app pages in `frontend/src/routes`.
- Keep reusable UI base inputs in `frontend/src/components/ui`.
- Keep react-hook-form wrappers in `frontend/src/components/form`.
- Keep feature-specific page components in dedicated folders under `frontend/src/components/pages/<page-name>`.

## Type-Safe API Strategy (Eden Treaty)

- Export `type App = typeof app` from `backend/src/index.ts`.
- Create a shared API type package only when backend type imports become heavy.
- Frontend API client should consume backend app type for route-safe calls.
- Keep transport details (base URL, headers, cookies) in one frontend API client module.

## Suggested Next Folder Additions

```text
backend/src/
├── modules/
│   ├── auth/
│   │   ├── auth.plugin.ts
│   │   └── auth.routes.ts
│   └── health/
│       └── health.routes.ts
└── types/
    └── app.ts

frontend/src/lib/
├── eden.ts                      # Eden Treaty client setup
└── api/
    ├── auth.api.ts
    └── user.api.ts
```

## Team Rules

- Backend owns authentication logic and session validation.
- Frontend must not duplicate auth business logic.
- Keep generated files (`backend/generated`) read-only.
- Keep Prisma schema changes in `backend/prisma/schema.prisma` only.
- Prefer feature folders for domain growth instead of flat file sprawl.

## Bun Workspace Commands

Run at repository root:

```bash
bun install
bun run dev:backend
bun run dev:frontend
```

Optional helper:

```bash
bun run dev
```

Note: the root `dev` script prints guidance to run backend and frontend in separate terminals.
