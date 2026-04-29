import EditFormUI from '@/components/pages/edit-item/EditForm'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/edit-item/$id')({
  component: EditItemPage,
})

function EditItemPage() {
  const { id } = useParams({ from: '/(app)/edit-item/$id' })
  return <EditFormUI id={Number(id)} />
}
