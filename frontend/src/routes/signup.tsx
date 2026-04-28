import SignUpUI from '@/components/pages/signup/SignUp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: SignUp,
})

function SignUp() {
  return <SignUpUI />
}
