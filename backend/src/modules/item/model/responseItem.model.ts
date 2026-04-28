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

const optionalString = t.Optional(t.String())
const optionalNumeric = t.Optional(t.Numeric())

export const ResponseItemModel = t.Object({
  userId: optionalString,
  id: t.String(),
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

  createdAt: t.Optional(t.Date()),
  createdBy: optionalString,
  updatedAt: t.Optional(t.Date()),
  updatedBy: optionalString,

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

export type ResponseItem = Static<typeof ResponseItemModel>
