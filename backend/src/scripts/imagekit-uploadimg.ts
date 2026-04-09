import ImageKit from 'imagekit'
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL!,
})

export const getImageKitAuth = () => {
  console.log('on imagekit server')
  return imagekit.getAuthenticationParameters()
}
