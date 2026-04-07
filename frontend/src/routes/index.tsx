import { createFileRoute } from '@tanstack/react-router'
// import HomeUiComponentsDemo from '@/components/pages/home/HomeUiComponentsDemo'
import Header from '@/components/common/Header'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <>
      <Header></Header>
    </>
  )
}
