import AddItem from '@/components/pages/addItem/mainform'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/add-item')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddItem />
}
