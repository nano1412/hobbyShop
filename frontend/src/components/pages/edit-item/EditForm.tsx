import Header from '@/components/common/Header'
import type { eden } from '@/lib/eden'
import type { itemResponse } from '@/scripts/type'
import { useParams } from '@tanstack/react-router'
import { useState } from 'react'

export default function EditFormUI() {
  const { id } = useParams({ from: '/view-item/$id' })
  const [loading, setLoading] = useState(false)
  const [resultItem, setResultItem] = useState<itemResponse | null>({
    id: 0,
    categoryId: 0,
    name: '',
    description: '',
    thumbnailPath: '',
    thumbnailId: '',
    brand: '',
    stockQty: 0,
    storePriceThb: 0,
    msrpPrice: 0,
    msrpCurrency: '',
    releaseYear: 0,
    createdAt: '',
    createdBy: '',
    updatedAt: '',
    updatedBy: '',
  })
  const [error, setError] = useState<string | null>(null)
  return (
    <>
      <Header />
      <div></div>
    </>
  )
}
