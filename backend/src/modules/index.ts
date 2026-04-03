import { Elysia } from 'elysia'
import { authModule } from './auth'
import { healthModule } from './health'

export const modules = new Elysia({ name: 'app.modules' })
  .use(authModule)
  .use(healthModule)
