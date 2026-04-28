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

export const Route = createFileRoute('/example/signup')({
  component: SignUpPage,
})

function SignUpPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const result = await authClient.signUp.email({
      name,
      email,
      password,
    })
    setLoading(false)

    if (result.error) {
      setError(result.error.message ?? 'Sign up failed.')
      return
    }

    navigate({ to: '/' })
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <Paper withBorder p="lg" radius="md">
        <Stack>
          <div>
            <Title order={2}>Sign up</Title>
            <Text c="dimmed" size="sm" mt={4}>
              Create a user via Better Auth.
            </Text>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            <TextInput
              label="Name"
              placeholder="Jane Doe"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
              required
            />
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
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              required
            />
            <PasswordInput
              label="Confirm password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.currentTarget.value)
              }
              required
            />

            {error ? (
              <Alert color="red" title="Sign up failed">
                {error}
              </Alert>
            ) : null}

            <Button type="submit" loading={loading}>
              Create account
            </Button>
          </form>

          <Group gap="xs">
            <Text c="dimmed" size="sm">
              Already have an account?
            </Text>
            <Button
              component={Link}
              to="/example/signin"
              variant="subtle"
              size="compact-sm"
            >
              Sign in
            </Button>
          </Group>
        </Stack>
      </Paper>
    </main>
  )
}
