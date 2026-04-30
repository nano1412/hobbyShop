import Header from '@/components/common/Header'
import { authClient } from '@/lib/auth-client'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const checkIsHaveNoSession = async () => {
  const { data: session } = await authClient.getSession()

  if (!session) {
    throw redirect({
      to: '/sign-in',
    })
  }
}

export const Route = createFileRoute('/(app)')({
  beforeLoad: () => checkIsHaveNoSession(),
  loader: () => checkIsHaveNoSession(),
  component: AppicationComponent,
})

function AppicationComponent() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
