FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN bun install --frozen-lockfile

COPY frontend ./frontend

WORKDIR /app/frontend

ENV NODE_ENV=production
ENV CI=true
ENV TANSTACK_START_PRERENDER=false

RUN bun run build


FROM nginx:alpine AS runner

COPY deployments/frontend.nginx.conf.template \
     /etc/nginx/templates/default.conf.template

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/frontend/dist/client/ /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]