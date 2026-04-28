import z from 'zod/v4'
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
} from './interface'

const optionalString = z.string().optional()
const requiredString = z.string().min(1, 'this field must not be empty')
const optionalNumber = z.number().optional()
const requiredNumber = z.number().refine((value) => value > 0, {
  message: 'this field must not be greater than 0',
})
const optionalInt = z.int().optional()
const requiredInt = z
  .int('must be integer')
  .min(1, 'this field must be greater than 0')

export const itemSchema = z.object({
  userId: optionalString,
  id: optionalInt, //for update
  categoryId: z.union([z.string(), z.int()]), // integer
  name: requiredString,
  description: optionalString,

  thumbnailPath: optionalString,
  thumbnailId: optionalString,
  imageFile: z.file().optional(),

  brand: requiredString,
  stockQty: z.number().refine((value) => value >= 0, {
    message: 'this field can not be negative',
  }),
  storePriceThb: requiredNumber,
  msrpPrice: optionalNumber,
  msrpCurrency: z.enum(Currency).optional(), // replace with your Prisma enum values
  releaseYear: optionalInt,

  createdBy: optionalString,
  updatedAt: z.date().optional(),
  updatedBy: optionalString,

  gunplaGrade: z.enum(GunplaGrade).optional(), // Prisma enum mapping
  gunplaExclusivity: z.enum(GunplaExclusivity).optional(), // Prisma enum mapping

  fromSerie: optionalString,
  height: optionalNumber,

  liquidProductType: z.enum(LiquidProductType).optional(),
  resinType: z.enum(ResinType).optional(),
  volumeMl: optionalNumber,

  colorTone: z.enum(ColorTone).optional(),
  paintSpecialPorperty: z.enum(PaintSpecialPorperty).optional(),
  paintApplicationMethod: z.enum(PaintApplicationMethod).optional(),
  paintFinish: z.enum(PaintFinish).optional(),
})

export type item = z.infer<typeof itemSchema>
