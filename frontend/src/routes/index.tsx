import { createFileRoute } from '@tanstack/react-router'
import HomeUiComponentsDemo from '@/components/pages/home/HomeUiComponentsDemo'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <HomeUiComponentsDemo />
}
