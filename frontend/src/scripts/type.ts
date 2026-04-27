import type { eden } from '@/lib/eden'

export type itemResponse = NonNullable<
  Awaited<ReturnType<ReturnType<typeof eden.api.items>['get']>>['data']
>

export type itemsResponse = NonNullable<
  Awaited<ReturnType<typeof eden.api.items.get>>['data']
>
