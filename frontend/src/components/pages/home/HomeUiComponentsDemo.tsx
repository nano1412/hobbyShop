import {
  Checkbox,
  DatePickerInput,
  NumberInput,
  PasswordInput,
  Radio,
  Select,
  Textarea,
  TextInput,
} from '@/components/ui'
import { Button, Group } from '@mantine/core'
import { Link } from '@tanstack/react-router'

export default function HomeUiComponentsDemo() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Simple UI Components Demo</h1>
      <p className="mt-2 text-sm text-gray-500">
        Quick preview of your custom base components.
      </p>

      <Group gap={16} my={8}>
        <Button component={Link} to="/example/backend">
          Go to Backend Example
        </Button>
        <Button component={Link} to="/example/form">
          Go to Form Example
        </Button>
        <Button component={Link} to="/example/signup">
          Go to Signup
        </Button>
        <Button component={Link} to="/example/signin">
          Go to Signin
        </Button>
        <Button component={Link} to="/example/authenticated">
          Go to Authenticated
        </Button>
      </Group>

      <div className="mt-8 grid gap-4">
        <TextInput label="Text Input" placeholder="Enter text" />
        <PasswordInput label="Password" placeholder="Enter password" />
        <NumberInput label="Number Input" placeholder="0" />
        <Select
          label="Select"
          placeholder="Pick one"
          data={[
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
          ]}
        />
        <DatePickerInput label="Date Picker" placeholder="Select date" />
        <Textarea
          label="Textarea"
          placeholder="Type something..."
          minRows={3}
        />
        <Checkbox label="Accept terms" />
        <Radio label="Example radio" value="example" />
      </div>
    </main>
  )
}
