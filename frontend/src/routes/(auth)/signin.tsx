import SignInUI from '@/components/pages/signin/SignIn'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/signin')({
  component: SignIn,
})

function SignIn() {
  return <SignInUI />
}
