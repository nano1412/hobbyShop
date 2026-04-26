import { Button, NumberInput } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { eden } from '@/lib/eden'
import type { itemsResponse, itemResponse } from '@/scripts/type'

export const Route = createFileRoute('/testEden')({
  component: RouteComponent,
})

function RouteComponent() {
  const [loading, setLoading] = useState(false)
  const [resultItems, setResultItems] = useState<itemsResponse | null>(null)

  const [id, setId] = useState(0)
  const [resultItem, setResultItem] = useState<itemResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const callItems = async () => {
    setLoading(true)
    setError(null)

    const { data, error: requestError } = await eden.api.items.get()

    if (requestError) {
      setResultItems(null)
      setError('Request failed. Check backend server and CORS settings.')
      setLoading(false)
      return
    }

    setResultItems(data)
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    callItem()
  }

  const callItem = async () => {
    setLoading(true)
    setError(null)

    console.log(id)

    const { data, error: requestError } = await eden.api.items({ id: id }).get()

    if (requestError) {
      setResultItems(null)
      setError('Request failed. Check backend server and CORS settings.')
      setLoading(false)
      return
    }

    setResultItem(data)
    setLoading(false)
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Test calling Item/Items</h1>
      <p className="mt-2 text-sm text-gray-500">
        Test type-safe request from TanStack Start frontend to Elysia get item /
        items endpoint
      </p>
      <div className="mt-6">
        <Button onClick={callItems} loading={loading}>
          Call GET /api/items
        </Button>
      </div>
      <form onSubmit={handleSubmit}>
        <NumberInput
          value={id}
          onChange={(value) => setId(Number(value) || 0)}
        />
        <Button type="submit">call Get /api/items/:id</Button>
      </form>
      15477
      {resultItems ? (
        <section className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold">Response</h2>
          <pre className="mt-2 overflow-x-auto text-xs">
            {JSON.stringify(resultItems, null, 2)}
          </pre>
        </section>
      ) : null}
      {resultItem ? (
        <section className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold">Response</h2>
          <pre className="mt-2 overflow-x-auto text-xs">
            {JSON.stringify(resultItem, null, 2)}
          </pre>
        </section>
      ) : null}
    </main>
  )
}
