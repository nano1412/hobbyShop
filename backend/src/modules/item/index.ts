import Elysia, { t } from 'elysia'
import { ItemModel } from './model'
import { AddItem } from '@/services/addItem.service'
import { getImageKitAuth } from '@/services/imageKit.service'
import { FetchItems, FetchItemWithId } from '@/services/readItem.service'
import { DeleteItemWithId } from '@/services/deleteItem.service'

export const itemModule = new Elysia({
  name: 'module.items',
  prefix: '/api/items',
})
  .get('/:id', ({ params }) => FetchItemWithId(params.id), {
    detail: {
      tags: ['Item'],
      summary: 'Get Item by id',
    },
    response: {
      200: ItemModel,
    },
  })
  .get(
    '/',
    async ({ query }) => {
      const result = await FetchItems(query)
      return result
    },
    {
      detail: {
        tags: ['Item'],
        summary: 'Get Items list',
      },
      response: {
        200: t.Object({
          data: t.Array(ItemModel),
          meta: t.Object({
            page: t.Number(),
            limit: t.Number(),
            total: t.Number(),
            totalPages: t.Number(),
          }),
        }),
      },
    },
  )
  .post(
    '/add',
    ({ body }) => {
      AddItem(body)
    },
    {
      body: ItemModel,
      detail: {
        tags: ['Item'],
        summary: 'add new item',
      },
    },
  )
  .delete('/:id', ({ params }) => DeleteItemWithId(params.id), {
    detail: {
      tags: ['Item'],
      summary: 'Delete Item by id',
    },
  })
  .get(
    '/imgauth',
    async () => {
      const auth = getImageKitAuth()
      return auth
    },
    {
      response: {
        200: t.Object({
          token: t.String(),
          expire: t.Number(),
          signature: t.String(),
        }),
      },
    },
  )

// get all items (item menu) / OK
// get item with id /:id OK
// add item /add OK
// delete item /delete/:id
// edit item /edit/:id
// get imageupload permission auth /imgauth
