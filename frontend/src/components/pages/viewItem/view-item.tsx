import Header from '@/components/common/Header'
import { eden } from '@/lib/eden'
import { useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

type itemResponse = NonNullable<
  Awaited<ReturnType<ReturnType<typeof eden.api.items>['get']>>['data']
>

export default function ViewItem() {
  const { id } = useParams({ from: '/view-item/$id' })
  const [loading, setLoading] = useState(false)
  const [resultItem, setResultItem] = useState<itemResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const callItem = async () => {
    setLoading(true)
    setError(null)

    const { data, error: requestError } = await eden.api.items({ id: id }).get()

    if (requestError) {
      setResultItem(null)
      setError('Request failed. Check backend server and CORS settings.')
      setLoading(false)
      return
    }

    setResultItem(data)
    setLoading(false)
  }

  useEffect(() => {
    callItem()
  }, [])

  return (
    <>
      <Header />
      <div>from view item with id {id}</div>
      <div>
        raw data are:
        {resultItem ? (
          <section className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold">Response</h2>
            <pre className="mt-2 overflow-x-auto text-xs">
              {JSON.stringify(resultItem, null, 2)}
            </pre>
          </section>
        ) : null}
      </div>
    </>
  )
}
