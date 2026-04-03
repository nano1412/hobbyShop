import { treaty } from '@elysiajs/eden'
import type { App } from '../../../backend/src/app'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const eden = treaty<App>(API_BASE_URL, {
  fetch: {
    credentials: 'include',
  },
})
