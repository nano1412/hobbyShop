import prisma from '@/lib/db'
import { Item } from '@/modules/item/model'
import { FetchItemWithId } from './readItem.service'
import { deleteImage } from './imageKit.service'

export const UpdateItem = async (id: string, data: Item) => {
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
      where: { id: Number(id) },

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
