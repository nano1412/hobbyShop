FROM oven/bun:1

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN bun install --frozen-lockfile

# Copy backend
COPY backend ./backend

WORKDIR /app/backend

# Generate Prisma client
RUN bunx prisma generate

ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]