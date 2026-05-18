FROM node:22-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN npm install -g bun
RUN bun install --frozen-lockfile

COPY frontend ./frontend

WORKDIR /app/frontend

RUN bun run build
RUN cp dist/client/_shell.html dist/client/index.html

RUN echo "=== DIST FILES ==="
RUN find dist -type f | sort

FROM nginx:alpine

COPY frontend.nginx.conf.template /etc/nginx/templates/default.conf.template

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/frontend/dist/client/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]