import EditFormUI from '@/components/pages/edit-item/EditForm'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/edit-item/$id')({
  component: EditItemPage,
})

function EditItemPage() {
  const { id } = useParams({ from: '/edit-item/$id' })
  return <EditFormUI id={Number(id)} />
}
