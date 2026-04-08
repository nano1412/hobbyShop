import z from 'zod/v4'

export const addItemSchema = z.object({
  userId: z.string().optional(),
  id: z.int().optional(), //for update
  categoryId: z.union([z.string(), z.int()]), // integer
  name: z.string(),
  description: z.string(),
  thumbnailPath: z.string(),
  imageFile: z.file().optional(),
  brand: z.string(),
  stockQty: z.int(), // integer
  storePriceThb: z.number(), // float
  msrpPrice: z.number(), // float
  msrpCurrency: z.enum(['THB', 'JPY', 'CNY', 'USD']), // replace with your Prisma enum values
  releaseYear: z.int(),

  gunplaGrade: z.enum([
    'other',
    'NG',
    'SD',
    'EG',
    'HG',
    'RG',
    'MG',
    'PG',
    'RE100',
    'FM',
    'MGSD',
    'MEGA',
  ]), // Prisma enum mapping
  gunplaExclusivity: z.enum([
    'none',
    'gundam_base_limited',
    'p_bandai',
    'event',
    'special_package',
  ]), // Prisma enum mapping

  fromSerie: z.string(),
  height: z.number(), // float

  liquidProductType: z.enum([
    'other',
    'paint',
    'primer',
    'solvent',
    'thinner',
    'cement',
  ]),
  resinType: z.enum(['none', 'acrylic', 'lacquer', 'enamel', 'epoxy']),
  volumeMl: z.number(),

  colorTone: z.enum([
    'other',
    'red',
    'orange',
    'yellow',
    'green',
    'cyan',
    'blue',
    'purple',
    'black',
    'white',
    'gray',
    'pink',
    'brown',

    'gold',
    'silver',
    'copper',
  ]),
  paintSpecialPorperty: z.enum(['none', 'clear', 'metalic']),
  paintApplicationMethod: z.enum([
    'other',
    'spray',
    'brush',
    'air_brush_ready',
    'panel_liner',
  ]),
  paintFinish: z.enum(['other', 'gloss', 'semi_gloss', 'satin', 'matte']),
})

export type addItem = z.infer<typeof addItemSchema>
