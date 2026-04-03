import { t } from 'elysia'

export const HealthModel = {
  ok: t.Object({
    ok: t.Boolean(),
    service: t.String(),
  }),
} as const
