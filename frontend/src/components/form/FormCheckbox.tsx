import { Controller, useFormContext } from 'react-hook-form'

import Checkbox from '@/components/ui/Checkbox'
import type { CheckboxProps } from '@/components/ui/Checkbox'

type FormCheckboxProps = CheckboxProps & {
  name: string
}

export function FormCheckbox({ name, ...props }: FormCheckboxProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Checkbox {...field} {...props} error={error?.message as string} />
      )}
    />
  )
}
