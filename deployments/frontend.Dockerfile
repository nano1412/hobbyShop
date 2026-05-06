FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN bun install --frozen-lockfile

COPY frontend ./frontend
WORKDIR /app/frontend
RUN bun run build

FROM nginx:alpine AS runner
COPY deployments/frontend.nginx.conf /etc/nginx/templates/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
CMD sh -c "echo 'PORT='$PORT; ls /etc/nginx/conf.d/; cat /etc/nginx/conf.d/default.conf; nginx -g 'daemon off;'"