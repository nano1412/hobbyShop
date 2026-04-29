import { signInSchema, type signIn } from '@/schema/signInSchema'
import { useNavigate } from '@tanstack/react-router'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useState } from 'react'
import { useForm } from '@mantine/form'
import { Button, PasswordInput, TextInput, Text } from '@mantine/core'
import z from 'zod'
import { authClient } from '@/lib/auth-client'

export default function SignInUI() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const signInForm = useForm<signIn>({
    validate: zod4Resolver(signInSchema),
    initialValues: {
      identifier: '',
      password: '',
    },
  })
  const handleSignIn = async (data: signIn) => {
    setError(null)
    setLoading(true)

    try {
      const isEmail = z.email().safeParse(data.identifier).success

      const result = isEmail
        ? await authClient.signIn.email({
            email: data.identifier,
            password: data.password,
          })
        : await authClient.signIn.username({
            username: data.identifier,
            password: data.password,
          })

      if (result.error) {
        setError(result.error.message ?? 'Sign in failed.')
        return
      }

      navigate({ to: '/' })
    } catch (err) {
      setError('Unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mx-auto my-10 max-w-xl px-6 py-12 bg-gray-50 rounded-2xl drop-shadow-xl">
        <form onSubmit={signInForm.onSubmit(handleSignIn)}>
          <h1 className="font-bold text-2xl ">Sign In</h1>
          <Text className="mb-5" c="dimmed" size="sm" mt={4}>
            Sign In to this hobby shop
          </Text>
          <TextInput
            withAsterisk
            label="Username or Email"
            placeholder="enter either your username or email"
            key={signInForm.key('identifier')}
            {...signInForm.getInputProps('identifier')}
          />

          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="please enter your password"
            key={signInForm.key('password')}
            {...signInForm.getInputProps('password')}
          />

          {error ? (
            <section className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </section>
          ) : null}

          <Button className="w-full mt-5" type="submit" loading={loading}>
            Sign In
          </Button>
          <Button
            className="w-full mt-5"
            variant="outline"
            onClick={() => {
              navigate({ to: '/signup' })
            }}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </>
  )
}
