# Frontend (TanStack Start + Mantine + Better Auth Client)

Frontend app for this monorepo, built with TanStack Start in SPA mode and connected to the Elysia backend.

## Prerequisites

- Node.js `24` (see `.nvmrc`)
- Bun
- Backend running (default `http://localhost:3000`)

## Environment

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

If omitted, frontend defaults to `http://localhost:3000`.

## Quick Start

```bash
bun install
bun run dev
```

App runs at `http://localhost:3100`.

## Scripts

```bash
bun run dev      # Start dev server on port 3100
bun run build    # Production build
bun run serve    # Preview build
bun run test     # Run Vitest
bun run lint     # Run ESLint
bun run format   # Check Prettier formatting
bun run check    # Write Prettier + fix ESLint
```

## Tech Stack

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router) (file-based routing)
- [TanStack Query](https://tanstack.com/query)
- [Mantine](https://mantine.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [Better Auth Client](https://www.better-auth.com)

## SPA Mode Notes

- SPA mode is enabled via `tanstackStart({ spa: { enabled: true } })` in `vite.config.ts`.
- Build output includes a prerendered shell file (`/_shell.html`) used for client-side route rewrites.
- On CDN/static hosting, configure a catch-all rewrite to `/_shell.html` after static assets.

## Better Auth Integration

Frontend uses Better Auth React client in `src/lib/auth-client.ts`:

- Base URL from `VITE_API_URL`
- Base path `/api/auth`
- Credentials included for cookie session

Auth test routes:

- `/example/signup` create account
- `/example/signin` sign in
- `/example/authenticated` view current session and sign out

## Useful Demo Routes

- `/` home component demo
- `/example/backend` test backend request
- `/example/form` RHF + Zod form example

## Project Notes

- Routes: `src/routes`
- Base UI components: `src/components/ui`
- Form wrappers: `src/components/form`
- Shared validators: `src/lib/zod.ts`
