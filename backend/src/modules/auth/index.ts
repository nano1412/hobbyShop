import { Elysia } from 'elysia'
import { auth } from '../../lib/auth'

export const authModule = new Elysia({
  name: 'module.auth',
}).mount('/api', auth.handler)
