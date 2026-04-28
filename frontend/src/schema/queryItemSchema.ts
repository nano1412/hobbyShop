import z from 'zod/v4'

const optionalString = z.string().optional()

export const QueryItemSchema = z.object({
  page: optionalString,
  limit: optionalString,
  search: optionalString,
  sort: optionalString,
  order: optionalString,
  categoryIds: optionalString,
})

export type queryItem = z.infer<typeof QueryItemSchema>
