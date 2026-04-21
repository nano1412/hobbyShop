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

type itemsResponse = NonNullable<
  Awaited<ReturnType<typeof eden.api.items.get>>['data']
>

type ItemQuery = {
  page?: string
  limit?: string
  search?: string
  sort?: string
  order?: string
  categoryIds?: string
}

const PAGE_SIZES = [10, 15, 20]

export default function ItemManuPage() {
  const [loading, setLoading] = useState(false)
  const [resultItems, setResultItems] = useState<itemsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState<string>('')
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [query, setQuery] = useState<ItemQuery>({
    page: '1',
    limit: '10',
    sort: 'createdAt',
    order: 'desc',
    search: '',
    categoryIds: '',
  })

  useEffect(() => {
    const callItems = async () => {
      setLoading(true)
      setError(null)

      const { data, error: requestError } = await eden.api.items.get({ query })

      if (requestError) {
        setResultItems(null)
        setError('Request failed. Check backend server and CORS settings.')
        setLoading(false)
        return
      }

      setResultItems(data)
      setLoading(false)
    }
    callItems()
  }, [query])

  return (
    <>
      <Header />
      {/* <Pill c="blue">Blue pill</Pill>
      <Pill bg="green">Red pill</Pill> */}
      <div className=" mx-20 p-5 ">
        <>
          {/* <ItemsTable {...resultItems} /> */}
          <div>
            <TextInput
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setQuery((q) => ({
                    ...q,
                    search: searchInput,
                    page: '1',
                  }))
                }
              }}
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
              value={categoryIds}
              onChange={(values) => {
                setCategoryIds(values)

                setQuery((q) => ({
                  ...q,
                  categoryIds: values.join(','),
                }))
              }}
            />
            <Button>+ Create new Item</Button>
          </div>

          <DataTable
            fetching={loading}
            withTableBorder
            recordsPerPageOptions={PAGE_SIZES}
            totalRecords={resultItems?.meta.total || 0}
            page={Number(resultItems?.meta.page)}
            onPageChange={(p) => setQuery((q) => ({ ...q, page: String(p) }))}
            recordsPerPage={Number(resultItems?.meta.limit)}
            onRecordsPerPageChange={(l: number) =>
              setQuery((q) => ({
                ...q,
                limit: String(l),
                page: '1', // reset page
              }))
            }
            sortStatus={{
              columnAccessor: query.sort ? query.sort : 'createdAt',
              direction: query.order === 'asc' ? 'asc' : 'desc',
            }}
            onSortStatusChange={({ columnAccessor, direction }) =>
              setQuery((q) => ({
                ...q,
                sort: columnAccessor.toString(),
                order: direction,
                page: '1',
              }))
            }
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
              { accessor: 'categoryId', sortable: true },
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
        </>
      </div>
    </>
  )
}
