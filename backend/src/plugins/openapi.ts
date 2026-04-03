import { openapi } from '@elysiajs/openapi'
import { betterAuthOpenAPI } from '@/lib/auth'

const [betterAuthPaths, betterAuthComponents] = await Promise.all([
  betterAuthOpenAPI.getPaths('/api/auth'),
  betterAuthOpenAPI.getComponents(),
])

export const openapiPlugin = openapi({
  documentation: {
    info: {
      title: 'Example API',
      version: '1.0.0',
      description: 'Elysia API with Better Auth',
    },
    components: betterAuthComponents as any,
    paths: betterAuthPaths as any,
    tags: [
      {
        name: 'Health',
        description: 'Service health endpoints',
      },
      {
        name: 'Example',
        description: 'Example endpoints for frontend/backend integration tests',
      },
      {
        name: 'Better Auth',
        description: 'Authentication endpoints',
      },
    ],
  },
})
