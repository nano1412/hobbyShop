import {
  createRouter as createTanStackRouter,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import { getContext } from './integrations/tanstack-query/root-provider'
import { useEffect } from 'react'
import NotFoundPage from './components/common/NotFoundPage'
import ErrorPage from './components/common/ErrorPage'

function NotFoundRedirect() {
  const navigate = useNavigate()
  const location = useRouterState({
    select: (state) => state.location,
  })

  useEffect(() => {
    if (location.pathname === '/not-found') {
      return
    }

    navigate({
      to: '/not-found',
      search: {
        from: `${location.pathname}${location.searchStr}`,
      },
      replace: true,
    })
  }, [location.pathname, location.searchStr, navigate])

  return <NotFoundPage />
}

export function getRouter() {
  const rqContext = getContext()

  const router = createTanStackRouter({
    routeTree,

    context: rqContext,

    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ErrorPage,
    defaultNotFoundComponent: NotFoundRedirect,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

export const router = getRouter()

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
