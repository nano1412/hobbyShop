// src/lib/db.ts
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { env } from '@/config/env'

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
})

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient
}

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  })

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
