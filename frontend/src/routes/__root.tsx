import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'

import appCss from '../styles/styles.css?url'
import '../styles/fonts.css'

import '@mantine/core/styles.layer.css'
import 'mantine-datatable/styles.layer.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'
import theme from '@/theme'
import RootLayout from '@/components/layouts/RootLayout'
import { createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Mantine Bun Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <MantineProvider>
        <head>
          <ColorSchemeScript />
        </head>
        <body>
          <TanStackQueryProvider>
            <MantineProvider theme={theme}>
              <ModalsProvider>
                <Notifications position="top-center" />
                <RootLayout>{children}</RootLayout>
              </ModalsProvider>
            </MantineProvider>
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          </TanStackQueryProvider>
        </body>
      </MantineProvider>
    </html>
  )
}
