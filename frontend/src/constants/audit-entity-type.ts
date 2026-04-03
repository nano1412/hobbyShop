export const AUDIT_ENTITY_TYPE = {
  USER: 'USER',
} as const

export type AuditEntityType =
  (typeof AUDIT_ENTITY_TYPE)[keyof typeof AUDIT_ENTITY_TYPE]
