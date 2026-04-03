import { Controller, useFormContext } from 'react-hook-form'
import Radio from '@/components/ui/Radio'
import type { RadioProps } from '@/components/ui/Radio'

type FormRadioProps = RadioProps & {
  name: string
}

export function FormRadio({ name, ...props }: FormRadioProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Radio {...field} {...props} error={error?.message as string} />
      )}
    />
  )
}
