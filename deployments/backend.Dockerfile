FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN bun install --frozen-lockfile

COPY backend ./backend

# IMPORTANT
RUN mkdir -p /app/node_modules/.prisma

WORKDIR /app/backend

RUN bunx prisma generate --schema=prisma/schema.prisma

# DEBUG
RUN ls -R /app/node_modules/.prisma || true
RUN ls -R /app/node_modules/@prisma || true

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]