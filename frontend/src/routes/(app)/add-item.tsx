import AddFormUI from '@/components/pages/add-item/AddForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/add-item')({
  component: AddItemPage,
})

function AddItemPage() {
  return <AddFormUI />
}
