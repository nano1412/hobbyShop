import { cors } from '@elysiajs/cors'
import { env } from '../config/env'

export const corsPlugin = cors({
  origin: env.FRONTEND_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
})
