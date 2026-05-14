FROM node:22-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN npm install -g bun
RUN bun install --frozen-lockfile

COPY frontend ./frontend

WORKDIR /app/frontend

ENV NODE_ENV=production
ENV CI=true

RUN bun run build
RUN cp dist/client/_shell.html dist/client/index.html

FROM nginx:alpine AS runner

COPY deployments/frontend.nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/frontend/dist/client/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]