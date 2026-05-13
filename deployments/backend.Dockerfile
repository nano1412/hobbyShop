FROM gcr.io/distroless/base
WORKDIR /app

COPY --from=build /app/backend/server ./server

COPY --from=build /app/backend/generated ./generated
COPY --from=build /app/backend/prisma ./prisma
COPY --from=build /app/backend/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["./server"]