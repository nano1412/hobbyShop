import Header from '@/components/common/Header'
import { eden } from '@/lib/eden'

import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import DataWithLabel from './DataWithLabel'
import { CategoryPill } from '../item-menu/CategoryPill'
import { Button, Center, Image } from '@mantine/core'
import { IconPhoto } from '@tabler/icons-react'

type itemResponse = NonNullable<
  Awaited<ReturnType<ReturnType<typeof eden.api.items>['get']>>['data']
>

export default function ViewItemUI() {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/view-item/$id' })
  const [loading, setLoading] = useState(false)
  const [resultItem, setResultItem] = useState<itemResponse | null>({
    id: 7,
    categoryId: 7,
    name: 'A',
    description:
      'eqeqzxczxcczzxczxzxczxzxczxweeqeqzxczxcczzxczxzxczxzxczxweeqeqzxczxcczzxczxzxczxzxczxwe',
    thumbnailPath: 'https://ik.imagekit.io/nano1412/dogimages_NCpqnrCXB.jpg',
    thumbnailId: '69d895bc5c7cd75eb8f11f56',
    brand: 'zxc',
    stockQty: 22222,
    storePriceThb: 1113,
    msrpPrice: 22,
    msrpCurrency: 'THB',
    releaseYear: 22,
    createdAt: '2026-04-21T09:29:47.910Z',
    createdBy: 'JSy8QAuMSxIZJwIhfS7YzS5mMr7NmDYd',
    updatedAt: '2026-04-21T09:29:47.910Z',
    updatedBy: 'JSy8QAuMSxIZJwIhfS7YzS5mMr7NmDYd',
    gunplaGrade: 'PG',
    gunplaExclusivity: 'event',
    fromSerie: 'UC',
    height: 12,
    liquidProductType: 'solvent',
    resinType: 'lacquer',
    volumeMl: 123123,
    colorTone: 'cyan',
    paintSpecialPorperty: 'none',
    paintApplicationMethod: 'spray',
    paintFinish: 'matte',
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
      setError('Request failed. Check backend server and CORS settings.')
      setLoading(false)
      return
    }

    setResultItem(data)
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

  const getUserName = async () => {
    const createdUsername = await eden
      .user({ id: resultItem.createdBy })
      .username.get()
    const updatedUsername = await eden
      .user({ id: resultItem.updatedBy })
      .username.get()
    setCreatedItemUser(createdUsername.data)
    setUpdatedItemUser(updatedUsername.data)
  }

  useEffect(() => {
    // callItem()
    getUserName()
  }, [])

  return (
    <>
      <Header />
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
              <div className="max-w-64 max-h-64 min-w-full min-h-3xs bg-gray-200 grid place-items-center overflow-hidden">
                {resultItem.thumbnailPath ? (
                  <Center className="h-50 w-80">
                    <Image
                      src={resultItem.thumbnailPath}
                      alt="thumbnail"
                      w={250}
                      h={250}
                      radius="sm"
                      fit="cover"
                    />
                  </Center>
                ) : (
                  <Center className="h-20 w-20">
                    <IconPhoto size={80} stroke={1.5} />
                  </Center>
                )}
              </div>
              <DataWithLabel
                label="Description"
                text={resultItem.description}
              />
            </div>
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
                  <DataWithLabel label="Height (CM)" text={resultItem.height} />
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
              <DataWithLabel label="Created At" text={resultItem.createdAt} />
              <DataWithLabel label="Created By" text={createdItemUser} />
              <DataWithLabel
                label="Last Updated At"
                text={resultItem.updatedAt}
              />
              <DataWithLabel label="Last Updated By" text={updatedItemUser} />
            </div>
          </div>
        </div>
        <div>
          <Button
            className="my-4 mr-5"
            color="red"
            onClick={() => {
              navigate({ to: '/item-menu' })
            }}
          >
            back to item menu
          </Button>
        </div>
      </div>
    </>
  )
}
