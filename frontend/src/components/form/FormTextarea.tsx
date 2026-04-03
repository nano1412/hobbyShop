import { Controller, useFormContext } from 'react-hook-form'
import Textarea from '@/components/ui/Textarea'
import type { TextareaProps } from '@/components/ui/Textarea'

type FormTextareaProps = TextareaProps & {
  name: string
}

export function FormTextarea({ name, ...props }: FormTextareaProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Textarea {...field} {...props} error={error?.message as string} />
      )}
    />
  )
}
