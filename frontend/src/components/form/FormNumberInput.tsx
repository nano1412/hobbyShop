import { Controller, useFormContext } from 'react-hook-form'
import NumberInput from '@/components/ui/NumberInput'
import type { NumberInputProps } from '@/components/ui/NumberInput'

type FormNumberInputProps = NumberInputProps & {
  name: string
}

export function FormNumberInput({ name, ...props }: FormNumberInputProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <NumberInput {...field} {...props} error={error?.message as string} />
      )}
    />
  )
}
