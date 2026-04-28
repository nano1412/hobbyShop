import Header from '@/components/common/Header'
import { authClient } from '@/lib/auth-client'

import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import {
  Button,
  LoadingOverlay,
  NativeSelect,
  NumberInput,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core'
import { Image } from '@mantine/core'
import { itemSchema, type item } from '@/schema/itemSchema'
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
  const [fetchItemDataLoading, setFetchItemDataLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const itemForm = useForm<item>({
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
    if (!itemForm.values.imageFile) return

    const objectUrl = URL.createObjectURL(itemForm.values.imageFile)
    setPreviewImage(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [itemForm.values.imageFile])

  const initItemData = async () => {
    if (isEditForm) {
      setFetchItemDataLoading(true)
      setError(null)

      const { data, error: requestError } = await eden.api
        .items({ id: itemid.toString() })
        .get()

      if (requestError) {
        setError('Request failed. Check backend server and CORS settings.')
        setFetchItemDataLoading(false)
        return
      }
      setOldName(data.name)
      setPreviewImage(data.thumbnailPath ? data.thumbnailPath : previewImage)
      itemForm.setValues({
        ...itemForm.values, // keep existing values like userId
        ...data,
        imageFile: undefined,
      })
      setFetchItemDataLoading(false)
    }
  }

  useEffect(() => {
    initItemData()
  }, [])

  //caetgory validator
  useEffect(() => {
    const rawCategory = Number(itemForm.values.categoryId)
    const category = rawCategory as Category

    let nextForms: AdditionalForm[] = []

    switch (category) {
      case Category.MODEL_KIT:
        nextForms = [AdditionalForm.FIGURE_COMMON]
        break
      case Category.GUNPLA:
        nextForms = [
          AdditionalForm.BANDAI_GUNPLA_DETAIL,
          AdditionalForm.FIGURE_COMMON,
        ]
        break
      case Category.FIGURE:
        nextForms = [AdditionalForm.FIGURE_COMMON]
        break
      case Category.TOOL:
        nextForms = []
        break
      case Category.LIQUID_PRODUCT:
        nextForms = [AdditionalForm.LIQUID_PRODUCT]
        break
      case Category.PAINT:
        nextForms = [AdditionalForm.LIQUID_PRODUCT, AdditionalForm.PAINT]
        break
      default:
        nextForms = []
    }

    setAdditionalForm(nextForms)

    if (!nextForms.includes(AdditionalForm.FIGURE_COMMON)) {
      itemForm.setValues({
        fromSerie: undefined,
        height: undefined,
      })
    }

    if (!nextForms.includes(AdditionalForm.BANDAI_GUNPLA_DETAIL)) {
      itemForm.setValues({
        gunplaGrade: undefined,
        gunplaExclusivity: undefined,
      })
    }

    if (!nextForms.includes(AdditionalForm.LIQUID_PRODUCT)) {
      itemForm.setValues({
        liquidProductType: undefined,
        resinType: undefined,
        volumeMl: undefined,
      })
    }

    if (!nextForms.includes(AdditionalForm.PAINT)) {
      itemForm.setValues({
        colorTone: undefined,
        paintSpecialPorperty: undefined,
        paintApplicationMethod: undefined,
        paintFinish: undefined,
      })
    }
  }, [itemForm.values.categoryId])

  const handleDiscard = () => {
    modals.openConfirmModal({
      title: 'Discard item?',
      centered: true,
      labels: { confirm: 'Discard', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        navigate({ to: '/' })
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
  const handleEditItem = (data: item) => {
    modals.openConfirmModal({
      title: 'Edit this item?',
      centered: true,
      labels: { confirm: 'OK', cancel: 'Cancel' },
      onConfirm: async () => {
        try {
          setSubmitLoading(true)
          setError(null)
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
              setError(
                'Request failed. Check backend server and CORS settings.',
              )
              setSubmitLoading(false)
              console.error('API error', requestError)
              notifications.show({
                title: 'Error!',
                message: 'API request error',
                color: 'red',
              })
              return
            }
            notifications.show({
              color: 'green',
              title: 'Success!',
              message: 'Edit item success',
            })
            setSubmitLoading(false)
            navigate({ to: '/' })
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

  const handleAddItem = (data: item) => {
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
          notifications.show({
            color: 'green',
            title: 'Success!',
            message: 'Add item success',
          })
          navigate({ to: '/' })
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
      {fetchItemDataLoading || submitLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">
            {fetchItemDataLoading ? 'Getting item data...' : 'Saving item...'}
          </p>
        </div>
      ) : (
        <div className=" mx-20 p-5 ">
          {isEditForm ? (
            <h1 className="font-bold text-3xl">Editing Item:{oldName}</h1>
          ) : (
            <h1 className="font-bold text-3xl">Creating New Item</h1>
          )}
          <form onSubmit={itemForm.onSubmit(handleFormSummit)}>
            <div className="bg-gray-50 rounded-2xl drop-shadow-xl p-5 mt-5">
              <h2 className="text-2xl">General Data</h2>
              <div className="grid grid-cols-3 gap-6">
                {/* main form */}
                <div className="col-span-2 space-y-4">
                  <TextInput
                    withAsterisk
                    label="Name"
                    placeholder="your item name"
                    key={itemForm.key('name')}
                    {...itemForm.getInputProps('name')}
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
                      key={itemForm.key('categoryId')}
                      {...itemForm.getInputProps('categoryId')}
                      disabled={isEditForm}
                    />

                    <NumberInput
                      label="Release Year"
                      placeholder="0"
                      key={itemForm.key('releaseYear')}
                      {...itemForm.getInputProps('releaseYear')}
                    />
                  </div>

                  <TextInput
                    withAsterisk
                    label="Brand"
                    placeholder="brand"
                    key={itemForm.key('brand')}
                    {...itemForm.getInputProps('brand')}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                      withAsterisk
                      label="Stock Quantity"
                      placeholder="0"
                      key={itemForm.key('stockQty')}
                      {...itemForm.getInputProps('stockQty')}
                    />
                    <NumberInput
                      withAsterisk
                      label="Store Price (THB)"
                      placeholder="0"
                      key={itemForm.key('storePriceThb')}
                      {...itemForm.getInputProps('storePriceThb')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                      label="MSRP"
                      placeholder="0"
                      key={itemForm.key('msrpPrice')}
                      {...itemForm.getInputProps('msrpPrice')}
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
                      key={itemForm.key('msrpCurrency')}
                      {...itemForm.getInputProps('msrpCurrency')}
                    />
                  </div>
                </div>

                <div>
                  <Dropzone
                    accept={IMAGE_MIME_TYPE}
                    maxFiles={1}
                    multiple={false}
                    onDrop={(files) => {
                      itemForm.setFieldValue('imageFile', files[0])
                    }}
                    onReject={() =>
                      itemForm.setFieldError('imageFile', 'Invalid file')
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
                    key={itemForm.key('description')}
                    {...itemForm.getInputProps('description')}
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
                        key={itemForm.key('fromSerie')}
                        {...itemForm.getInputProps('fromSerie')}
                      />

                      <NumberInput
                        label="Height (CM)"
                        placeholder="value"
                        key={itemForm.key('height')}
                        {...itemForm.getInputProps('height')}
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
                        key={itemForm.key('gunplaGrade')}
                        {...itemForm.getInputProps('gunplaGrade')}
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
                        key={itemForm.key('gunplaExclusivity')}
                        {...itemForm.getInputProps('gunplaExclusivity')}
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
                        key={itemForm.key('liquidProductType')}
                        {...itemForm.getInputProps('liquidProductType')}
                      />
                      <Select
                        placeholder="please select value"
                        label="Resin Type"
                        data={Object.values(ResinType)}
                        key={itemForm.key('resinType')}
                        {...itemForm.getInputProps('resinType')}
                      />
                      <NumberInput
                        label="Volume (ML)"
                        placeholder="value"
                        key={itemForm.key('volumeMl')}
                        {...itemForm.getInputProps('volumeMl')}
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
                        key={itemForm.key('colorTone')}
                        {...itemForm.getInputProps('colorTone')}
                      />
                      <Select
                        placeholder="please select value"
                        label="Paint Special Porperty"
                        data={Object.values(PaintSpecialPorperty)}
                        key={itemForm.key('paintSpecialPorperty')}
                        {...itemForm.getInputProps('paintSpecialPorperty')}
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
                        key={itemForm.key('paintApplicationMethod')}
                        {...itemForm.getInputProps('paintApplicationMethod')}
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
                        key={itemForm.key('paintFinish')}
                        {...itemForm.getInputProps('paintFinish')}
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
