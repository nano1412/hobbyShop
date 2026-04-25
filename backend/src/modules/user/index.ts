import prisma from '@/lib/db'
import { Elysia } from 'elysia'

export const userModule = new Elysia().get(
  '/user/:id/username',
  async ({ params, set }) => {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        username: true,
      },
    })

    if (!user) {
      set.status = 404
      return { message: 'User not found' }
    }
    return user.username
  },
)
