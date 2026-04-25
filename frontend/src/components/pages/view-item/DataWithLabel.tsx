import { Input, Text } from '@mantine/core'
import type { ReactNode } from 'react'
type prop = {
  label: string
  text: string
  children?: ReactNode
}

export default function DataWithLabel({ label, text, children }: prop) {
  return (
    <Input.Wrapper label={label} c={'gray.6'}>
      <Text className="break-words" c={'dark'}>
        {text}
      </Text>
      {children}
    </Input.Wrapper>
  )
}
