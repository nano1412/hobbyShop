import {
  Alert,
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/example/authenticated')({
  component: AuthenticatedPage,
})

function AuthenticatedPage() {
  const { data: session, isPending, error, refetch } = authClient.useSession()
  const [signOutLoading, setSignOutLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const onSignOut = async () => {
    setActionError(null)
    setSignOutLoading(true)

    const result = await authClient.signOut()

    setSignOutLoading(false)

    if (result.error) {
      setActionError(result.error.message ?? 'Sign out failed.')
      return
    }

    await refetch()
  }

  const isAuthenticated = Boolean(session?.user && session.session)

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Paper withBorder p="lg" radius="md">
        <Stack>
          <div>
            <Title order={2}>Authenticated page</Title>
            <Text c="dimmed" size="sm" mt={4}>
              Check session and test sign out.
            </Text>
          </div>

          {error ? (
            <Alert color="red" title="Session request failed">
              {error.message}
            </Alert>
          ) : null}

          {actionError ? (
            <Alert color="red" title="Action failed">
              {actionError}
            </Alert>
          ) : null}

          {isPending ? (
            <Group>
              <Loader size="sm" />
              <Text size="sm">Loading session...</Text>
            </Group>
          ) : null}

          {!isPending && !isAuthenticated ? (
            <Alert color="yellow" title="Not authenticated">
              No active user session.
            </Alert>
          ) : null}

          {!isPending && isAuthenticated ? (
            <>
              <Alert color="green" title="Authenticated">
                Logged in as {session?.user.email}
              </Alert>
              <section className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <Text size="sm" fw={600}>
                  Session payload
                </Text>
                <pre className="mt-2 overflow-x-auto text-xs">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </section>
            </>
          ) : null}

          <Group gap="xs">
            <Button
              component={Link}
              to="/example/signin"
              variant="subtle"
              size="compact-sm"
            >
              Go to sign in
            </Button>
            <Button
              component={Link}
              to="/example/signup"
              variant="subtle"
              size="compact-sm"
            >
              Go to sign up
            </Button>
            <Button
              variant="default"
              size="compact-sm"
              onClick={() => void refetch()}
            >
              Refresh session
            </Button>
            <Button color="red" loading={signOutLoading} onClick={onSignOut}>
              Sign out
            </Button>
          </Group>
        </Stack>
      </Paper>
    </main>
  )
}
