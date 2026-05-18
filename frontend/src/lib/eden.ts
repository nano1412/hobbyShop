import { treaty } from '@elysiajs/eden'
import type { App } from '../../../backend/src/app'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  'https://backend-production-a23a.up.railway.app'

export const eden = treaty<App>(API_BASE_URL, {
  fetch: {
    credentials: 'include',
  },
})
