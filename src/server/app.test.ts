import { describe, expect, it } from 'bun:test'

import { createServer } from './app'

describe('createServer', () => {
  it('returns API metadata from GET /', async () => {
    const app = createServer()
    const response = await app.handle(new Request('http://localhost/'))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      name: 'Bootcamp Treinos API',
      status: 'ok',
      version: '1.0.0',
    })
  })

  it('returns health status from GET /health', async () => {
    const app = createServer()
    const response = await app.handle(new Request('http://localhost/health'))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'healthy' })
  })
})
