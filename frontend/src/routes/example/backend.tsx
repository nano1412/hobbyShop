import { Button } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { eden } from '@/lib/eden'

type HealthResponse = NonNullable<
  Awaited<ReturnType<typeof eden.api.health.get>>['data']
>

export const Route = createFileRoute('/example/backend')({
  component: ExampleBackendPage,
})

function ExampleBackendPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const callBackend = async () => {
    setLoading(true)
    setError(null)

    const { data, error: requestError } = await eden.api.health.get()

    if (requestError) {
      setResult(null)
      setError('Request failed. Check backend server and CORS settings.')
      setLoading(false)
      return
    }

    setResult(data)
    setLoading(false)
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Example Backend (Eden Treaty)</h1>
      <p className="mt-2 text-sm text-gray-500">
        Test type-safe request from TanStack Start frontend to Elysia health
        endpoint.
      </p>

      <div className="mt-6">
        <Button onClick={callBackend} loading={loading}>
          Call GET /api/health
        </Button>
      </div>

      {error ? (
        <section className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </section>
      ) : null}

      {result ? (
        <section className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold">Response</h2>
          <pre className="mt-2 overflow-x-auto text-xs">
            {JSON.stringify(result, null, 2)}
          </pre>
        </section>
      ) : null}
    </main>
  )
}
