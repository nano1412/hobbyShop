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
  Pill,
} from '@mantine/core'
import { IconEye, IconPhoto, IconTrash } from '@tabler/icons-react'
import { QueryItemSchema, type queryItem } from '@/schema/QueryItemSchema'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { CategoryPill } from './category-pill'

type itemsResponse = NonNullable<
  Awaited<ReturnType<typeof eden.api.items.get>>['data']
>

const PAGE_SIZES = [10, 15, 20]

export default function ItemManuPage() {
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

  return (
    <>
      <Header />
      {/* <Pill c="blue">Blue pill</Pill>
      <Pill bg="green">Red pill</Pill> */}
      <div className=" mx-20 p-5 ">
        <form onSubmit={form.onSubmit(callItems)}>
          <div>
            <TextInput
              placeholder="Search..."
              key={form.key('search')}
              {...form.getInputProps('search')}
            />
            <MultiSelect
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
            <Button className="my-4" type="submit">
              summit
            </Button>
            <Button>+ Create new Item</Button>
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
              { accessor: 'updateAt', sortable: true },
              {
                accessor: 'actions',
                title: 'Row actions',
                textAlign: 'right',
                render: (item) => (
                  <Group gap={4} justify="right" wrap="nowrap">
                    <ActionIcon variant="transparent" aria-label="view">
                      <IconEye stroke={2} />
                    </ActionIcon>
                    <ActionIcon
                      variant="transparent"
                      color="red"
                      aria-label="delete"
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
      </div>
    </>
  )
}
