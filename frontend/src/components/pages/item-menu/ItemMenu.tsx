import { eden } from '@/lib/eden'
import { useEffect, useState } from 'react'
import { DataTable } from 'mantine-datatable'
import {
  Image,
  Center,
  Group,
  ActionIcon,
  TextInput,
  Button,
  MultiSelect,
} from '@mantine/core'
import { IconEdit, IconEye, IconPhotoOff, IconTrash } from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { CategoryPill } from './CategoryPill'
import { modals } from '@mantine/modals'
import { useNavigate } from '@tanstack/react-router'
import type { itemsResponse } from '@/scripts/type'
import { QueryItemSchema, type queryItem } from '@/schema/queryItemSchema'

const PAGE_SIZES = [10, 15, 20]

export default function ItemManuPageUI() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [itemRecords, setItemRecords] = useState<itemsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const query = useForm<queryItem>({
    validate: zod4Resolver(QueryItemSchema),
    initialValues: {
      page: '1',
      limit: '10',
      sort: 'createdAt',
      order: 'desc',
      search: '',
      categoryIds: '',
    },
  })

  useEffect(() => {
    callItems(query.values)
  }, [])

  const callItems = async (form: queryItem) => {
    setLoading(true)
    setError(null)

    const { data, error: requestError } = await eden.api.items.get({
      query: form,
    })

    if (requestError) {
      setItemRecords(null)
      setError(requestError.value as string)
      setLoading(false)
      return
    }
    setItemRecords(data)
    setLoading(false)
  }

  const handleDelete = (id: string, name: string) => {
    modals.openConfirmModal({
      title: `Delete ${name}?`,
      centered: true,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await eden.api.items({ id }).delete()
        await callItems({ ...query.values })
      },
    })
  }

  return (
    <>
      <div className=" mx-20 p-5 ">
        <form onSubmit={query.onSubmit(callItems)}>
          <div className="flex justify-between mb-5">
            <div className="flex">
              <TextInput
                placeholder="Search..."
                key={query.key('search')}
                {...query.getInputProps('search')}
              />
              <MultiSelect
                className="mx-5"
                placeholder="filter category"
                data={[
                  { label: 'other', value: '1' },
                  { label: 'model kit', value: '2' },
                  { label: 'gunpla', value: '3' },
                  { label: 'figure', value: '4' },
                  { label: 'tool', value: '5' },
                  { label: 'liquid product', value: '6' },
                  { label: 'paint', value: '7' },
                ]}
                value={
                  query.values.categoryIds
                    ? query.values.categoryIds.split(',')
                    : []
                }
                onChange={(values) => {
                  query.setFieldValue('categoryIds', values.join(','))
                }}
              />
              <Button type="submit">Search</Button>
            </div>
            <Button
              onClick={() => {
                navigate({ to: '/add-item' })
              }}
            >
              + Create new Item
            </Button>
          </div>

          <DataTable
            fetching={loading}
            minHeight={180}
            withTableBorder
            recordsPerPageOptions={PAGE_SIZES}
            totalRecords={itemRecords?.meta.total || 0}
            page={Number(itemRecords?.meta.page)}
            onPageChange={(p) => {
              const nextValues = {
                ...query.values,
                page: String(p),
              }

              query.setValues(nextValues)
              callItems(nextValues)
            }}
            recordsPerPage={Number(itemRecords?.meta.limit)}
            onRecordsPerPageChange={(l: number) => {
              const nextValues = {
                ...query.values,
                limit: String(l),
                page: '1',
              }

              query.setValues(nextValues)
              callItems(nextValues)
            }}
            sortStatus={{
              columnAccessor: query.values.sort
                ? query.values.sort
                : 'createdAt',
              direction: query.values.order === 'asc' ? 'asc' : 'desc',
            }}
            onSortStatusChange={({ columnAccessor, direction }) => {
              const nextValues = {
                ...query.values,
                sort: columnAccessor.toString(),
                order: direction,
                page: '1',
              }

              query.setValues(nextValues)
              callItems(nextValues)
            }}
            columns={[
              {
                title: 'item image',
                accessor: 'thumbnailPath',
                render: (item) =>
                  item.thumbnailPath ? (
                    <Center className="h-20 w-20">
                      <Image
                        src={item.thumbnailPath}
                        alt="thumbnail"
                        w={70}
                        h={70}
                        radius="sm"
                        fit="cover"
                      />
                    </Center>
                  ) : (
                    <Center className="h-20 w-20">
                      <IconPhotoOff size={40} stroke={1.5} />
                    </Center>
                  ),
              },
              { accessor: 'name', sortable: true },
              {
                title: 'Category',
                accessor: 'categoryId',
                sortable: true,
                render: (item) => <CategoryPill categoryId={item.categoryId} />,
              },
              {
                title: 'Price (THB)',
                accessor: 'storePriceThb',
                sortable: true,
                textAlign: 'right',
                render: (item) =>
                  Number(item.storePriceThb).toLocaleString('th-TH', {
                    style: 'currency',
                    currency: 'THB',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
              },
              {
                title: 'Stock Quantity',
                accessor: 'stockQty',
                sortable: true,
                textAlign: 'right',
                render: (item) => item.stockQty.toLocaleString(),
              },
              {
                accessor: 'id',
                title: 'Row actions',
                textAlign: 'right',
                render: (item) => (
                  <Group gap={4} justify="right" wrap="nowrap">
                    <ActionIcon
                      variant="transparent"
                      aria-label="view"
                      onClick={() => {
                        navigate({
                          to: `/view-item/${item.id}`,
                        })
                      }}
                    >
                      <IconEye stroke={2} />
                    </ActionIcon>
                    <ActionIcon
                      variant="transparent"
                      color="green"
                      aria-label="edit"
                      onClick={() => {
                        navigate({
                          to: `/edit-item/${item.id}`,
                        })
                      }}
                    >
                      <IconEdit stroke={2} />
                    </ActionIcon>
                    <ActionIcon
                      variant="transparent"
                      color="red"
                      aria-label="delete"
                      onClick={() => {
                        handleDelete(item.id, item.name)
                      }}
                    >
                      <IconTrash stroke={2} />
                    </ActionIcon>
                  </Group>
                ),
              },
            ]}
            records={itemRecords?.data}
          ></DataTable>
        </form>
        {error ? (
          <section className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </section>
        ) : null}
      </div>
    </>
  )
}
