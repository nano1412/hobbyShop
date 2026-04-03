import { cn } from '@/lib/utils'
import type { NumberInputProps as MantineNumberInputProps } from '@mantine/core'
import { NumberInput as MantineNumberInput } from '@mantine/core'
import { forwardRef } from 'react'

export interface NumberInputProps extends MantineNumberInputProps {}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, ...props }, ref) => {
    return <MantineNumberInput ref={ref} className={cn(className)} {...props} />
  },
)
NumberInput.displayName = 'NumberInput'

export default NumberInput
