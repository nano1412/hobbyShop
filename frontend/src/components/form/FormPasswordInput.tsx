import { Controller, useFormContext } from 'react-hook-form'
import PasswordInput from '@/components/ui/PasswordInput'
import type { PasswordInputProps } from '@/components/ui/PasswordInput'

type FormPasswordInputProps = PasswordInputProps & {
  name: string
}

export function FormPasswordInput({ name, ...props }: FormPasswordInputProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <PasswordInput {...field} {...props} error={error?.message as string} />
      )}
    />
  )
}
