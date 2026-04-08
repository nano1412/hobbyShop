import { authClient } from '@/lib/auth-client'
import { Button } from '@mantine/core'

export default function Header() {
  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      console.log('Signed out successfully')
    } catch (error) {
      console.error('Sign out failed', error)
    }
  }

  const { data: session } = authClient.useSession()
  return (
    <header className="sticky top-0 z-50 border-b px-4 bg-blue-900 text-white flex justify-between">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4 text-left">
        <h1 className="text-2xl font-bold">Hobby Shop</h1>
      </nav>
      {!!session && (
        <div className="flex items-center text-right">
          <div className="mx-5">{session.user?.name}</div>

          <Button
            onClick={() => {
              handleSignOut()
            }}
          >
            Signout
          </Button>
        </div>
      )}
    </header>
  )
}
