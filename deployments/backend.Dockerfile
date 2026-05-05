FROM oven/bun:1 AS build
WORKDIR /app

# Install workspace dependencies with cache-friendly copy
COPY package.json bun.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN bun install --frozen-lockfile

COPY backend ./backend

WORKDIR /app/backend
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN bunx prisma generate
RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --outfile server \
    src/index.ts
RUN chmod +x ./server

FROM gcr.io/distroless/base
WORKDIR /app

COPY --from=build /app/backend/server ./server

ENV NODE_ENV=production
EXPOSE 3000

CMD ["./server"]
