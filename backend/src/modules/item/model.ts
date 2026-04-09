import { Static, t } from 'elysia'
import {
  ColorTone,
  GunplaExclusivity,
  GunplaGrade,
  LiquidProductType,
  MsrpCurrency,
  PaintApplicationMethod,
  PaintFinish,
  PaintSpecialPorperty,
  ResinType,
} from './interface'

const optionalString = t.Optional(t.String())
const optionalNumeric = t.Optional(t.Numeric())

export const ItemModel = t.Object({
  userId: optionalString,
  id: optionalNumeric,
  categoryId: t.Numeric(),
  name: t.String(),
  description: optionalString,
  // imageFile: t.Optional(t.File()),
  thumbnailPath: optionalString,
  thumbnailId: optionalString,
  brand: t.String(),
  stockQty: t.Numeric(),
  storePriceThb: t.Numeric(),
  msrpPrice: optionalNumeric,
  msrpCurrency: t.Optional(t.Enum(MsrpCurrency)),
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

export type Item = Static<typeof ItemModel>
