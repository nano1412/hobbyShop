import AddItemPageUI from '@/components/pages/add-item/MainForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/add-item')({
  component: AddItemPage,
})

function AddItemPage() {
  return <AddItemPageUI />
}
