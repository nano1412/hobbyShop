import ItemManuPage from '@/components/pages/itemMenu/menu-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/item-menu')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ItemManuPage />
}
