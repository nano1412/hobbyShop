import { Category } from '@/schema/interface'
import { Pill } from '@mantine/core'

type CategoryPillProps = {
  categoryId: number
}

const CATEGORY_CONFIG: Record<
  Category,
  { c: string; bg: string; text: string }
> = {
  [Category.OTHER]: { c: 'gray.7', bg: 'gray.2', text: 'other' },
  [Category.MODEL_KIT]: { c: 'blue.7', bg: 'blue.2', text: 'model kit' },
  [Category.GUNPLA]: { c: 'cyan.7', bg: 'cyan.2', text: 'gunpla' },
  [Category.FIGURE]: { c: 'green.7', bg: 'green.2', text: 'figure' },
  [Category.TOOL]: { c: 'violet.7', bg: 'violet.2', text: 'tool' },
  [Category.LIQUID_PRODUCT]: {
    c: 'pink.7',
    bg: 'pink.2',
    text: 'liquid product',
  },
  [Category.PAINT]: { c: 'red.7', bg: 'red.2', text: 'paint' },
}

export function CategoryPill({ categoryId }: CategoryPillProps) {
  const category = categoryId as Category

  const config = CATEGORY_CONFIG[category] ?? {
    c: 'white',
    bg: 'gray',
    text: 'unknown',
  }

  return (
    <Pill c={config.c} bg={config.bg} fw={'bold'} fz={'14'}>
      {config.text}
    </Pill>
  )
}
