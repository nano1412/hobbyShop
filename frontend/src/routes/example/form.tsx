import { FormProvider, useForm } from 'react-hook-form'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Group } from '@mantine/core'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { optionalDate, optionalNumber, requiredText } from '@/lib/zod'

import {
  FormCheckbox,
  FormCheckboxGroup,
  FormDatePickerInput,
  FormNumberInput,
  FormPasswordInput,
  FormRadioGroup,
  FormSelect,
  FormTextInput,
  FormTextarea,
} from '@/components/form'
import { useState } from 'react'

export const Route = createFileRoute('/example/form')({
  component: ExampleFormPage,
})

const exampleFormSchema = z.object({
  fullName: requiredText('Full name is required').min(
    2,
    'Full name is required',
  ),
  email: z.email('Please enter a valid email'),
  password: requiredText('Password is required').min(
    8,
    'Password must be at least 8 characters',
  ),
  age: optionalNumber
    .refine((value) => value === undefined || value >= 18, {
      message: 'Age must be at least 18',
    })
    .refine((value) => value === undefined || value <= 100, {
      message: 'Age must be less than or equal to 100',
    }),
  role: requiredText('Please select a role'),
  birthDate: optionalDate.refine((value) => value !== undefined, {
    message: 'Please select a birth date',
  }),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  preferredContact: requiredText('Please select a preferred contact method'),
  bio: requiredText('Bio is required')
    .min(10, 'Bio must be at least 10 characters')
    .max(300),
  acceptTerms: z.boolean().refine((value) => value, 'You must accept terms'),
})

type ExampleFormInput = z.input<typeof exampleFormSchema>
type ExampleFormValues = z.output<typeof exampleFormSchema>

function ExampleFormPage() {
  const [submittedData, setSubmittedData] = useState<ExampleFormValues | null>(
    null,
  )

  const methods = useForm<ExampleFormInput, unknown, ExampleFormValues>({
    resolver: zodResolver(exampleFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      age: undefined,
      role: '',
      birthDate: null,
      interests: [],
      preferredContact: '',
      bio: '',
      acceptTerms: false,
    },
    mode: 'onTouched',
  })

  const { handleSubmit, reset } = methods

  const onSubmit = (values: ExampleFormValues) => {
    setSubmittedData(values)
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Example Form (RHF + Zod)</h1>
      <p className="mt-2 text-sm text-gray-500">
        React Hook Form with schema validation using Zod.
      </p>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4">
          <FormTextInput
            name="fullName"
            label="Full name"
            placeholder="John Doe"
          />
          <FormTextInput
            name="email"
            label="Email"
            placeholder="john@example.com"
            type="email"
          />
          <FormPasswordInput
            name="password"
            label="Password"
            placeholder="At least 8 characters"
          />
          <FormNumberInput
            name="age"
            label="Age"
            placeholder="Optional"
            min={0}
          />
          <FormSelect
            name="role"
            label="Role"
            placeholder="Pick one"
            data={[
              { label: 'Developer', value: 'developer' },
              { label: 'Designer', value: 'designer' },
              { label: 'Product Manager', value: 'pm' },
            ]}
            clearable={false}
          />
          <FormDatePickerInput
            name="birthDate"
            label="Birth date"
            placeholder="Select date"
          />
          <FormCheckboxGroup
            name="interests"
            label="Interests"
            options={[
              { label: 'Frontend', value: 'frontend' },
              { label: 'Backend', value: 'backend' },
              { label: 'DevOps', value: 'devops' },
            ]}
          />
          <FormRadioGroup
            name="preferredContact"
            label="Preferred contact method"
            options={[
              { label: 'Email', value: 'email' },
              { label: 'Phone', value: 'phone' },
              { label: 'Chat', value: 'chat' },
            ]}
          />
          <FormTextarea
            name="bio"
            label="Bio"
            placeholder="Tell us about yourself..."
            minRows={4}
          />
          <FormCheckbox
            name="acceptTerms"
            label="I accept terms and conditions"
          />

          <Group mt="sm" gap="sm">
            <Button type="submit">Submit</Button>
            <Button
              type="button"
              variant="default"
              onClick={() => {
                reset()
                setSubmittedData(null)
              }}
            >
              Reset
            </Button>
          </Group>
        </form>
      </FormProvider>

      {submittedData ? (
        <section className="mt-8 rounded-md border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold">Submitted data</h2>
          <pre className="mt-2 overflow-x-auto text-xs">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </section>
      ) : null}
    </main>
  )
}
