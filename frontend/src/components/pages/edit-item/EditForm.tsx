import ItemForm from '../form/ItemForm'

type EditFormProps = {
  id: number
}

export default function EditFormUI({ id }: EditFormProps) {
  return (
    <>
      <ItemForm itemid={id} />
    </>
  )
}
