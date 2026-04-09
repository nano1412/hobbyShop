import Elysia, { t } from 'elysia'
import { ItemModel } from './model'
import { itemTemp } from './itemTemp'
import { AddItem } from '@/scripts/addItem'
import { getImageKitAuth } from '@/scripts/imagekit-uploadimg'

export const itemModule = new Elysia({
  name: 'module.items',
  prefix: '/api/items',
})
  .get('/:id', ({ params }) => itemTemp.testItem(params.id), {
    detail: {
      tags: ['Item'],
      summary: 'Get Item by id',
    },
    response: {
      200: ItemModel,
    },
  })
  .get('/', () => itemTemp.testItems(), {
    detail: {
      tags: ['Item'],
      summary: 'Get Items list',
    },
    response: {
      200: t.Array(ItemModel),
    },
  })
  .post(
    '/add',
    ({ body }) => {
      console.log('data recrive (pass validation)')
      console.log(body)
      //write on to db (prisma)
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
  .get(
    '/imgauth',
    async () => {
      const auth = getImageKitAuth()
      console.log(auth)
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
