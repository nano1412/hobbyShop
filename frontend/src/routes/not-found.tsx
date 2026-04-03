import { createFileRoute } from '@tanstack/react-router'
import NotFoundPage from '../components/common/NotFoundPage'

export const Route = createFileRoute('/not-found')({
  validateSearch: (search: Record<string, unknown>) => ({
    from: typeof search.from === 'string' ? search.from : undefined,
  }),
  component: NotFoundRoute,
})

function NotFoundRoute() {
  const { from } = Route.useSearch()

  return <NotFoundPage from={from} />
}
