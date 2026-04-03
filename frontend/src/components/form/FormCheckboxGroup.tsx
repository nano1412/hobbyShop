import { Checkbox as MantineCheckbox, Group } from '@mantine/core'
import type { CheckboxGroupProps } from '@mantine/core'
import { Controller, useFormContext } from 'react-hook-form'

import Checkbox from '@/components/ui/Checkbox'

type FormCheckboxGroupProps = Omit<CheckboxGroupProps, 'children'> & {
  name: string
  options: { label: string; value: string }[]
}

export function FormCheckboxGroup({
  name,
  options,
  ...props
}: FormCheckboxGroupProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MantineCheckbox.Group
          {...field}
          {...props}
          value={field.value ?? []}
          error={error?.message as string}
        >
          <Group mt={8}>
            {options.map((option) => (
              <Checkbox
                key={option.value}
                label={option.label}
                value={option.value}
                error={Boolean(error)}
              />
            ))}
          </Group>
        </MantineCheckbox.Group>
      )}
    />
  )
}
