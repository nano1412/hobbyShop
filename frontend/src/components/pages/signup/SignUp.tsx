import { authClient } from '@/lib/auth-client'
import { signUpSchema, type signUp } from '@/schema/signUpSchema'
import { Button, TextInput, Text, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useNavigate } from '@tanstack/react-router'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'

export default function SignUpUI() {
  const navigate = useNavigate()
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

  const handleSignUp = async (data: signUp) => {
    setError(null)
    setLoading(true)
    const result = await authClient.signUp.email({
      email: data.email,
      name: data.name,
      username: data.name,
      password: data.password,
    })
    setLoading(false)

    if (result.error) {
      setError(result.error.message ?? 'Sign up failed.')
      return
    }

    navigate({ to: '/' })
  }
  return (
    <>
      {error ? (
        <section className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </section>
      ) : null}
      <div className="mx-auto my-10 max-w-xl px-6 py-12 bg-gray-50 rounded-2xl drop-shadow-xl">
        <form onSubmit={signUpForm.onSubmit(handleSignUp)}>
          <h1 className="font-bold text-2xl ">SignUp</h1>
          <Text className="mb-5" c="dimmed" size="sm" mt={4}>
            SignUp to this hobby shop
          </Text>
          <TextInput
            withAsterisk
            label="E-Mail"
            placeholder="enter your email"
            key={signUpForm.key('email')}
            {...signUpForm.getInputProps('email')}
          />

          <TextInput
            withAsterisk
            label="Username"
            placeholder="enter your username"
            key={signUpForm.key('name')}
            {...signUpForm.getInputProps('name')}
          />

          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="enter your password"
            key={signUpForm.key('password')}
            {...signUpForm.getInputProps('password')}
          />

          <PasswordInput
            withAsterisk
            label="Confirm Password"
            placeholder="please re-enter your password again"
            key={signUpForm.key('confirmPassword')}
            {...signUpForm.getInputProps('confirmPassword')}
          />

          <Button className="w-full mt-5" type="submit" loading={loading}>
            SignUp
          </Button>
          <Button
            className="w-full mt-5"
            variant="outline"
            onClick={() => {
              navigate({ to: '/signin' })
            }}
          >
            Already has account? go to signIn
          </Button>
        </form>
      </div>
    </>
  )
}
