import { Category } from '@/schema/interface'
import { Pill } from '@mantine/core'

type CategoryPillProps = {
  categoryId: number
}

const CATEGORY_CONFIG: Record<
  Category,
  { c: string; bg: string; text: string }
> = {
  [Category.OTHER]: { c: 'white', bg: 'gray', text: 'other' },
  [Category.MODEL_KIT]: { c: 'white', bg: 'blue', text: 'model kit' },
  [Category.GUNPLA]: { c: 'white', bg: 'cyan', text: 'gunpla' },
  [Category.FIGURE]: { c: 'white', bg: 'green', text: 'figure' },
  [Category.TOOL]: { c: 'white', bg: 'yellow', text: 'tool' },
  [Category.LIQUID_PRODUCT]: { c: 'white', bg: 'pink', text: 'liquid product' },
  [Category.PAINT]: { c: 'white', bg: 'red', text: 'paint' },
}

export function CategoryPill({ categoryId }: CategoryPillProps) {
  const category = categoryId as Category

  const config = CATEGORY_CONFIG[category] ?? {
    c: 'white',
    bg: 'gray',
    text: 'unknown',
  }

  return (
    <Pill c={config.c} bg={config.bg}>
      {config.text}
    </Pill>
  )
}
