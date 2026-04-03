import { Elysia } from 'elysia'
import logixlysia from 'logixlysia'
import { env } from './config/env'
import { modules } from './modules'
import { corsPlugin } from './plugins/cors'
import { openapiPlugin } from './plugins/openapi'

export const app = new Elysia({ name: 'app' })
  .use(
    logixlysia({
      config: {
        showStartupMessage: env.NODE_ENV !== 'production',

        // Filter to important logs only
        // logFilter: {
        //   level: ["ERROR", "WARNING"],
        // },

        // Pino configuration
        pino: {
          level: 'info',
          redact: ['password', 'token', 'apiKey', 'creditCard'],
          base: {
            service: 'my-api',
            version: env.APP_VERSION,
            environment: env.NODE_ENV,
          },
        },
      },
    }),
  )
  .use(openapiPlugin)
  .use(corsPlugin)
  .use(modules)
  .get(
    '/',
    () => ({
      message: 'Hello Elysia',
      docs: '/openapi',
      auth: '/api/auth',
    }),
    {
      detail: {
        tags: ['Health'],
        summary: 'Root endpoint',
      },
    },
  )

export type App = typeof app
