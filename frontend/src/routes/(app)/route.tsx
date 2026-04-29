import Header from '@/components/common/Header'
import { authClient } from '@/lib/auth-client'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)')({
  beforeLoad: () => checkValidSession(),
  loader: () => checkValidSession(),
  component: RouteComponent,
})

const checkValidSession = async () => {
  const { data: session } = await authClient.getSession() // adjust if needed

  if (!session) {
    throw redirect({
      to: '/signin',
    })
  }
}

function RouteComponent() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
