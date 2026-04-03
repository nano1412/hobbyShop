import { Controller, useFormContext } from 'react-hook-form'
import Select from '@/components/ui/Select'
import type { SelectProps } from '@/components/ui/Select'

type FormSelectProps = SelectProps & {
  name: string
}

export function FormSelect({ name, ...props }: FormSelectProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select {...field} {...props} error={error?.message as string} />
      )}
    />
  )
}
