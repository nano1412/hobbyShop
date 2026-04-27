import Header from '@/components/common/Header'
import { authClient } from '@/lib/auth-client'

import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import {
  Button,
  NativeSelect,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core'
import { Image } from '@mantine/core'
import { itemSchema, type item } from '@/schema/ItemSchema'
import { eden } from '@/lib/eden'
import { uploadToImageKit } from '@/scripts/imagekit-client'
import {
  AdditionalForm,
  Category,
  ColorTone,
  GunplaExclusivity,
  GunplaGrade,
  LiquidProductType,
  Currency,
  PaintApplicationMethod,
  PaintFinish,
  PaintSpecialPorperty,
  ResinType,
} from '@/schema/interface'
import { useNavigate } from '@tanstack/react-router'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

type ItemFormProps = {
  //if itemid = undefined then it is add item, else it is edit
  itemid?: number
}

export default function ItemForm({ itemid }: ItemFormProps) {
  const isEditForm = itemid !== undefined
  const [oldName, setOldName] = useState<string>('')
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const [additionalForm, setAdditionalForm] = useState<AdditionalForm[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const ItemForm = useForm<item>({
    validate: zod4Resolver(itemSchema),
    initialValues: {
      userId: session?.user.id,
      categoryId: 0,
      name: '',
      description: undefined,
      thumbnailPath: undefined,
      imageFile: undefined as File | undefined,
      brand: '',
      stockQty: 0,
      storePriceThb: 0,
      msrpPrice: undefined,
      msrpCurrency: undefined,
      releaseYear: undefined,

      gunplaGrade: undefined,
      gunplaExclusivity: undefined,

      fromSerie: undefined,
      height: undefined,

      liquidProductType: undefined,
      resinType: undefined,
      volumeMl: undefined,

      colorTone: undefined,
      paintSpecialPorperty: undefined,
      paintApplicationMethod: undefined,
      paintFinish: undefined,
    },
  })
  const [previewImage, setPreviewImage] = useState<string | null>('')

  useEffect(() => {
    if (!ItemForm.values.imageFile) return

    const objectUrl = URL.createObjectURL(ItemForm.values.imageFile)
    setPreviewImage(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [ItemForm.values.imageFile])

  const initItemData = async () => {
    if (isEditForm) {
      setLoading(true)
      setError(null)

      const { data, error: requestError } = await eden.api
        .items({ id: itemid.toString() })
        .get()

      if (requestError) {
        setError('Request failed. Check backend server and CORS settings.')
        setLoading(false)
        return
      }
      setOldName(data.name)
      setPreviewImage(data.thumbnailPath ? data.thumbnailPath : previewImage)
      ItemForm.setValues({ ...data, imageFile: undefined })
      setLoading(false)
    }
  }

  useEffect(() => {
    initItemData()
  }, [])

  //caetgory validator
  useEffect(() => {
    const rawCategory = Number(ItemForm.values.categoryId)
    const category = rawCategory as Category
    switch (category) {
      case Category.MODEL_KIT:
        setAdditionalForm([AdditionalForm.FIGURE_COMMON])
        break
      case Category.GUNPLA:
        setAdditionalForm([
          AdditionalForm.BANDAI_GUNPLA_DETAIL,
          AdditionalForm.FIGURE_COMMON,
        ])
        break
      case Category.FIGURE:
        setAdditionalForm([AdditionalForm.FIGURE_COMMON])
        break
      case Category.TOOL:
        setAdditionalForm([])
        break
      case Category.LIQUID_PRODUCT:
        setAdditionalForm([AdditionalForm.LIQUID_PRODUCT])
        break
      case Category.PAINT:
        setAdditionalForm([AdditionalForm.LIQUID_PRODUCT, AdditionalForm.PAINT])
        break
      default:
        setAdditionalForm([])
    }

    //reset field
    //model kit
    if (!additionalForm.includes(AdditionalForm.FIGURE_COMMON)) {
      ItemForm.setValues({
        fromSerie: undefined,
        height: undefined,
      })
    }

    // gunpla
    if (!additionalForm.includes(AdditionalForm.BANDAI_GUNPLA_DETAIL)) {
      ItemForm.setValues({
        gunplaGrade: undefined,
        gunplaExclusivity: undefined,
      })
    }

    if (!additionalForm.includes(AdditionalForm.LIQUID_PRODUCT)) {
      ItemForm.setValues({
        liquidProductType: undefined,
        resinType: undefined,
        volumeMl: undefined,
      })
    }

    if (!additionalForm.includes(AdditionalForm.PAINT)) {
      ItemForm.setValues({
        colorTone: undefined,
        paintSpecialPorperty: undefined,
        paintApplicationMethod: undefined,
        paintFinish: undefined,
      })
    }
  }, [ItemForm.values.categoryId])

  const handleDiscard = () => {
    modals.openConfirmModal({
      title: 'Discard item?',
      centered: true,
      labels: { confirm: 'Discard', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        navigate({ to: '/item-menu' })
      },
    })
  }

  const handleFormSummit = (data: item) => {
    if (isEditForm) {
      handleEditItem(data)
    } else {
      handleAddItem(data)
    }
  }
  const handleEditItem = async (data: item) => {
    modals.openConfirmModal({
      title: 'Edit this item?',
      centered: true,
      labels: { confirm: 'OK', cancel: 'Cancel' },
      onConfirm: async () => {
        try {
          if (isEditForm) {
            if (data.imageFile) {
              const { url, fileId } = await uploadToImageKit(data.imageFile)
              data.thumbnailPath = url
              data.thumbnailId = fileId
            }
            const { imageFile, ...rest } = data

            const { error: requestError } = await eden.api
              .items({ id: itemid.toString() })
              .put({
                ...rest,
                categoryId: Number(data.categoryId),
                userId: session?.user.id,
              })

            if (requestError) {
              console.error('API error', requestError)
              notifications.show({
                title: 'Error!',
                message: 'API request error',
                color: 'red',
              })
              return
            }
            notifications.show({
              title: 'Success!',
              message: 'Edit item success',
            })
            navigate({ to: '/item-menu' })
          }
        } catch (err) {
          console.error(err)
          notifications.show({
            title: 'Error!',
            message: 'The item is failed to upload',
            color: 'red',
          })
        }
      },
    })
  }

  const handleAddItem = async (data: item) => {
    modals.openConfirmModal({
      title: 'Save this item?',
      centered: true,
      labels: { confirm: 'OK', cancel: 'Cancel' },
      onConfirm: async () => {
        try {
          if (data.imageFile) {
            const { url, fileId } = await uploadToImageKit(data.imageFile)
            data.thumbnailPath = url
            data.thumbnailId = fileId
          }
          const { imageFile, ...rest } = data

          const { error: requestError } = await eden.api.items.add.post({
            ...rest,
            categoryId: Number(data.categoryId),
            userId: session?.user.id,
          })

          if (requestError) {
            console.error('API error', requestError)
            notifications.show({
              title: 'Error!',
              message: 'API request error',
              color: 'red',
            })
            return
          }
          notifications.show({ title: 'Success!', message: 'Add item success' })
          navigate({ to: '/item-menu' })
        } catch (err) {
          console.error(err)
          notifications.show({
            title: 'Error!',
            message: 'The item is failed to upload',
            color: 'red',
          })
        }
      },
    })
  }
  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">getting item data...</p>
        </div>
      ) : (
        <div className=" mx-20 p-5 ">
          {isEditForm ? (
            <h1 className="font-bold text-3xl">Editing Item:{oldName}</h1>
          ) : (
            <h1 className="font-bold text-3xl">Creating New Item</h1>
          )}

          <form onSubmit={ItemForm.onSubmit(handleFormSummit)}>
            <div className="bg-gray-50 rounded-2xl drop-shadow-xl p-5 mt-5">
              <h2 className="text-2xl">General Data</h2>
              <div className="grid grid-cols-3 gap-6">
                {/* main form */}
                <div className="col-span-2 space-y-4">
                  <TextInput
                    withAsterisk
                    label="Name"
                    placeholder="your item name"
                    key={ItemForm.key('name')}
                    {...ItemForm.getInputProps('name')}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <NativeSelect
                      label="Category"
                      data={[
                        { label: 'other', value: '1' },
                        { label: 'model kit', value: '2' },
                        { label: 'gunpla', value: '3' },
                        { label: 'figure', value: '4' },
                        { label: 'tool', value: '5' },
                        { label: 'liquid product', value: '6' },
                        { label: 'paint', value: '7' },
                      ]}
                      key={ItemForm.key('categoryId')}
                      {...ItemForm.getInputProps('categoryId')}
                      disabled={isEditForm}
                    />

                    <NumberInput
                      label="Release Year"
                      placeholder="0"
                      key={ItemForm.key('releaseYear')}
                      {...ItemForm.getInputProps('releaseYear')}
                    />
                  </div>

                  <TextInput
                    withAsterisk
                    label="Brand"
                    placeholder="brand"
                    key={ItemForm.key('brand')}
                    {...ItemForm.getInputProps('brand')}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                      withAsterisk
                      label="Stock Quantity"
                      placeholder="0"
                      key={ItemForm.key('stockQty')}
                      {...ItemForm.getInputProps('stockQty')}
                    />
                    <NumberInput
                      withAsterisk
                      label="Store Price (THB)"
                      placeholder="0"
                      key={ItemForm.key('storePriceThb')}
                      {...ItemForm.getInputProps('storePriceThb')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                      label="MSRP"
                      placeholder="0"
                      key={ItemForm.key('msrpPrice')}
                      {...ItemForm.getInputProps('msrpPrice')}
                    />
                    <Select
                      placeholder="please select value"
                      label="MSRP Currency"
                      data={[
                        { label: 'THB', value: Currency.THB },
                        { label: 'JPY', value: Currency.JPY },
                        { label: 'CNY', value: Currency.CNY },
                        { label: 'USD', value: Currency.USD },
                      ]}
                      key={ItemForm.key('msrpCurrency')}
                      {...ItemForm.getInputProps('msrpCurrency')}
                    />
                  </div>
                </div>

                <div>
                  <Dropzone
                    accept={IMAGE_MIME_TYPE}
                    maxFiles={1}
                    multiple={false}
                    onDrop={(files) => {
                      ItemForm.setFieldValue('imageFile', files[0])
                    }}
                    onReject={() =>
                      ItemForm.setFieldError('imageFile', 'Invalid file')
                    }
                    className="max-w-64 max-h-64 min-w-full min-h-3xs bg-gray-200 grid place-items-center overflow-hidden"
                  >
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        className=" h-55 object-contain"
                      />
                    ) : (
                      <div className=" text-center">
                        <p className="font-bold">Upload Item Image</p>
                        <p>Max 25MB</p>
                      </div>
                    )}
                  </Dropzone>
                  <Textarea
                    label="Description"
                    placeholder="description..."
                    key={ItemForm.key('description')}
                    {...ItemForm.getInputProps('description')}
                  />
                </div>
              </div>
            </div>
            {/* additionalForm.length > 0 */}
            {additionalForm.length > 0 && (
              <div className="bg-gray-100 p-5 mt-5 rounded-2xl drop-shadow-xl">
                <h2 className="text-2xl mt-5">Additional Detail</h2>
                {/* additionalForm.includes("figure_common") */}
                {additionalForm.includes(AdditionalForm.FIGURE_COMMON) && (
                  <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                    <h2> Figure Common</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        label="From Serie"
                        placeholder="Serie..."
                        key={ItemForm.key('fromSerie')}
                        {...ItemForm.getInputProps('fromSerie')}
                      />

                      <NumberInput
                        label="Height (CM)"
                        placeholder="value"
                        key={ItemForm.key('height')}
                        {...ItemForm.getInputProps('height')}
                      />
                    </div>
                  </div>
                )}
                {/* additionalForm.includes("bandai_gunpla_detail") */}
                {additionalForm.includes(
                  AdditionalForm.BANDAI_GUNPLA_DETAIL,
                ) && (
                  <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                    <h2> Gunpla Detail</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        placeholder="please select value"
                        label="Gunpla Grade"
                        data={Object.values(GunplaGrade)}
                        key={ItemForm.key('gunplaGrade')}
                        {...ItemForm.getInputProps('gunplaGrade')}
                      />

                      <Select
                        placeholder="please select value"
                        label="Exclusivity"
                        data={[
                          { label: 'none', value: GunplaExclusivity.none },
                          {
                            label: 'gundam base limited',
                            value: GunplaExclusivity.gundam_base_limited,
                          },
                          {
                            label: 'p-bandai',
                            value: GunplaExclusivity.p_bandai,
                          },
                          { label: 'event', value: GunplaExclusivity.event },
                          {
                            label: 'special package',
                            value: GunplaExclusivity.special_package,
                          },
                        ]}
                        key={ItemForm.key('gunplaExclusivity')}
                        {...ItemForm.getInputProps('gunplaExclusivity')}
                      />
                    </div>
                  </div>
                )}
                {/* liquid_product */}
                {additionalForm.includes(AdditionalForm.LIQUID_PRODUCT) && (
                  <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                    <h2>Liquid Product</h2>
                    <div className="grid grid-cols-3 gap-4">
                      <Select
                        placeholder="please select value"
                        label="Liquid Product Type"
                        data={Object.values(LiquidProductType)}
                        key={ItemForm.key('liquidProductType')}
                        {...ItemForm.getInputProps('liquidProductType')}
                      />
                      <Select
                        placeholder="please select value"
                        label="Resin Type"
                        data={Object.values(ResinType)}
                        key={ItemForm.key('resinType')}
                        {...ItemForm.getInputProps('resinType')}
                      />
                      <NumberInput
                        label="Volume (ML)"
                        placeholder="value"
                        key={ItemForm.key('volumeMl')}
                        {...ItemForm.getInputProps('volumeMl')}
                      />
                    </div>
                  </div>
                )}
                {/* paint */}
                {additionalForm.includes(AdditionalForm.PAINT) && (
                  <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                    <h2>Paint detail</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        placeholder="please select value"
                        label="Color Tone"
                        data={Object.values(ColorTone)}
                        key={ItemForm.key('colorTone')}
                        {...ItemForm.getInputProps('colorTone')}
                      />
                      <Select
                        placeholder="please select value"
                        label="Paint Special Porperty"
                        data={Object.values(PaintSpecialPorperty)}
                        key={ItemForm.key('paintSpecialPorperty')}
                        {...ItemForm.getInputProps('paintSpecialPorperty')}
                      />
                      <Select
                        placeholder="please select value"
                        label="Paint Application Method"
                        data={[
                          {
                            label: 'other',
                            value: PaintApplicationMethod.other,
                          },
                          {
                            label: 'spray',
                            value: PaintApplicationMethod.spray,
                          },
                          {
                            label: 'brush',
                            value: PaintApplicationMethod.brush,
                          },
                          {
                            label: 'airbrush ready',
                            value: PaintApplicationMethod.air_brush_ready,
                          },
                          {
                            label: 'panel liner',
                            value: PaintApplicationMethod.panel_liner,
                          },
                        ]}
                        key={ItemForm.key('paintApplicationMethod')}
                        {...ItemForm.getInputProps('paintApplicationMethod')}
                      />
                      <Select
                        placeholder="please select value"
                        label="Paint Finish"
                        data={[
                          { label: 'other', value: PaintFinish.other },
                          {
                            label: 'gloss',
                            value: PaintFinish.gloss,
                          },
                          {
                            label: 'semi gloss',
                            value: PaintFinish.semi_gloss,
                          },
                          { label: 'satin', value: PaintFinish.satin },
                          {
                            label: 'matte',
                            value: PaintFinish.matte,
                          },
                        ]}
                        key={ItemForm.key('paintFinish')}
                        {...ItemForm.getInputProps('paintFinish')}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button className="my-4 mr-5" color="red" onClick={handleDiscard}>
                Discard
              </Button>

              <Button className="my-4" type="submit">
                Save
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
