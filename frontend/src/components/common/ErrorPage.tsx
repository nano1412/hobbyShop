import { Button, Container, Group, Stack, Text, Title } from '@mantine/core'

type ErrorPageProps = {
  error: unknown
  reset?: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const message =
    error instanceof Error ? error.message : 'Something went wrong.'

  return (
    <Container
      size="sm"
      py="xl"
      className="min-h-screen content-center text-center"
    >
      <Stack align="center" gap="md">
        <Title order={1}>Something went wrong</Title>
        <Text c="dimmed">{message}</Text>
        <Group mt="sm">
          {reset ? (
            <Button variant="default" onClick={() => reset()}>
              Try again
            </Button>
          ) : null}
          <Button component="a" href="/" variant="default">
            Back to home
          </Button>
        </Group>
      </Stack>
    </Container>
  )
}
