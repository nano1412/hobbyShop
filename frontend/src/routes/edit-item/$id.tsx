import EditFormUI from '@/components/pages/edit-item/EditForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/edit-item/$id')({
  component: EditItemPage,
})

function EditItemPage() {
  return <EditFormUI />
}
