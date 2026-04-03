import { Elysia } from 'elysia'
import { HealthModel } from './model'
import { HealthService } from './service'

export const healthModule = new Elysia({
  name: 'module.health',
  prefix: '/api/health',
}).get('/', () => HealthService.status(), {
  detail: {
    tags: ['Health'],
    summary: 'Health check',
  },
  response: {
    200: HealthModel.ok,
  },
})
