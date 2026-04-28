import prisma from '@/lib/db'
import { Prisma } from '../../generated/prisma/client'
import { deleteImage } from './imageKit.service'
import { ResponseItem } from '@/modules/item/model/responseItem.model'
import { EditItem } from '@/modules/item/model/editItem.model'
import { AddItem } from '@/modules/item/model/addItem.model'

type ItemWithRelations = Prisma.ItemGetPayload<{
  include: {
    figureCommon: true
    bandaiGunplaDetail: true
    liquidProductCommon: true
    paintDetail: true
  }
}>

const PrismaToElysiaItemMapper = (data: ItemWithRelations): ResponseItem => {
  return {
    ...data,
    id: data.id ? data.id.toString() : '',
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

export const CreateItem = async (data: AddItem) => {
  try {
    await prisma.item.create({
      data: {
        categoryId: data.categoryId ? Number(data.categoryId) : 1,
        name: data.name,
        description: data.description,
        thumbnailPath: data.thumbnailPath,
        thumbnailId: data.thumbnailId,
        brand: data.brand,
        stockQty: data.stockQty,
        storePriceThb: data.storePriceThb,
        msrpPrice: data.msrpPrice,
        msrpCurrency: data.msrpCurrency,
        releaseYear: data.releaseYear,
        createdBy: data.userId ?? null,
        updatedBy: data.userId ?? null,
        updatedAt: new Date(),

        // FigureCommon
        ...(data.fromSerie || data.height
          ? {
              figureCommon: {
                create: {
                  fromSerie: data.fromSerie ?? undefined,
                  heightCm: data.height ?? undefined,
                },
              },
            }
          : {}),

        // BandaiGunplaDetail
        ...(data.gunplaGrade || data.gunplaExclusivity
          ? {
              bandaiGunplaDetail: {
                create: {
                  grade: data.gunplaGrade ?? 'other', // default enum
                  exclusivity: data.gunplaExclusivity ?? 'none', // default enum
                },
              },
            }
          : {}),

        // LiquidProductCommon
        ...(data.liquidProductType || data.resinType || data.volumeMl
          ? {
              liquidProductCommon: {
                create: {
                  liquidProductType: data.liquidProductType ?? 'other',
                  resinType: data.resinType ?? undefined,
                  volumeMl: data.volumeMl ?? 0,
                },
              },
            }
          : {}),

        // PaintDetail
        ...(data.colorTone ||
        data.paintSpecialPorperty ||
        data.paintApplicationMethod ||
        data.paintFinish
          ? {
              paintDetail: {
                create: {
                  colorTone: data.colorTone ?? 'other',
                  paintSpecialPorperty: data.paintSpecialPorperty ?? undefined,
                  paintApplicationMethod:
                    data.paintApplicationMethod ?? 'other',
                  paintFinish: data.paintFinish ?? undefined,
                },
              },
            }
          : {}),
      },
    })
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

export const FetchItems = async (
  query: ItemQuery,
): Promise<{
  data: ResponseItem[]
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

export const FetchItemWithId = async (id: number): Promise<ResponseItem> => {
  try {
    const rawItem = await prisma.item.findUnique({
      where: { id },
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

export const DeleteItemWithId = async (id: number) => {
  try {
    const itemToDelete = await FetchItemWithId(id)
    if (itemToDelete.thumbnailId) {
      try {
        await deleteImage(itemToDelete.thumbnailId)
      } catch (err) {
        console.error('Failed to delete image:', err)
      }
    }
    await prisma.item.delete({
      where: { id: Number(id) },
    })
    console.log('Deleted item with id', id)
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

export const UpdateItem = async (id: number, data: EditItem) => {
  try {
    const itemToEdit = await FetchItemWithId(id)
    if (itemToEdit.thumbnailId && data.thumbnailId != itemToEdit.thumbnailId) {
      try {
        await deleteImage(itemToEdit.thumbnailId)
      } catch (err) {
        console.error('Failed to delete image:', err)
      }
    }

    await prisma.item.update({
      where: { id },

      data: {
        categoryId: data.categoryId ? Number(data.categoryId) : undefined,
        name: data.name,
        description: data.description,
        thumbnailPath: data.thumbnailPath,
        thumbnailId: data.thumbnailId,
        brand: data.brand,
        stockQty: data.stockQty,
        storePriceThb: data.storePriceThb,
        msrpPrice: data.msrpPrice,
        msrpCurrency: data.msrpCurrency,
        releaseYear: data.releaseYear,
        updatedBy: data.userId ?? null,
        updatedAt: new Date(),

        // FigureCommon
        ...(data.fromSerie || data.height
          ? {
              figureCommon: {
                upsert: {
                  create: {
                    fromSerie: data.fromSerie ?? undefined,
                    heightCm: data.height ?? undefined,
                  },
                  update: {
                    fromSerie: data.fromSerie ?? undefined,
                    heightCm: data.height ?? undefined,
                  },
                },
              },
            }
          : {}),

        // BandaiGunplaDetail
        ...(data.gunplaGrade || data.gunplaExclusivity
          ? {
              bandaiGunplaDetail: {
                upsert: {
                  create: {
                    grade: data.gunplaGrade ?? 'other',
                    exclusivity: data.gunplaExclusivity ?? 'none',
                  },
                  update: {
                    grade: data.gunplaGrade ?? 'other',
                    exclusivity: data.gunplaExclusivity ?? 'none',
                  },
                },
              },
            }
          : {}),

        // LiquidProductCommon
        ...(data.liquidProductType || data.resinType || data.volumeMl
          ? {
              liquidProductCommon: {
                upsert: {
                  create: {
                    liquidProductType: data.liquidProductType ?? 'other',
                    resinType: data.resinType ?? undefined,
                    volumeMl: data.volumeMl ?? 0,
                  },
                  update: {
                    liquidProductType: data.liquidProductType ?? 'other',
                    resinType: data.resinType ?? undefined,
                    volumeMl: data.volumeMl ?? 0,
                  },
                },
              },
            }
          : {}),

        // PaintDetail
        ...(data.colorTone ||
        data.paintSpecialPorperty ||
        data.paintApplicationMethod ||
        data.paintFinish
          ? {
              paintDetail: {
                upsert: {
                  create: {
                    colorTone: data.colorTone ?? 'other',
                    paintSpecialPorperty:
                      data.paintSpecialPorperty ?? undefined,
                    paintApplicationMethod:
                      data.paintApplicationMethod ?? 'other',
                    paintFinish: data.paintFinish ?? undefined,
                  },
                  update: {
                    colorTone: data.colorTone ?? 'other',
                    paintSpecialPorperty:
                      data.paintSpecialPorperty ?? undefined,
                    paintApplicationMethod:
                      data.paintApplicationMethod ?? 'other',
                    paintFinish: data.paintFinish ?? undefined,
                  },
                },
              },
            }
          : {}),
      },
    })
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}
