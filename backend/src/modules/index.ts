import { Elysia } from 'elysia'
import { authModule } from './auth'
import { healthModule } from './health'
import { itemModule } from './item'

export const modules = new Elysia({ name: 'app.modules' })
  .use(authModule)
  .use(healthModule)
  .use(itemModule)
