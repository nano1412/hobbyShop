import prisma from '@/lib/db'

export const DeleteItemWithId = async (id: string) => {
  try {
    await prisma.item.delete({
      where: { id: Number(id) },
    })
    console.log('Deleted item with id', id)
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}
