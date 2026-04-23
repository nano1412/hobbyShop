import prisma from '@/lib/db'
import { FetchItemWithId } from './readItem.service'
import { deleteImage } from './imageKit.service'

export const DeleteItemWithId = async (id: string) => {
  try {
    const itemToDelete = await FetchItemWithId(id)
    if (itemToDelete.thumbnailId) {
      try {
        await deleteImage(itemToDelete.thumbnailId)
      } catch (err) {
        console.error('Failed to delete image:', err)
      }
    }
    await prisma.item.delete({
      where: { id: Number(id) },
    })
    console.log('Deleted item with id', id)
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}
