import { Static, t } from 'elysia'
import {
  ColorTone,
  GunplaExclusivity,
  GunplaGrade,
  LiquidProductType,
  PaintApplicationMethod,
  PaintFinish,
  PaintSpecialPorperty,
  ResinType,
  Currency,
} from '../../../../generated/prisma/client'
import { optionalNumeric, optionalString } from '@/utils/elysiaTypeUtil'

export const AddItemModel = t.Object({
  userId: optionalString,
  categoryId: t.Numeric(),
  name: t.String(),
  description: optionalString,
  thumbnailPath: optionalString,
  thumbnailId: optionalString,
  brand: t.String(),
  stockQty: t.Numeric(),
  storePriceThb: t.Numeric(),
  msrpPrice: optionalNumeric,
  msrpCurrency: t.Optional(t.Enum(Currency)),
  releaseYear: optionalNumeric,

  gunplaGrade: t.Optional(t.Enum(GunplaGrade)),
  gunplaExclusivity: t.Optional(t.Enum(GunplaExclusivity)),

  fromSerie: optionalString,
  height: optionalNumeric,

  liquidProductType: t.Optional(t.Enum(LiquidProductType)),
  resinType: t.Optional(t.Enum(ResinType)),
  volumeMl: optionalNumeric,

  colorTone: t.Optional(t.Enum(ColorTone)),
  paintSpecialPorperty: t.Optional(t.Enum(PaintSpecialPorperty)),
  paintApplicationMethod: t.Optional(t.Enum(PaintApplicationMethod)),
  paintFinish: t.Optional(t.Enum(PaintFinish)),
})

export type AddItem = Static<typeof AddItemModel>
