# Deployments

This folder contains Docker deployment files for both services in this monorepo.

## Why `deployments` (plural)

Use `deployments` because this folder stores multiple deployment targets and files.

## Files

- `backend.Dockerfile`: Docker image for Elysia backend
- `frontend.Dockerfile`: Docker image for TanStack Start frontend
- `docker-compose.yml`: Runs backend + frontend together

## Prerequisites

- Docker installed
- `backend/.env` exists (copy from `backend/env.example`)

## Run with Docker Compose

From this folder:

```bash
docker compose up --build
```

## Frontend Build Args From .env

Docker Compose supports variable substitution from a `.env` file in this `deployments` folder.

Example `deployments/.env`:

```bash
VITE_API_URL=http://localhost:3000
```

The compose file uses a safe fallback if `VITE_API_URL` is not set.

Apps:

- Frontend: http://localhost:80
- Backend: http://localhost:3000

## Notes

- Backend image runs Bun directly for compatibility with Prisma runtime.
- Frontend image builds once and serves static files via Nginx with SPA fallback.
- If you want a DB container too, extend compose with PostgreSQL service.
