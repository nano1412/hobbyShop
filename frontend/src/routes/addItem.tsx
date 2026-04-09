import AddItem from '@/components/pages/item/addItem'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/addItem')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddItem />
}
