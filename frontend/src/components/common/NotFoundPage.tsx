import { Button, Container, Stack, Text, Title } from '@mantine/core'

type NotFoundPageProps = {
  from?: string
}

export default function NotFoundPage({ from }: NotFoundPageProps) {
  return (
    <Container
      size="sm"
      py="xl"
      className="min-h-screen content-center text-center"
    >
      <Stack align="center" gap="md">
        <Title order={1}>Page not found</Title>
        <Text c="dimmed">The page you are looking for does not exist.</Text>
        <Button component="a" href="/" variant="default" mt="sm">
          Back to home
        </Button>
      </Stack>
    </Container>
  )
}
