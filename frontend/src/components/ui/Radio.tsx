import { cn } from '@/lib/utils'
import type { RadioProps as MantineRadioProps } from '@mantine/core'
import { Radio as MantineRadio } from '@mantine/core'
import { forwardRef } from 'react'

export interface RadioProps extends MantineRadioProps {}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => {
    return <MantineRadio ref={ref} className={cn(className)} {...props} />
  },
)
Radio.displayName = 'Radio'

export default Radio
