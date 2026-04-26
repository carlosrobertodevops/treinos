import { ValidationError } from '../errors'

export const requireUserId = (
  headers: Record<string, string | undefined>,
): string => {
  const userId = headers['x-user-id']

  if (!userId) {
    throw new ValidationError('Missing x-user-id header')
  }

  return userId
}
