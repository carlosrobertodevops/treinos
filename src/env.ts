import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_PORT: z.coerce.number().int().positive().default(3000),
  API_PORT: z.coerce.number().int().positive().default(3333),
  NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.url().default('http://localhost:3333'),
  API_URL: z.url().default('http://localhost:3333'),
  DATABASE_URL: z.string().min(1),
  DATABASE_URL_LOCAL: z.string().min(1).optional(),
})

export const env = EnvSchema.parse(process.env)
