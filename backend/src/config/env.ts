const frontendOrigins = (
  process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000,http://localhost:3100'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0)

const port = Number(process.env.PORT ?? 3000)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Invalid PORT: expected an integer between 1 and 65535')
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('Missing required env var: DATABASE_URL')
}

const nodeEnv = process.env.NODE_ENV ?? 'development'

if (!['development', 'test', 'production'].includes(nodeEnv)) {
  throw new Error(
    'Invalid NODE_ENV: expected one of development | test | production',
  )
}

export const env = {
  PORT: port,
  FRONTEND_ORIGINS: frontendOrigins,
  DATABASE_URL: databaseUrl,
  NODE_ENV: nodeEnv as 'development' | 'test' | 'production',
  APP_VERSION: process.env.APP_VERSION ?? '0.0.1',
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
} as const
