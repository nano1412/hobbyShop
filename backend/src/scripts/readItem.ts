import prisma from '@/lib/db'
import { PrismaToElysiaItemMapper } from '@/modules/item/interface'
import { Item } from '@/modules/item/model'

export const FetchItems = async (): Promise<Item[]> => {
  try {
    const items = await prisma.item.findMany({
      include: {
        figureCommon: true,
        bandaiGunplaDetail: true,
        liquidProductCommon: true,
        paintDetail: true,
      },
    })

    return items.map(PrismaToElysiaItemMapper)
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}

export const FetchItemWithId = async (id: string): Promise<Item> => {
  try {
    const rawItem = await prisma.item.findUnique({
      where: { id: Number(id) },
      include: {
        figureCommon: true,
        bandaiGunplaDetail: true,
        liquidProductCommon: true,
        paintDetail: true,
      },
    })
    if (!rawItem) throw new Error('Item not found')
    return PrismaToElysiaItemMapper(rawItem)
  } catch (err) {
    console.error('Unexpected error:', err)
    throw err
  }
}
