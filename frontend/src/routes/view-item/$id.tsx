import ViewItem from '@/components/pages/viewItem/view-item'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/view-item/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ViewItem />
}
