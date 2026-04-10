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
  MsrpCurrency,
  PaintApplicationMethod,
  PaintFinish,
  PaintSpecialPorperty,
  ResinType,
} from '@/schema/interface'
import { useNavigate } from '@tanstack/react-router'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

export default function AddItem() {
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const [additionalForm, setAdditionalForm] = useState<AdditionalForm[]>([])

  const addItemForm = useForm<item>({
    validate: zod4Resolver(itemSchema),
    initialValues: {
      userId: session?.user.id,
      categoryId: 0,
      name: '',
      description: '',
      thumbnailPath: '',
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
  const preview = addItemForm.values.imageFile
    ? URL.createObjectURL(addItemForm.values.imageFile)
    : null

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  //caetgory validator
  useEffect(() => {
    const rawCategory = Number(addItemForm.values.categoryId)
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
      addItemForm.setValues({
        fromSerie: undefined,
        height: undefined,
      })
    }

    // gunpla
    if (!additionalForm.includes(AdditionalForm.BANDAI_GUNPLA_DETAIL)) {
      addItemForm.setValues({
        gunplaGrade: undefined,
        gunplaExclusivity: undefined,
      })
    }

    if (!additionalForm.includes(AdditionalForm.LIQUID_PRODUCT)) {
      addItemForm.setValues({
        liquidProductType: undefined,
        resinType: undefined,
        volumeMl: undefined,
      })
    }

    if (!additionalForm.includes(AdditionalForm.PAINT)) {
      addItemForm.setValues({
        colorTone: undefined,
        paintSpecialPorperty: undefined,
        paintApplicationMethod: undefined,
        paintFinish: undefined,
      })
    }
  }, [addItemForm.values.categoryId])

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
      <Header />
      <div className=" mx-20 p-5 ">
        <h1 className="text-3xl">Creating New Item</h1>

        <form onSubmit={addItemForm.onSubmit(handleAddItem)}>
          <div className="bg-gray-50 rounded-2xl drop-shadow-xl p-5 mt-5">
            <h2>General Data</h2>
            <div className="grid grid-cols-3 gap-6">
              {/* main form */}
              <div className="col-span-2 space-y-4">
                <TextInput
                  withAsterisk
                  label="Name"
                  placeholder="your item name"
                  key={addItemForm.key('name')}
                  {...addItemForm.getInputProps('name')}
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
                      { label: 'debug_show_all', value: '99' },
                    ]}
                    key={addItemForm.key('categoryId')}
                    {...addItemForm.getInputProps('categoryId')}
                  ></NativeSelect>

                  <NumberInput
                    label="Release Year"
                    placeholder="0"
                    key={addItemForm.key('releaseYear')}
                    {...addItemForm.getInputProps('releaseYear')}
                  />
                </div>

                <TextInput
                  withAsterisk
                  label="Brand"
                  placeholder="brand"
                  key={addItemForm.key('brand')}
                  {...addItemForm.getInputProps('brand')}
                />

                <div className="grid grid-cols-2 gap-4">
                  <NumberInput
                    withAsterisk
                    label="Stock Quantity"
                    placeholder="0"
                    key={addItemForm.key('stockQty')}
                    {...addItemForm.getInputProps('stockQty')}
                  />
                  <NumberInput
                    withAsterisk
                    label="Store Price (THB)"
                    placeholder="0"
                    key={addItemForm.key('storePriceThb')}
                    {...addItemForm.getInputProps('storePriceThb')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <NumberInput
                    label="MSRP"
                    placeholder="0"
                    key={addItemForm.key('msrpPrice')}
                    {...addItemForm.getInputProps('msrpPrice')}
                  />
                  <Select
                    placeholder="please select value"
                    label="MSRP Currency"
                    data={[
                      { label: 'THB', value: MsrpCurrency.THB },
                      { label: 'JPY', value: MsrpCurrency.JPY },
                      { label: 'CNY', value: MsrpCurrency.CNY },
                      { label: 'USD', value: MsrpCurrency.USD },
                    ]}
                    key={addItemForm.key('msrpCurrency')}
                    {...addItemForm.getInputProps('msrpCurrency')}
                  />
                </div>
              </div>

              <div>
                <Dropzone
                  accept={IMAGE_MIME_TYPE}
                  maxFiles={1}
                  multiple={false}
                  onDrop={(files) => {
                    addItemForm.setFieldValue('imageFile', files[0])
                  }}
                  onReject={() =>
                    addItemForm.setFieldError('imageFile', 'Invalid file')
                  }
                  className="max-w-64 max-h-64 min-w-full min-h-3xs bg-gray-200 grid place-items-center overflow-hidden"
                >
                  {preview ? (
                    <Image src={preview} className=" h-55 object-contain" />
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
                  key={addItemForm.key('description')}
                  {...addItemForm.getInputProps('description')}
                />
              </div>
            </div>
          </div>
          {/* additionalForm.length > 0 */}
          {additionalForm.length > 0 && (
            <div className="bg-gray-100 p-5 mt-5 rounded-2xl drop-shadow-xl">
              <h2 className="text-3xl mt-5">Additional Detail</h2>
              {/* additionalForm.includes("figure_common") */}
              {additionalForm.includes(AdditionalForm.FIGURE_COMMON) && (
                <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                  <h2> Figure Common</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      label="From Serie"
                      placeholder="Serie..."
                      key={addItemForm.key('fromSerie')}
                      {...addItemForm.getInputProps('fromSerie')}
                    />

                    <NumberInput
                      label="Height (CM)"
                      placeholder="value"
                      key={addItemForm.key('height')}
                      {...addItemForm.getInputProps('height')}
                    />
                  </div>
                </div>
              )}
              {/* additionalForm.includes("bandai_gunpla_detail") */}
              {additionalForm.includes(AdditionalForm.BANDAI_GUNPLA_DETAIL) && (
                <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                  <h2> Gunpla Detail</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      placeholder="please select value"
                      label="Gunpla Grade"
                      data={Object.values(GunplaGrade)}
                      key={addItemForm.key('gunplaGrade')}
                      {...addItemForm.getInputProps('gunplaGrade')}
                    />

                    <Select
                      placeholder="please select value"
                      label="Exclusivity"
                      data={[
                        { label: 'none', value: GunplaExclusivity.NONE },
                        {
                          label: 'gundam base limited',
                          value: GunplaExclusivity.GUNDAM_BASE_LIMITED,
                        },
                        {
                          label: 'p-bandai',
                          value: GunplaExclusivity.P_BANDAI,
                        },
                        { label: 'event', value: GunplaExclusivity.EVENT },
                        {
                          label: 'special package',
                          value: GunplaExclusivity.SPECIAL_PACHAGE,
                        },
                      ]}
                      key={addItemForm.key('gunplaExclusivity')}
                      {...addItemForm.getInputProps('gunplaExclusivity')}
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
                      key={addItemForm.key('liquidProductType')}
                      {...addItemForm.getInputProps('liquidProductType')}
                    />
                    <Select
                      placeholder="please select value"
                      label="Resin Type"
                      data={Object.values(ResinType)}
                      key={addItemForm.key('resinType')}
                      {...addItemForm.getInputProps('resinType')}
                    />
                    <NumberInput
                      label="Volume (ML)"
                      placeholder="value"
                      key={addItemForm.key('volumeMl')}
                      {...addItemForm.getInputProps('volumeMl')}
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
                      key={addItemForm.key('colorTone')}
                      {...addItemForm.getInputProps('colorTone')}
                    />
                    <Select
                      placeholder="please select value"
                      label="Paint Special Porperty"
                      data={Object.values(PaintSpecialPorperty)}
                      key={addItemForm.key('paintSpecialPorperty')}
                      {...addItemForm.getInputProps('paintSpecialPorperty')}
                    />
                    <Select
                      placeholder="please select value"
                      label="Paint Application Method"
                      data={[
                        { label: 'other', value: PaintApplicationMethod.OTHER },
                        {
                          label: 'spray',
                          value: PaintApplicationMethod.SPRAY,
                        },
                        { label: 'brush', value: PaintApplicationMethod.BRUSH },
                        {
                          label: 'airbrush ready',
                          value: PaintApplicationMethod.AIR_BRUSH_READY,
                        },
                        {
                          label: 'panel liner',
                          value: PaintApplicationMethod.PANEL_LINER,
                        },
                      ]}
                      key={addItemForm.key('paintApplicationMethod')}
                      {...addItemForm.getInputProps('paintApplicationMethod')}
                    />
                    <Select
                      placeholder="please select value"
                      label="Paint Finish"
                      data={[
                        { label: 'other', value: PaintFinish.OTHER },
                        {
                          label: 'gloss',
                          value: PaintFinish.GLOSS,
                        },
                        { label: 'semi gloss', value: PaintFinish.SEMI_GLOSS },
                        { label: 'satin', value: PaintFinish.SATIN },
                        {
                          label: 'matte',
                          value: PaintFinish.MATTE,
                        },
                      ]}
                      key={addItemForm.key('paintFinish')}
                      {...addItemForm.getInputProps('paintFinish')}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <Button className="my-4 mr-5" color="red" onClick={handleDiscard}>
              Discard
            </Button>

            <Button className="my-4" type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
