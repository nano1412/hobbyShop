import ViewItemUI from '@/components/pages/view-item/ViewItem'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/view-item/$id')({
  component: ViewItem,
})

function ViewItem() {
  return <ViewItemUI />
}
