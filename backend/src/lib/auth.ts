// src/lib/auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI, username } from 'better-auth/plugins'
import prisma from '@/lib/db'
import { env } from '@/config/env'

export const auth = betterAuth({
  basePath: '/auth',
  trustedOrigins: env.FRONTEND_ORIGINS,
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [openAPI(), username()],
})

let schemaCache: Awaited<ReturnType<typeof auth.api.generateOpenAPISchema>>

const getSchema = async () => {
  schemaCache ??= await auth.api.generateOpenAPISchema()
  return schemaCache
}

export const betterAuthOpenAPI = {
  getPaths: async (prefix = '/api/auth') => {
    const { paths } = await getSchema()
    const reference: Record<string, unknown> = Object.create(null)

    for (const path of Object.keys(paths)) {
      const key = `${prefix}${path}`
      const pathItem = paths[path] as Record<string, unknown>
      const clonedPathItem: Record<string, unknown> = { ...pathItem }

      for (const method of Object.keys(pathItem)) {
        const operation = pathItem[method]

        if (operation && typeof operation === 'object') {
          clonedPathItem[method] = {
            ...(operation as Record<string, unknown>),
            tags: ['Better Auth'],
          }
        }
      }

      reference[key] = clonedPathItem
    }

    return reference
  },
  getComponents: async () => {
    const { components } = await getSchema()
    return components as Record<string, unknown>
  },
} as const
