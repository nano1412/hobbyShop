import { cn } from '@/lib/utils'
import type { CheckboxProps as MantineCheckboxProps } from '@mantine/core'
import { Checkbox as MantineCheckbox } from '@mantine/core'
import { forwardRef } from 'react'

export interface CheckboxProps extends MantineCheckboxProps {}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return <MantineCheckbox ref={ref} className={cn(className)} {...props} />
  },
)
Checkbox.displayName = 'Checkbox'

export default Checkbox
