import { authClient } from '@/lib/auth-client'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const checkIsHaveSession = async () => {
  const { data: session } = await authClient.getSession()

  if (session) {
    throw redirect({
      to: '/',
    })
  }
}

export const Route = createFileRoute('/(auth)')({
  beforeLoad: () => checkIsHaveSession(),
  loader: () => checkIsHaveSession(),
  component: AuthComponent,
})

function AuthComponent() {
  return <Outlet />
}
