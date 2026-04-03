import { cn } from '@/lib/utils'
import type { TextInputProps as MantineTextInputProps } from '@mantine/core'
import { TextInput as MantineTextInput } from '@mantine/core'
import { forwardRef } from 'react'

export interface TextInputProps extends MantineTextInputProps {}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...props }, ref) => {
    return <MantineTextInput ref={ref} className={cn(className)} {...props} />
  },
)
TextInput.displayName = 'TextInput'

export default TextInput
