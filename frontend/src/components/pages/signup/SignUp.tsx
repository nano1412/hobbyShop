import { signUpSchema, type signUp } from '@/schema/signUpSchema'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'

export default function SignUpUI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const signUpForm = useForm<signUp>({
    validate: zod4Resolver(signUpSchema),
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  return <></>
}
