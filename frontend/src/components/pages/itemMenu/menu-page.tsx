import Header from '@/components/common/Header'
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
import { IconEdit, IconEye, IconPhoto, IconTrash } from '@tabler/icons-react'
import { QueryItemSchema, type queryItem } from '@/schema/QueryItemSchema'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { CategoryPill } from './category-pill'
import { modals } from '@mantine/modals'
import { useNavigate } from '@tanstack/react-router'

type itemsResponse = NonNullable<
  Awaited<ReturnType<typeof eden.api.items.get>>['data']
>

const PAGE_SIZES = [10, 15, 20]

export default function ItemManuPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [resultItems, setResultItems] = useState<itemsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<queryItem>({
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
    callItems(form.values)
  }, [])

  const callItems = async (form: queryItem) => {
    setLoading(true)
    setError(null)

    const { data, error: requestError } = await eden.api.items.get({
      query: form,
    })

    if (requestError) {
      setResultItems(null)
      setError('Request failed. Check backend server and CORS settings.')
      setLoading(false)
      return
    }

    setResultItems(data)
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
        await callItems({ ...form.values })
      },
    })
  }

  return (
    <>
      <Header />
      <div className=" mx-20 p-5 ">
        <form onSubmit={form.onSubmit(callItems)}>
          <div className="flex justify-between mb-5">
            <div className="flex">
              <TextInput
                placeholder="Search..."
                key={form.key('search')}
                {...form.getInputProps('search')}
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
                  form.values.categoryIds
                    ? form.values.categoryIds.split(',')
                    : []
                }
                onChange={(values) => {
                  form.setFieldValue('categoryIds', values.join(','))
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
            withTableBorder
            recordsPerPageOptions={PAGE_SIZES}
            totalRecords={resultItems?.meta.total || 0}
            page={Number(resultItems?.meta.page)}
            onPageChange={(p) => {
              const nextValues = {
                ...form.values,
                page: String(p),
              }

              form.setValues(nextValues)
              callItems(nextValues)
            }}
            recordsPerPage={Number(resultItems?.meta.limit)}
            onRecordsPerPageChange={(l: number) => {
              const nextValues = {
                ...form.values,
                limit: String(l),
                page: '1',
              }

              form.setValues(nextValues)
              callItems(nextValues)
            }}
            sortStatus={{
              columnAccessor: form.values.sort ? form.values.sort : 'createdAt',
              direction: form.values.order === 'asc' ? 'asc' : 'desc',
            }}
            onSortStatusChange={({ columnAccessor, direction }) => {
              const nextValues = {
                ...form.values,
                sort: columnAccessor.toString(),
                order: direction,
                page: '1',
              }

              form.setValues(nextValues)
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
                      <IconPhoto size={40} stroke={1.5} />
                    </Center>
                  ),
              },
              { accessor: 'name', sortable: true },
              {
                accessor: 'categoryId',
                sortable: true,
                render: (item) => <CategoryPill categoryId={item.categoryId} />,
              },
              { accessor: 'storePriceThb', sortable: true },
              { accessor: 'stockQty', sortable: true },
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
                      aria-label="view"
                      onClick={() => {
                        //subject to change to edit later
                        navigate({
                          to: `/view-item/${item.id}`,
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
            records={resultItems?.data}
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
