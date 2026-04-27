import { createFileRoute } from '@tanstack/react-router'
import ItemManuPageUI from '@/components/pages/item-menu/ItemMenu'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <ItemManuPageUI />
}
