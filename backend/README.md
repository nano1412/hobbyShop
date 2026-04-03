# Backend (Elysia + Better Auth + Prisma)

This backend provides:

- Elysia API server
- Better Auth mounted under `/auth`
- Prisma + PostgreSQL for persistence
- OpenAPI docs including Better Auth routes

## Stack

- Bun runtime for development server
- Elysia 1.x
- Better Auth 1.x
- Prisma 7 + PostgreSQL

## Prerequisites

- Node.js `24` (see `.nvmrc`)
- Bun
- PostgreSQL running and reachable from `DATABASE_URL`

## Environment

Copy `.env.example` to `.env` and adjust values:

```bash
cp .env.example .env
```

Then verify values in `.env`:

```env
PORT=3000
FRONTEND_ORIGIN=http://localhost:3000,http://localhost:3100
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgresql://postgres@localhost:5433/betterauth?schema=public
```

Notes:

- `FRONTEND_ORIGIN` supports comma-separated origins.
- Better Auth validates request origin using trusted origins from this env.

## Install Dependencies

```bash
bun install
```

## Database Setup

Run migrations and generate Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

## Run Development Server

```bash
bun run dev
```

Server starts on `http://localhost:3000` by default.

## API Endpoints

- `GET /` basic server info
- `GET /api/health` health check
- `GET /openapi` OpenAPI JSON
- `POST /api/auth/sign-up/email` Better Auth email sign-up
- `POST /api/auth/sign-in/email` Better Auth email sign-in
- `GET /api/auth/get-session` get current session
- `POST /api/auth/sign-out` sign out

## Frontend Integration

Frontend should call backend base URL (for example `http://localhost:3000`) and use credentials (cookies) when calling auth endpoints.
