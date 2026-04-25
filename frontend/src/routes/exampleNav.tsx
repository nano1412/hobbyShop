import HomeUiComponentsDemo from '@/components/pages/home/HomeUiComponentsDemo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/exampleNav')({
  component: RouteComponent,
})

function RouteComponent() {
  return <HomeUiComponentsDemo />
}
