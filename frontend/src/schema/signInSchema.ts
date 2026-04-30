import { z } from 'zod'

export const signInSchema = z.object({
  //the identifier field will hold both username and email
  identifier: z.string().min(1, 'this field is required'),
  password: z.string().min(1, 'please enter your password'),
})

export type signIn = z.infer<typeof signInSchema>
