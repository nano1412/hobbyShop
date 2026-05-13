FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN bun install --frozen-lockfile

COPY backend ./backend

WORKDIR /app/backend

# generate prisma client
RUN bunx prisma generate --schema=prisma/schema.prisma

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]