import prisma from '@/lib/db'
import { Item } from '@/modules/item/model'

export const AddItem = async (data: Item) => {
  try {
    console.log(data)
    const baseItem = await prisma.item.create({
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

    console.log('add item sucess')
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}
