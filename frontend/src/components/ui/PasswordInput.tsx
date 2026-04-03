import { cn } from '@/lib/utils'
import type { PasswordInputProps as MantinePasswordInputProps } from '@mantine/core'
import { PasswordInput as MantinePasswordInput } from '@mantine/core'
import { forwardRef } from 'react'

export interface PasswordInputProps extends MantinePasswordInputProps {}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <MantinePasswordInput ref={ref} className={cn(className)} {...props} />
    )
  },
)
PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
