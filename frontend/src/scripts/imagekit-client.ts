import { eden } from '@/lib/eden'
import ImageKit from 'imagekit-javascript'

const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL!,
})

type imgAuthResponse = NonNullable<
  Awaited<ReturnType<typeof eden.api.items.imgauth.get>>['data']
>

export async function uploadToImageKit(file: File) {
  // 1. get auth from server function
  const response = await eden.api.items.imgauth.get()

  const data: imgAuthResponse = response.data

  // 2. upload
  const result = await imagekit.upload({
    file,
    fileName: file.name,
    token: data.token,
    expire: data.expire,
    signature: data.signature,
  })

  return {
    url: result.url,
    fileId: result.fileId,
  }
}
