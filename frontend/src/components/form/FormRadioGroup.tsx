import { Group, Radio as MantineRadio } from '@mantine/core'
import type { RadioGroupProps } from '@mantine/core'
import { Controller, useFormContext } from 'react-hook-form'

import Radio from '@/components/ui/Radio'

type FormRadioGroupProps = Omit<RadioGroupProps, 'children'> & {
  name: string
  options: { label: string; value: string }[]
}

export function FormRadioGroup({
  name,
  options,
  ...props
}: FormRadioGroupProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MantineRadio.Group
          {...field}
          {...props}
          value={field.value ?? ''}
          error={error?.message as string}
        >
          <Group mt={8}>
            {options.map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                value={option.value}
                error={Boolean(error)}
              />
            ))}
          </Group>
        </MantineRadio.Group>
      )}
    />
  )
}
