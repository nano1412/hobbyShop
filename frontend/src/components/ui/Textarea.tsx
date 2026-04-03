import { cn } from '@/lib/utils'
import type { TextareaProps as MantineTextareaProps } from '@mantine/core'
import { Textarea as MantineTextarea } from '@mantine/core'
import { forwardRef } from 'react'

export interface TextareaProps extends MantineTextareaProps {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return <MantineTextarea ref={ref} className={cn(className)} {...props} />
  },
)
Textarea.displayName = 'Textarea'

export default Textarea
