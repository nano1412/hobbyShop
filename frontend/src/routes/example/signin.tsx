import {
  Alert,
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/example/signin')({
  component: SignInPage,
})

function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const result = await authClient.signIn.email({
      email,
      password,
    })

    setLoading(false)

    if (result.error) {
      setError(result.error.message ?? 'Sign in failed.')
      return
    }

    navigate({ to: '/' })
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <Paper withBorder p="lg" radius="md">
        <Stack>
          <div>
            <Title order={2}>Sign in</Title>
            <Text c="dimmed" size="sm" mt={4}>
              Log in with Better Auth credentials.
            </Text>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            <TextInput
              label="Email"
              placeholder="jane@example.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              required
            />

            {error ? (
              <Alert color="red" title="Sign in failed">
                {error}
              </Alert>
            ) : null}

            <Button type="submit" loading={loading}>
              Sign in
            </Button>
          </form>

          <Group gap="xs">
            <Text c="dimmed" size="sm">
              Need a new account?
            </Text>
            <Button
              component={Link}
              to="/example/signup"
              variant="subtle"
              size="compact-sm"
            >
              Sign up
            </Button>
          </Group>
        </Stack>
      </Paper>
    </main>
  )
}
