import ItemManuPageUI from '@/components/pages/item-menu/ItemMenu'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/item-menu')({
  component: ItemManuPage,
})

function ItemManuPage() {
  return <ItemManuPageUI />
}
