import { z } from 'zod'

export const requiredText = (message: string) =>
  z.string().trim().min(1, message)

export const optionalText = z
  .preprocess((value) => {
    if (value === null) {
      return undefined
    }

    if (typeof value !== 'string') {
      return value
    }

    const trimmedValue = value.trim()
    return trimmedValue.length > 0 ? trimmedValue : undefined
  }, z.string().optional())
  .optional()

export const optionalNullableText = z
  .preprocess((value) => {
    if (value === undefined) {
      return undefined
    }

    if (value === null) {
      return null
    }

    if (typeof value !== 'string') {
      return value
    }

    const trimmedValue = value.trim()
    return trimmedValue.length > 0 ? trimmedValue : null
  }, z.string().nullable().optional())
  .optional()

export const optionalEmail = (message = 'รูปแบบอีเมลไม่ถูกต้อง') =>
  z
    .preprocess((value) => {
      if (value === null) {
        return undefined
      }

      if (typeof value !== 'string') {
        return value
      }

      const trimmedValue = value.trim()
      return trimmedValue.length > 0 ? trimmedValue : undefined
    }, z.email(message).optional())
    .optional()

export const requiredNumber = (message: string) =>
  z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) {
        return undefined
      }

      return value
    },
    z.coerce.number({ error: message }),
  )

const preprocessBoolean = (value: unknown) => {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase()

    if (normalizedValue === '') {
      return undefined
    }

    if (
      normalizedValue === 'true' ||
      normalizedValue === '1' ||
      normalizedValue === 'yes' ||
      normalizedValue === 'on'
    ) {
      return true
    }

    if (
      normalizedValue === 'false' ||
      normalizedValue === '0' ||
      normalizedValue === 'no' ||
      normalizedValue === 'off'
    ) {
      return false
    }
  }

  if (typeof value === 'number') {
    if (value === 1) {
      return true
    }

    if (value === 0) {
      return false
    }
  }

  return value
}

export const requiredBoolean = (message: string) =>
  z.preprocess(preprocessBoolean, z.boolean({ error: message }))

export const optionalBoolean = z
  .preprocess(preprocessBoolean, z.boolean().optional())
  .optional()

export const optionalDate = z
  .preprocess((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined
    }

    if (value instanceof Date) {
      return value
    }

    if (typeof value === 'string') {
      const parsedDate = new Date(value)

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate
      }
    }

    return value
  }, z.date().optional())
  .optional()

export const optionalEnum = <T extends Record<string, string>>(enumValues: T) =>
  z
    .preprocess((value) => {
      if (value === '' || value === null || value === undefined) {
        return undefined
      }

      return value
    }, z.enum(enumValues).optional())
    .optional()

export const requiredEnum = <T extends Record<string, string>>(
  enumValues: T,
  errorMessage: string,
) =>
  z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) {
        return undefined
      }

      return value
    },
    z.enum(enumValues, { error: errorMessage }),
  )

export const optionalNumber = z
  .preprocess((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined
    }

    return value
  }, z.coerce.number().optional())
  .optional()

export const optionalStringArray = z
  .preprocess((value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined
    }

    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    }

    if (typeof value === 'string') {
      const trimmedValue = value.trim()
      return trimmedValue.length > 0 ? [trimmedValue] : undefined
    }

    return value
  }, z.array(z.string()).optional())
  .optional()
