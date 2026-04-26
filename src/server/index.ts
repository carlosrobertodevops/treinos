import 'dotenv/config'

import { env } from '../env'
import { createServer } from './app'

const app = createServer()

app.listen({ hostname: '0.0.0.0', port: env.API_PORT })

console.log(`Elysia API running at http://localhost:${env.API_PORT}`)
