# Backend Structure Guide (Elysia Best Practice)

This backend follows Elysia's feature-based best-practice approach:

- 1 Elysia instance = 1 controller/module
- Keep business logic in service files
- Keep validation models with each feature
- Compose modules and plugins in one app entry

## Folder Structure

```text
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── index.ts                 # Runtime bootstrap (listen)
│   ├── app.ts                   # App composition root
│   ├── config/
│   │   └── env.ts               # Runtime env defaults
│   ├── plugins/
│   │   ├── cors.ts              # CORS plugin config
│   │   └── openapi.ts           # OpenAPI/Swagger plugin config
│   ├── modules/
│   │   ├── index.ts             # Register all modules
│   │   ├── auth/
│   │   │   └── index.ts         # Better Auth mount controller
│   │   └── health/
│   │       ├── index.ts         # Health routes controller
│   │       ├── service.ts       # Health business logic
│   │       └── model.ts         # Health response schema
│   └── lib/
│       ├── auth.ts              # Better Auth instance
│       └── db.ts                # Prisma client
└── project-structure.md
```

## Endpoint Map

- `GET /` basic service info
- `GET /api/health` health check
- `Better Auth` mounted at `/api`
- Better Auth API basePath set to `/auth`
- Effective Better Auth endpoint base: `/api/auth`

## OpenAPI (Swagger)

- OpenAPI plugin is enabled in `src/plugins/openapi.ts`
- Default OpenAPI JSON endpoint is `/openapi`
- Use this endpoint with Swagger UI tools if you want a separate docs UI container

## Better Auth Notes

- Better Auth instance lives in `src/lib/auth.ts`
- It uses Prisma adapter from `src/lib/db.ts`
- Keep auth business/plugin config in `lib/auth.ts`
- Keep HTTP mount/config in `modules/auth/index.ts`

## Team Rules

- New feature = new folder in `src/modules/<feature>`
- Put request/response schemas in `model.ts`
- Put business logic in `service.ts`
- Put route/controller wiring in `index.ts`
- Avoid passing full Elysia context into business services
