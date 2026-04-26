import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'

import { env } from '../env'
import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  pool?: pg.Pool
}

export const pool =
  globalForDb.pool ??
  new pg.Pool({
    connectionString: env.DATABASE_URL,
  })

if (env.NODE_ENV !== 'production') {
  globalForDb.pool = pool
}

export const db = drizzle(pool, { schema })
