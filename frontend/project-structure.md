# Project Structure (Team Convention)

> Source of truth for repository-wide structure is `../project-structure.md`.
> This file remains for frontend-focused conventions only.

This document defines our current folder structure and conventions for building features in this project.

## Core Principles

- Keep shared UI building blocks in `src/components/ui`.
- Keep form wrappers in `src/components/form`.
- Keep page-specific components in `src/components/pages/<page-name>`.
- Use direct-file imports for `constants`, `types`, `hooks`, and page folders.
- Use PascalCase for component filenames.

## Current Structure (with team additions)

```text
src/
├── assets/
├── components/
│   ├── ui/                     # Reusable base UI components (Mantine wrappers)
│   │   ├── TextInput.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── DatePickerInput.tsx
│   │   ├── PasswordInput.tsx
│   │   ├── NumberInput.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Radio.tsx
│   │   └── index.ts
│   ├── form/                   # react-hook-form wrappers
│   │   ├── FormTextInput.tsx
│   │   ├── FormTextarea.tsx
│   │   ├── FormSelect.tsx
│   │   ├── FormDatePickerInput.tsx
│   │   ├── FormPasswordInput.tsx
│   │   ├── FormNumberInput.tsx
│   │   ├── FormCheckbox.tsx
│   │   ├── FormRadio.tsx
│   │   └── index.ts
│   ├── pages/                  # Page-specific component groups
│   │   └── home/
│   │       └── HomeUiComponentsDemo.tsx
│   ├── layouts/
│   └── common/
├── constants/                  # App constants and enum-like objects
│   └── audit-entity-type.ts
├── hooks/                      # Custom React hooks
│   └── useIsClient.ts
├── integrations/
├── lib/
├── middleware/                 # Server middleware
│   └── server.ts
├── routes/                     # File-based routes + API routes
│   ├── __root.tsx
│   ├── index.tsx
│   ├── not-found.tsx
│   └── api/
│       └── auth/
│           └── $.ts
├── styles/
├── types/                      # Shared TypeScript types
│   ├── api.types.ts
│   ├── audit.types.ts
├── routeTree.gen.ts
├── router.tsx
└── theme.ts
```

## Page-specific Component Rule

If a component belongs only to one page, place it in a folder matching that page name:

- `src/components/pages/customers/CustomerDataTable.tsx`
- `src/components/pages/customers/CustomerFilters.tsx`

If later that component is reused across pages, move it to `src/components/ui` or `src/components/common` (depending on purpose).

## Constants Example

Path: `src/constants/audit-entity-type.ts`

```ts
export const AUDIT_ENTITY_TYPE = {
  USER: 'USER',
  CUSTOMER: 'CUSTOMER',
  CUSTOMER_NOTE: 'CUSTOMER_NOTE',
  ORDER: 'ORDER',
  ORDER_ITEM: 'ORDER_ITEM',
  ORDER_PAYMENT: 'ORDER_PAYMENT',
  ORDER_DESIGN_ITEM: 'ORDER_DESIGN_ITEM',
  ORDER_DESIGN_ASSIGNMENT: 'ORDER_DESIGN_ASSIGNMENT',
  ORDER_DESIGN_SALE_SUMMARY: 'ORDER_DESIGN_SALE_SUMMARY',
} as const

export type AuditEntityType =
  (typeof AUDIT_ENTITY_TYPE)[keyof typeof AUDIT_ENTITY_TYPE]
```

Usage:

```ts
import { AUDIT_ENTITY_TYPE } from '@/constants/audit-entity-type'
import type { AuditEntityType } from '@/constants/audit-entity-type'

const entityType: AuditEntityType = AUDIT_ENTITY_TYPE.CUSTOMER
```

## Types Example

Path: `src/types/audit.types.ts`

```ts
import type { AuditEntityType } from '@/constants/audit-entity-type'

export type AuditLog = {
  id: string
  entityType: AuditEntityType
  entityId: string
  action: string
  createdAt: string
}
```

Usage:

```ts
import type { AuditLog } from '@/types/audit.types'
```

## Middleware Example

Path: `src/middleware/server.ts`

```ts
import { createMiddleware } from '@tanstack/react-start'

export const serverMiddleware = createMiddleware().server(async ({ next }) => {
  return next()
})
```

## Hook Example

Path: `src/hooks/useIsClient.ts`

```ts
import { useEffect, useState } from 'react'

export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
```

Usage:

```ts
import { useIsClient } from '@/hooks/useIsClient'
```

## Import Convention

- Use alias imports (`@/...`) where possible.
- Use direct-file imports for `home`, `constants`, `types`, and `hooks`:
  - `import { TextInput, Select } from '@/components/ui'`
  - `import { FormTextInput } from '@/components/form'`
  - `import HomeUiComponentsDemo from '@/components/pages/home/HomeUiComponentsDemo'`
  - `import { AUDIT_ENTITY_TYPE } from '@/constants/audit-entity-type'`
  - `import type { ApiResponse } from '@/types/api.types'`
