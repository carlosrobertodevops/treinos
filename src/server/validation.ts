import { z } from 'zod'

import { ValidationError } from '../errors'

export const parseSchema = <Schema extends z.ZodType>(
  schema: Schema,
  value: unknown,
): z.infer<Schema> => {
  const result = schema.safeParse(value)

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('; ')

    throw new ValidationError(message)
  }

  return result.data
}
