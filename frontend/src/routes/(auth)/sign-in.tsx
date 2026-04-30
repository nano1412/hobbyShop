import SignInUI from '@/components/pages/sign-in/SignIn'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
})

function SignIn() {
  return <SignInUI />
}
