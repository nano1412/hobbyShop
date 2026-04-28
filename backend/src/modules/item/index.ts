import Elysia, { t } from 'elysia'
import {
  CreateItem,
  DeleteItemWithId,
  FetchItems,
  FetchItemWithId,
  UpdateItem,
} from '@/services/item.service'
import { getImageKitAuth } from '@/services/imageKit.service'
import { ResponseItemModel } from './model/responseItem.model'
import { AddItemModel } from './model/addItem.model'
import { EditItemModel } from './model/editItem.model'

export const itemModule = new Elysia({
  name: 'module.items',
  prefix: '/api/items',
})
  .get('/:id', ({ params }) => FetchItemWithId(Number(params.id)), {
    detail: {
      tags: ['Item'],
      summary: 'Get Item by id',
    },
    response: {
      200: ResponseItemModel,
    },
  })
  .get(
    '/',
    async ({ query }) => {
      const processedQuery: ItemQuery = {
        page: query.page ? parseInt(query.page) : undefined,
        limit: query.limit ? parseInt(query.limit) : undefined,
        search: query.search,
        sort: query.sort,
        order: query.order,
        categoryIds: query.categoryIds
          ? query.categoryIds.split(',').map((id) => Number(id))
          : undefined,
      }
      const result = await FetchItems(processedQuery)
      return result
    },
    {
      detail: {
        tags: ['Item'],
        summary: 'Get Items list',
      },
      response: {
        200: t.Object({
          data: t.Array(ResponseItemModel),
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
      CreateItem(body)
    },
    {
      body: AddItemModel,
      detail: {
        tags: ['Item'],
        summary: 'add new item',
      },
    },
  )
  .delete('/:id', ({ params }) => DeleteItemWithId(Number(params.id)), {
    detail: {
      tags: ['Item'],
      summary: 'Delete Item by id',
    },
  })
  .put('/:id', ({ params, body }) => UpdateItem(Number(params.id), body), {
    body: EditItemModel,
    detail: {
      tags: ['Item'],
      summary: 'edit item',
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
