import z from 'zod/v4'
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

export const itemSchema = z.object({
  userId: z.string().optional(),
  id: z.int().optional(), //for update
  categoryId: z.union([z.string(), z.int()]), // integer
  name: z.string(),
  description: z.string(),

  thumbnailPath: z.string().optional(),
  thumbnailId: z.string().optional(),
  imageFile: z.file().optional(),

  brand: z.string(),
  stockQty: z.int(), // integer
  storePriceThb: z.number(), // float
  msrpPrice: z.number(), // float
  msrpCurrency: z.enum(MsrpCurrency).optional(), // replace with your Prisma enum values
  releaseYear: z.int(),

  gunplaGrade: z.enum(GunplaGrade).optional(), // Prisma enum mapping
  gunplaExclusivity: z.enum(GunplaExclusivity).optional(), // Prisma enum mapping

  fromSerie: z.string().optional(),
  height: z.number().optional(), // float

  liquidProductType: z.enum(LiquidProductType).optional(),
  resinType: z.enum(ResinType).optional(),
  volumeMl: z.number().optional(),

  colorTone: z.enum(ColorTone).optional(),
  paintSpecialPorperty: z.enum(PaintSpecialPorperty).optional(),
  paintApplicationMethod: z.enum(PaintApplicationMethod).optional(),
  paintFinish: z.enum(PaintFinish).optional(),
})

export type item = z.infer<typeof itemSchema>
