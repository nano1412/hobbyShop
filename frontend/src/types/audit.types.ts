import type { AuditEntityType } from '@/constants/audit-entity-type'

export type AuditLog = {
  id: string
  entityType: AuditEntityType
  entityId: string
  action: string
  createdAt: string
}
