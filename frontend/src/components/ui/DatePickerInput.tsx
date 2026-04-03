import { forwardRef } from 'react'
import type { DatePickerInputProps as MantineDatePickerInputProps } from '@mantine/dates'
import { DatePickerInput as MantineDatePickerInput } from '@mantine/dates'
// import dayjs from 'dayjs'
// import 'dayjs/locale/th'
// import buddhistEra from 'dayjs/plugin/buddhistEra'

import { cn } from '@/lib/utils'

// dayjs.locale('th')
// dayjs.extend(buddhistEra)

export interface DatePickerInputProps extends MantineDatePickerInputProps {
  // Add variants or specific props here if requested later
}

const DatePickerInput = forwardRef<HTMLButtonElement, DatePickerInputProps>(
  (
    {
      className,
      classNames,
      leftSection,
      locale = 'en',
      // valueFormat = 'DD/MM/BBBB',
      // monthLabelFormat = 'MMMM BBBB',
      // yearLabelFormat = 'BBBB',
      // decadeLabelFormat = 'BBBB',
      // yearsListFormat = 'BBBB',
      valueFormat = 'DD/MM/YYYY',
      monthLabelFormat = 'MMMM YYYY',
      yearLabelFormat = 'YYYY',
      decadeLabelFormat = 'YYYY',
      yearsListFormat = 'YYYY',
      ...props
    },
    ref,
  ) => {
    return (
      <MantineDatePickerInput
        ref={ref}
        locale={locale}
        valueFormat={valueFormat}
        monthLabelFormat={monthLabelFormat}
        yearLabelFormat={yearLabelFormat}
        decadeLabelFormat={decadeLabelFormat}
        yearsListFormat={yearsListFormat}
        leftSection={leftSection}
        classNames={{
          ...classNames,
        }}
        className={cn(className)}
        {...props}
      />
    )
  },
)

export default DatePickerInput
