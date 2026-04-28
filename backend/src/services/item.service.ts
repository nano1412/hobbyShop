import prisma from '@/lib/db'
import { GunplaExclusivity, Prisma } from '../../generated/prisma/client'
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
    await prisma.$transaction(async (prismaTransaction) => {
      const createItemPrisma = await prismaTransaction.item.create({
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
        },
      })
      // FigureCommon
      if (data.fromSerie || data.height) {
        await prismaTransaction.figureCommon.create({
          data: {
            fromSerie: data.fromSerie ?? undefined,
            heightCm: data.height ?? undefined,
            itemId: createItemPrisma.id,
          },
        })
      }

      // BandaiGunplaDetail
      if (data.gunplaGrade || data.gunplaExclusivity) {
        await prismaTransaction.bandaiGunplaDetail.create({
          data: {
            grade: data.gunplaGrade ?? 'other',
            GunplaExclusivity: data.gunplaExclusivity ?? 'none',
            itemId: createItemPrisma.id,
          },
        })
      }

      // LiquidProductCommon
      if (data.liquidProductType || data.resinType || data.volumeMl) {
        await prismaTransaction.liquidProductCommon.create({
          data: {
            liquidProductType: data.liquidProductType ?? 'other',
            resinType: data.resinType ?? undefined,
            volumeMl: data.volumeMl ?? 0,
            itemId: createItemPrisma.id,
          },
        })
      }

      // PaintDetail
      if (
        data.colorTone ||
        data.paintSpecialPorperty ||
        data.paintApplicationMethod ||
        data.paintFinish
      ) {
        await prismaTransaction.paintDetail.create({
          data: {
            colorTone: data.colorTone ?? 'other',
            paintSpecialPorperty: data.paintSpecialPorperty ?? undefined,
            paintApplicationMethod: data.paintApplicationMethod ?? 'other',
            paintFinish: data.paintFinish ?? undefined,
            itemId: createItemPrisma.id,
          },
        })
      }
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    throw err
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
      await deleteImage(itemToDelete.thumbnailId)
    }
    await prisma.$transaction(async (prismaTransaction) => {
      await prismaTransaction.item.delete({
        where: { id: Number(id) },
      })
    })

    console.log('Deleted item with id', id)
  } catch (err) {
    console.error('Unexpected error:', err)
    throw err
  }
}

export const UpdateItem = async (id: number, data: EditItem) => {
  try {
    const itemToEdit = await FetchItemWithId(id)
    if (itemToEdit.thumbnailId && data.thumbnailId != itemToEdit.thumbnailId) {
      await deleteImage(itemToEdit.thumbnailId)
    }
    await prisma.$transaction(async (prismaTransaction) => {
      const updateItemPrisma = await prismaTransaction.item.update({
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
        },
      })

      // FigureCommon
      if (data.fromSerie || data.height) {
        await prismaTransaction.figureCommon.upsert({
          where: { itemId: updateItemPrisma.id },
          create: {
            fromSerie: data.fromSerie ?? undefined,
            heightCm: data.height ?? undefined,
            itemId: updateItemPrisma.id,
          },
          update: {
            fromSerie: data.fromSerie ?? undefined,
            heightCm: data.height ?? undefined,
          },
        })
      }

      // BandaiGunplaDetail
      if (data.gunplaGrade || data.gunplaExclusivity) {
        await prismaTransaction.bandaiGunplaDetail.upsert({
          where: { itemId: updateItemPrisma.id },
          create: {
            grade: data.gunplaGrade ?? 'other',
            GunplaExclusivity: data.gunplaExclusivity ?? 'none',
            itemId: updateItemPrisma.id,
          },
          update: {
            grade: data.gunplaGrade ?? 'other',
            GunplaExclusivity: data.gunplaExclusivity ?? 'none',
          },
        })
      }

      // LiquidProductCommon
      if (data.liquidProductType || data.resinType || data.volumeMl) {
        await prismaTransaction.liquidProductCommon.upsert({
          where: { itemId: updateItemPrisma.id },
          create: {
            liquidProductType: data.liquidProductType ?? 'other',
            resinType: data.resinType ?? undefined,
            volumeMl: data.volumeMl ?? 0,
            itemId: updateItemPrisma.id,
          },
          update: {
            liquidProductType: data.liquidProductType ?? 'other',
            resinType: data.resinType ?? undefined,
            volumeMl: data.volumeMl ?? 0,
          },
        })
      }

      // PaintDetail
      if (
        data.colorTone ||
        data.paintSpecialPorperty ||
        data.paintApplicationMethod ||
        data.paintFinish
      ) {
        await prismaTransaction.paintDetail.upsert({
          where: { itemId: updateItemPrisma.id },
          create: {
            colorTone: data.colorTone ?? 'other',
            paintSpecialPorperty: data.paintSpecialPorperty ?? undefined,
            paintApplicationMethod: data.paintApplicationMethod ?? 'other',
            paintFinish: data.paintFinish ?? undefined,
            itemId: updateItemPrisma.id,
          },
          update: {
            colorTone: data.colorTone ?? 'other',
            paintSpecialPorperty: data.paintSpecialPorperty ?? undefined,
            paintApplicationMethod: data.paintApplicationMethod ?? 'other',
            paintFinish: data.paintFinish ?? undefined,
          },
        })
      }
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    throw err
  }
}
