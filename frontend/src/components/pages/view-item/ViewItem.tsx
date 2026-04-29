import Header from '@/components/common/Header'
import { eden } from '@/lib/eden'

import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import DataWithLabel from './DataWithLabel'
import { CategoryPill } from '../item-menu/CategoryPill'
import { Button, Center, Image } from '@mantine/core'
import { IconPhotoOff } from '@tabler/icons-react'
import type { itemResponse } from '@/scripts/type'

export default function ViewItemUI() {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/view-item/$id' })
  const [loading, setLoading] = useState(false)
  const [resultItem, setResultItem] = useState<itemResponse | null>({
    id: 0,
    categoryId: 0,
    name: '',
    description: '',
    thumbnailPath: '',
    thumbnailId: '',
    brand: '',
    stockQty: 0,
    storePriceThb: 0,
    msrpPrice: 0,
    msrpCurrency: '',
    releaseYear: 0,
    createdAt: '',
    createdBy: '',
    updatedAt: '',
    updatedBy: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [createdItemUser, setCreatedItemUser] = useState<string>('')
  const [updatedItemUser, setUpdatedItemUser] = useState<string>('')
  const callItem = async () => {
    setLoading(true)
    setError(null)

    const { data, error: requestError } = await eden.api.items({ id: id }).get()

    if (requestError) {
      setResultItem(null)
      setError(requestError.value as string)
      setLoading(false)
      return
    }

    setResultItem(data)
    const createdUsername = await eden
      .user({ id: data.createdBy })
      .username.get()
    const updatedUsername = await eden
      .user({ id: data.updatedBy })
      .username.get()
    setCreatedItemUser(createdUsername.data)
    setUpdatedItemUser(updatedUsername.data)

    setLoading(false)
  }

  const haveAdditionalDetail = () => {
    if (
      !!resultItem.height ||
      !!resultItem.fromSerie ||
      !!resultItem.gunplaExclusivity ||
      !!resultItem.gunplaGrade ||
      !!resultItem.liquidProductType ||
      !!resultItem.resinType ||
      !!resultItem.volumeMl ||
      !!resultItem.colorTone ||
      !!resultItem.paintSpecialPorperty ||
      !!resultItem.paintApplicationMethod ||
      !!resultItem.paintFinish
    ) {
      return true
    }
    return false
  }

  useEffect(() => {
    callItem()
  }, [])

  return (
    <>
      <Header />
      {error ? (
        <section className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </section>
      ) : null}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">getting item data...</p>
        </div>
      ) : (
        <div className=" mx-20 p-5 ">
          <h1 className="text-3xl">View item: {resultItem.name}</h1>
          <div className="bg-gray-50 rounded-2xl drop-shadow-xl p-5 mt-5">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <DataWithLabel label="Item Name" text={resultItem.name} />
                <div className="grid grid-cols-2 gap-4">
                  <DataWithLabel label="Category" text="">
                    <CategoryPill categoryId={resultItem.categoryId} />
                  </DataWithLabel>
                  <DataWithLabel
                    label="Release Year"
                    text={resultItem.releaseYear}
                  />
                </div>
                <DataWithLabel label="Brand" text={resultItem.brand} />
                <div className="grid grid-cols-2 gap-4">
                  <DataWithLabel
                    label="Stock Quantity"
                    text={resultItem.stockQty}
                  />
                  <DataWithLabel
                    label="Store Price (THB)"
                    text={resultItem.storePriceThb}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DataWithLabel label="MSRP" text={resultItem.msrpPrice} />
                  <DataWithLabel
                    label="MSRP Currency"
                    text={resultItem.msrpCurrency}
                  />
                </div>
              </div>
              <div>
                {/* image */}
                <div className=" min-w-full min-h-3xs grid place-items-center overflow-hidden">
                  <Center className="w-80 h-80 rounded-2xl border-2 border-dashed border-gray-400">
                    {resultItem.thumbnailPath ? (
                      <Image
                        src={resultItem.thumbnailPath}
                        alt="thumbnail"
                        w={250}
                        h={250}
                        radius="sm"
                        fit="cover"
                      />
                    ) : (
                      <IconPhotoOff size={80} stroke={1.5} />
                    )}
                  </Center>
                </div>
              </div>
              <DataWithLabel
                label="Description"
                additionalClass="col-span-2"
                text={resultItem.description}
              />
            </div>
          </div>

          {haveAdditionalDetail() && (
            <div className="bg-gray-100 p-5 mt-5 rounded-2xl drop-shadow-xl">
              <h2 className="text-3xl mt-5">Additional Detail</h2>

              {(!!resultItem.fromSerie || !!resultItem.height) && (
                <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                  <h2> Figure Common</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <DataWithLabel
                      label="From Serie"
                      text={resultItem.fromSerie}
                    />
                    <DataWithLabel
                      label="Height (CM)"
                      text={resultItem.height}
                    />
                  </div>
                </div>
              )}

              {(!!resultItem.gunplaGrade || !!resultItem.gunplaExclusivity) && (
                <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                  <h2> Gunpla Detail</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <DataWithLabel
                      label="Gunpla Grade"
                      text={resultItem.gunplaGrade}
                    />
                    <DataWithLabel
                      label="Exclusivity"
                      text={resultItem.gunplaExclusivity}
                    />
                  </div>
                </div>
              )}

              {(!!resultItem.liquidProductType ||
                !!resultItem.resinType ||
                !!resultItem.volumeMl) && (
                <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                  <h2> Liquid Product</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <DataWithLabel
                      label="Liquid Product Type"
                      text={resultItem.liquidProductType}
                    />
                    <DataWithLabel
                      label="Resin Type"
                      text={resultItem.resinType}
                    />
                    <DataWithLabel
                      label="Volume (ML)"
                      text={resultItem.volumeMl}
                    />
                  </div>
                </div>
              )}

              {(!!resultItem.colorTone ||
                !!resultItem.paintSpecialPorperty ||
                !!resultItem.paintApplicationMethod ||
                !!resultItem.paintFinish) && (
                <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
                  <h2> Figure Common</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <DataWithLabel
                      label="Color Tone"
                      text={resultItem.colorTone}
                    />
                    <DataWithLabel
                      label="Paint Special Porperty"
                      text={resultItem.paintSpecialPorperty}
                    />
                    <DataWithLabel
                      label="Paint Application Method"
                      text={resultItem.paintApplicationMethod}
                    />
                    <DataWithLabel
                      label="Paint Finish"
                      text={resultItem.paintFinish}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="bg-gray-100 p-5 mt-5 rounded-2xl drop-shadow-xl">
            <h2 className="text-3xl mt-5">System Infomation</h2>
            <div className="bg-white rounded-2xl drop-shadow-xl p-5 mt-5">
              <div className="grid grid-cols-2 gap-4">
                <DataWithLabel label="Item id" text={resultItem.id} />
                <div />
                <DataWithLabel
                  label="Created At"
                  text={resultItem.createdAt.toString()}
                />
                <DataWithLabel label="Created By" text={createdItemUser} />
                <DataWithLabel
                  label="Last Updated At"
                  text={resultItem.updatedAt.toString()}
                />
                <DataWithLabel label="Last Updated By" text={updatedItemUser} />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="my-4"
              onClick={() => {
                navigate({ to: '/' })
              }}
            >
              back to item menu
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
