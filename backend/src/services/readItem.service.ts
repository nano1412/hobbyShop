import prisma from '@/lib/db'
import { Item } from '@/modules/item/model'
import { Prisma } from '../../generated/prisma/client'

type ItemWithRelations = Prisma.ItemGetPayload<{
  include: {
    figureCommon: true
    bandaiGunplaDetail: true
    liquidProductCommon: true
    paintDetail: true
  }
}>

const PrismaToElysiaItemMapper = (data: ItemWithRelations): Item => {
  return {
    ...data,
    description: data.description ?? undefined,
    thumbnailPath: data.thumbnailPath ?? undefined,
    thumbnailId: data.thumbnailId ?? undefined,
    msrpPrice: data.msrpPrice ?? undefined,
    msrpCurrency: data.msrpCurrency ?? undefined,
    releaseYear: data.releaseYear ?? undefined,
    createdAt: data.createdAt,
    createdBy: data.createdBy ?? undefined,
    updatedAt: data.updatedAt ?? undefined,
    updatedBy: data.updatedBy ?? undefined,

    fromSerie: data.figureCommon?.fromSerie ?? undefined,
    height: data.figureCommon?.heightCm ?? undefined,

    gunplaGrade: data.bandaiGunplaDetail?.grade ?? undefined,
    gunplaExclusivity: data.bandaiGunplaDetail?.exclusivity ?? undefined,

    liquidProductType: data.liquidProductCommon?.liquidProductType ?? undefined,
    resinType: data.liquidProductCommon?.resinType ?? undefined,
    volumeMl: data.liquidProductCommon?.volumeMl ?? undefined,

    colorTone: data.paintDetail?.colorTone ?? undefined,
    paintSpecialPorperty: data.paintDetail?.paintSpecialPorperty ?? undefined,
    paintApplicationMethod:
      data.paintDetail?.paintApplicationMethod ?? undefined,
    paintFinish: data.paintDetail?.paintFinish ?? undefined,
  }
}

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
