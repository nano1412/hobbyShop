import { Controller, useFormContext } from 'react-hook-form'
import DatePickerInput from '@/components/ui/DatePickerInput'
import type { DatePickerInputProps } from '@/components/ui/DatePickerInput'

type FormDatePickerInputProps = DatePickerInputProps & {
  name: string
}

export function FormDatePickerInput({
  name,
  ...props
}: FormDatePickerInputProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePickerInput
          {...field}
          {...props}
          error={error?.message as string}
        />
      )}
    />
  )
}
