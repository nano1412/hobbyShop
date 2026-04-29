import { z } from 'zod'

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),

    email: z.email('Invalid email address'),

    password: z
      .string()
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character')
      .min(8, 'Password must be at least 8 characters'),

    confirmPassword: z.string().min(1, 'please enter your password again'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type signUp = z.infer<typeof signUpSchema>
