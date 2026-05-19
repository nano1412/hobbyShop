FROM node:22-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN npm install -g bun
RUN bun install --frozen-lockfile

COPY frontend ./frontend

WORKDIR /app/frontend

RUN echo $RANDOM

ARG VITE_API_URL
ARG VITE_IMAGEKIT_PUBLIC_KEY
ARG VITE_IMAGEKIT_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IMAGEKIT_PUBLIC_KEY=$VITE_IMAGEKIT_PUBLIC_KEY
ENV VITE_IMAGEKIT_URL=$VITE_IMAGEKIT_URL

RUN bun run build

RUN cp dist/client/_shell.html dist/client/index.html

FROM nginx:alpine

COPY deployments/frontend.nginx.conf.template /etc/nginx/templates/default.conf.template

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/frontend/dist/client/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]