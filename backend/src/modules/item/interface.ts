import { Prisma } from '../../../generated/prisma/client'
import { Item } from './model'

// export enum GunplaGrade {
//   OTHER = 'other',
//   NG = 'NG',
//   SD = 'SD',
//   EG = 'EG',
//   HG = 'HG',
//   RG = 'RG',
//   MG = 'MG',
//   PG = 'PG',
//   RE100 = 'RE100',
//   FM = 'FM',
//   MGSD = 'MGSD',
//   MEGA = 'MEGA',
// }

// export enum MsrpCurrency {
//   THB = 'THB',
//   JPY = 'JPY',
//   CNY = 'CNY',
//   USD = 'USD',
// }

// export enum GunplaExclusivity {
//   NONE = 'none',
//   GUNDAM_BASE_LIMITED = 'gundam_base_limited',
//   P_BANDAI = 'p_bandai',
//   EVENT = 'event',
//   SPECIAL_PACHAGE = 'special_package',
// }

// export enum LiquidProductType {
//   OTHER = 'other',
//   PAINT = 'paint',
//   PRIMER = 'primer',
//   SOLVENT = 'solvent',
//   THINNER = 'thinner',
//   CEMENT = 'cement',
// }

// export enum ResinType {
//   NONE = 'none',
//   ACRYLIC = 'acrylic',
//   LACQUER = 'lacquer',
//   ENAMEL = 'enamel',
//   EPOXY = 'epoxy',
// }

// export enum ColorTone {
//   OTHER = 'other',
//   RED = 'red',
//   ORANGE = 'orange',
//   YELLOW = 'yellow',
//   GREEN = 'green',
//   CYAN = 'cyan',
//   BLUE = 'blue',
//   PURPLE = 'purple',
//   BLACK = 'black',
//   WHITE = 'white',
//   GRAY = 'gray',
//   PINK = 'pink',
//   BROWN = 'brown',
//   GOLD = 'gold',
//   SILVER = 'silver',
//   COPPER = 'copper',
// }

// export enum PaintSpecialPorperty {
//   NONE = 'none',
//   CLEAR = 'clear',
//   METALIC = 'metalic',
// }

// export enum PaintApplicationMethod {
//   OTHER = 'other',
//   SPRAY = 'spray',
//   BRUSH = 'brush',
//   AIR_BRUSH_READY = 'air_brush_ready',
//   PANEL_LINER = 'panel_liner',
// }

// export enum PaintFinish {
//   OTHER = 'other',
//   GLOSS = 'gloss',
//   SEMI_GLOSS = 'semi_gloss',
//   SATIN = 'satin',
//   MATTE = 'matte',
// }

export type ItemWithRelations = Prisma.ItemGetPayload<{
  include: {
    figureCommon: true
    bandaiGunplaDetail: true
    liquidProductCommon: true
    paintDetail: true
  }
}>

export function PrismaToElysiaItemMapper(data: ItemWithRelations): Item {
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
