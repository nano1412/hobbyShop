// src/lib/queryKeys.ts
/**
 * Centralized query keys for TanStack Query
 * Simple and easy to manage
 */

export const QUERY_KEYS = {
  // Users
  users: 'users',
  userDetail: (id: string) => ['users', id] as const,

  // Orders
  orders: 'orders',
} as const

// Stale time configurations (in milliseconds)
export const STALE_TIME = {
  SHORT: 30 * 1000, // 30 seconds
  MEDIUM: 2 * 60 * 1000, // 2 minutes
  LONG: 5 * 60 * 1000, // 5 minutes
  VERY_LONG: 10 * 60 * 1000, // 10 minutes
} as const

// Cache time configurations (in milliseconds)
export const CACHE_TIME = {
  SHORT: 2 * 60 * 1000, // 2 minutes
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 10 * 60 * 1000, // 10 minutes
} as const
