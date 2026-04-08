import Header from '@/components/common/Header'
import { authClient } from '@/lib/auth-client'
import { addItemSchema, type addItem } from '@/schema/ItemSchema'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import {
  Button,
  NativeSelect,
  NumberInput,
  Textarea,
  TextInput,
} from '@mantine/core'
import { Image } from '@mantine/core'

export const Route = createFileRoute('/addItem')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: session } = authClient.useSession()
  const [additionalForm, setAdditionalForm] = useState<string[]>([])

  const addItemForm = useForm<addItem>({
    validate: zod4Resolver(addItemSchema),
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
      msrpPrice: 0,
      msrpCurrency: 'JPY',
      releaseYear: 0,

      gunplaGrade: 'other',
      gunplaExclusivity: 'none',

      fromSerie: '',
      height: 0,

      liquidProductType: 'other',
      resinType: 'none',
      volumeMl: 0,

      colorTone: 'other',
      paintSpecialPorperty: 'none',
      paintApplicationMethod: 'other',
      paintFinish: 'other',
    },
  })
  const preview = addItemForm.values.imageFile
    ? URL.createObjectURL(addItemForm.values.imageFile)
    : null

  useEffect(() => {
    console.log(preview)
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  //caetgory validator
  // dont forgot to add new category
  useEffect(() => {
    const category = Number(addItemForm.values.categoryId)
    switch (category) {
      case 2: //model kit
        console.log('this is model kit')
        setAdditionalForm(['figure_common'])
        break
      case 3: // gunpla
        console.log('this is gunpla')
        setAdditionalForm(['bandai_gunpla_detail', 'figure_common'])
        break
      case 4: // figure
        console.log('this is figure')
        setAdditionalForm(['figure_common'])
        break
      case 5: // tool
        console.log('this is tool')
        setAdditionalForm([])
        break
      case 6: // liquid_product
        console.log('this is liquid_product')
        setAdditionalForm(['liquid_product'])
        break
      case 7: // paint
        console.log('this is paint')
        setAdditionalForm(['liquid_product', 'paint'])
        break
      case 99: // debug_show_all
        console.log('this is debug')
        setAdditionalForm([
          'bandai_gunpla_detail',
          'figure_common',
          'liquid_product',
          'paint',
        ])
        break
      default:
        console.log('other')
        setAdditionalForm([])
    }

    //reset field
    //model kit
    if (!additionalForm.includes('figure_common')) {
      addItemForm.setValues({
        fromSerie: '',
        height: 0,
      })
    }

    // gunpla
    if (!additionalForm.includes('bandai_gunpla_detail')) {
      addItemForm.setValues({
        gunplaGrade: 'other',
        gunplaExclusivity: 'none',
      })
    }
  }, [addItemForm.values.categoryId])

  return (
    <>
      <Header />
      <div className=" mx-20 p-5 ">
        <h1 className="text-3xl">Creating New Item</h1>

        <form>
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
                  <NativeSelect
                    label="MSRP Currency"
                    data={[
                      { label: 'THB', value: 'THB' },
                      { label: 'JPY', value: 'JPY' },
                      { label: 'CNY', value: 'CNY' },
                      { label: 'USD', value: 'USD' },
                    ]}
                    key={addItemForm.key('msrpCurrency')}
                    {...addItemForm.getInputProps('msrpCurrency')}
                  />
                </div>
              </div>
              {/* img and description */}
              <div>
                {/* img */}
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
              {additionalForm.includes('figure_common') && (
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
                      label="Height in cm"
                      placeholder="0"
                      key={addItemForm.key('height')}
                      {...addItemForm.getInputProps('height')}
                    />
                  </div>
                </div>
              )}
              {/* additionalForm.includes("bandai_gunpla_detail") */}
              {additionalForm.includes('bandai_gunpla_detail') && (
                <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                  <h2> Gunpla Detail</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <NativeSelect
                      label="Gunpla Grade"
                      data={[
                        'other',
                        'NG',
                        'SD',
                        'EG',
                        'HG',
                        'MG',
                        'PG',

                        'RE100',
                        'FM',
                        'MGSD',
                        'MEGA',
                      ]}
                      key={addItemForm.key('gunplaGrade')}
                      {...addItemForm.getInputProps('gunplaGrade')}
                    />

                    <NativeSelect
                      label="Exclusivity"
                      data={[
                        { label: 'none', value: 'none' },
                        {
                          label: 'Gundam Base Limited',
                          value: 'gundam_base_limited',
                        },
                        { label: 'P Bandai', value: 'p_bandai' },
                        { label: 'Event', value: 'event' },
                        {
                          label: 'Special Package',
                          value: 'special_package',
                        },
                      ]}
                      key={addItemForm.key('gunplaExclusivity')}
                      {...addItemForm.getInputProps('gunplaExclusivity')}
                    />
                  </div>
                </div>
              )}
              {/* liquid_product */}
              {additionalForm.includes('liquid_product') && (
                <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                  <h2>Liquid Product</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <NativeSelect
                      label="Liquid Product Type"
                      data={[
                        { label: 'other', value: 'other' },
                        {
                          label: 'paint',
                          value: 'paint',
                        },
                        { label: 'primer', value: 'primer' },
                        { label: 'solvent', value: 'solvent' },
                        {
                          label: 'thinner',
                          value: 'thinner',
                        },
                        {
                          label: 'cement',
                          value: 'cement',
                        },
                      ]}
                      key={addItemForm.key('liquidProductType')}
                      {...addItemForm.getInputProps('liquidProductType')}
                    />
                    <NativeSelect
                      label="Resin Type"
                      data={[
                        { label: 'none', value: 'none' },
                        {
                          label: 'acrylic',
                          value: 'acrylic',
                        },
                        { label: 'lacquer', value: 'lacquer' },
                        { label: 'enamel', value: 'enamel' },
                        {
                          label: 'epoxy',
                          value: 'epoxy',
                        },
                      ]}
                      key={addItemForm.key('resinType')}
                      {...addItemForm.getInputProps('resinType')}
                    />
                    <NumberInput
                      label="Volumn in ml"
                      placeholder="0"
                      key={addItemForm.key('volumeMl')}
                      {...addItemForm.getInputProps('volumeMl')}
                    />
                  </div>
                </div>
              )}
              {/* paint */}
              {additionalForm.includes('paint') && (
                <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                  <h2>Paint detail</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <NativeSelect
                      label="Color Tone"
                      data={[
                        { label: 'other', value: 'other' },
                        { label: 'red', value: 'red' },
                        { label: 'orange', value: 'orange' },
                        { label: 'yellow', value: 'yellow' },
                        { label: 'green', value: 'green' },
                        { label: 'cyan', value: 'cyan' },
                        { label: 'blue', value: 'blue' },
                        { label: 'purple', value: 'purple' },
                        { label: 'black', value: 'black' },
                        { label: 'white', value: 'white' },
                        { label: 'gray', value: 'gray' },
                        { label: 'pink', value: 'pink' },
                        { label: 'brown', value: 'brown' },
                        { label: 'gold', value: 'gold' },
                        { label: 'silver', value: 'silver' },
                        { label: 'copper', value: 'copper' },
                      ]}
                      key={addItemForm.key('colorTone')}
                      {...addItemForm.getInputProps('colorTone')}
                    />
                    <NativeSelect
                      label="Paint Special Porperty"
                      data={[
                        { label: 'none', value: 'none' },
                        {
                          label: 'clear',
                          value: 'clear',
                        },
                        { label: 'metalic', value: 'metalic' },
                      ]}
                      key={addItemForm.key('paintSpecialPorperty')}
                      {...addItemForm.getInputProps('paintSpecialPorperty')}
                    />
                    <NativeSelect
                      label="Paint Application Method"
                      data={[
                        { label: 'other', value: 'other' },
                        {
                          label: 'spray',
                          value: 'spray',
                        },
                        { label: 'brush', value: 'brush' },
                        {
                          label: 'air_brush_ready',
                          value: 'air_brush_ready',
                        },
                        {
                          label: 'panel_liner',
                          value: 'panel_liner',
                        },
                      ]}
                      key={addItemForm.key('paintApplicationMethod')}
                      {...addItemForm.getInputProps('paintApplicationMethod')}
                    />
                    <NativeSelect
                      label="Paint Finish"
                      data={[
                        { label: 'other', value: 'other' },
                        {
                          label: 'gloss',
                          value: 'gloss',
                        },
                        { label: 'semi_gloss', value: 'semi_gloss' },
                        { label: 'satin', value: 'satin' },
                        {
                          label: 'matte',
                          value: 'matte',
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
            <Button className="my-4 mr-5" color="red">
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
