import prisma from '@/lib/db'
import { Item } from '@/modules/item/model'
import { Prisma } from '../../generated/prisma/client'
import { Debug } from '@prisma/client/runtime/client'

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

export const FetchItems = async (
  query: ItemQuery,
): Promise<{
  data: Item[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}> => {
  try {
    const {
      page = '1',
      limit = '10',
      search,
      sort = 'createdAt',
      order = 'desc',
      categoryIds,
    } = query

    const pageNumber = parseInt(page)
    const take = parseInt(limit)
    const skip = (pageNumber - 1) * take

    // ---- sorting ----
    const allowedSortFields = [
      'id',
      'categoryId',
      'name',
      'createdAt',
      'updateAt',
      'storePriceThb',
      'msrpPrice',
      'releaseYear',
      'stockQty',
    ]
    const sortField = allowedSortFields.includes(sort) ? sort : 'createdAt'

    const sortOrder = order === 'asc' ? 'asc' : 'desc'

    // ---- filtering ----
    const where: Prisma.ItemWhereInput = {}

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      }
    }

    if (categoryIds) {
      where.categoryId = {
        in: categoryIds.split(',').map((id) => Number(id)),
      }
    }

    // ---- query ----
    const items = await prisma.item.findMany({
      where,
      include: {
        figureCommon: true,
        bandaiGunplaDetail: true,
        liquidProductCommon: true,
        paintDetail: true,
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip,
      take,
    })

    const total = await prisma.item.count({ where })

    return {
      data: items.map(PrismaToElysiaItemMapper),
      meta: {
        page: pageNumber,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    }
  } catch (err) {
    console.error('Unexpected error:', err)

    throw err
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
