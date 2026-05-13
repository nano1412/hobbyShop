FROM oven/bun:1

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN bun install --frozen-lockfile

WORKDIR /app/backend

# Generate Prisma client INSIDE backend package
RUN bunx prisma generate --schema=prisma/schema.prisma

WORKDIR /app/backend

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]