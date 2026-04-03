import { cn } from '@/lib/utils'
import type { SelectProps as MantineSelectProps } from '@mantine/core'
import { Select as MantineSelect } from '@mantine/core'
import { forwardRef } from 'react'

export interface SelectProps extends MantineSelectProps {}

const Select = forwardRef<HTMLInputElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return <MantineSelect ref={ref} className={cn(className)} {...props} />
  },
)
Select.displayName = 'Select'

export default Select
