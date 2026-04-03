import { Controller, useFormContext } from 'react-hook-form'
import TextInput from '@/components/ui/TextInput'
import type { TextInputProps } from '@/components/ui/TextInput'

type FormTextInputProps = TextInputProps & {
  name: string
}

export function FormTextInput({ name, ...props }: FormTextInputProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextInput {...field} {...props} error={error?.message as string} />
      )}
    />
  )
}
