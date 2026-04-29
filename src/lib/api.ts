const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

// Placeholder ID for the bootcamp prototype
export const MOCK_USER_ID = 'user-1'

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': MOCK_USER_ID,
      ...init?.headers,
    },
    // Use sensible defaults for Next.js caching or disable it to see fresh data
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => null)
    throw new Error(`API Error ${res.status}: ${errorBody || res.statusText}`)
  }

  // Not all responses are JSON (e.g. 204 No Content), but in this API most are.
  const text = await res.text()
  if (!text) return {} as T
  return JSON.parse(text) as T
}