import AddFormUI from '@/components/pages/add-item/AddForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/add-item')({
  component: AddItemPage,
})

function AddItemPage() {
  return <AddFormUI />
}
