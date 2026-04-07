import Header from '@/components/common/Header'
import { authClient } from '@/lib/auth-client'
import { addItemSchema, type addItem } from '@/schema/ItemSchema'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import {
  Button,
  NativeSelect,
  NumberInput,
  Textarea,
  TextInput,
} from '@mantine/core'

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

  //caetgory validator
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
      <div>
        <h1>Creating New Item</h1>
        <div>
          <form>
            <div>
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
                  <></>
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
            {true && (
              <div>
                <h2>Additional Detail</h2>
                {/* additionalForm.includes("figure_common") */}
                {true && (
                  <div>
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
                {true && (
                  <div>
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
                {true && (
                  <div>
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
                {true && (
                  <div>
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
                        label="paintSpecialPorperty"
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

            <Button className="my-4" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
