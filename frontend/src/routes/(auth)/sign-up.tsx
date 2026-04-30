import SignUpUI from '@/components/pages/sign-up/SignUp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUp,
})

function SignUp() {
  return <SignUpUI />
}
