import EditFormUI from '@/components/pages/edit-item/EditForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/edit-item/$id')({
  component: EditItemPage,
})

function EditItemPage() {
  const { id } = Route.useParams()
  return <EditFormUI id={Number(id)} />
}
