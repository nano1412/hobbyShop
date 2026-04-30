import Header from '@/components/common/Header'
import { authClient } from '@/lib/auth-client'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const checkValidSession = async () => {
  const { data: session } = await authClient.getSession()

  if (!session) {
    throw redirect({
      to: '/signin',
    })
  }
}

export const Route = createFileRoute('/(app)')({
  beforeLoad: () => checkValidSession(),
  loader: () => checkValidSession(),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
