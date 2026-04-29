# SPEC - Especificacao Tecnica

## Stack Obrigatoria

- Next.js com App Router.
- Bun como runtime, package manager e executor.
- Elysia para API HTTP.
- Drizzle ORM para acesso ao PostgreSQL.
- PostgreSQL em Docker.
- Zod 4 para validacao.
- ShadCN/UI e Tailwind CSS para UI.

## Scripts Esperados

```bash
bun install
bun run dev
bunx drizzle-kit generate
bunx drizzle-kit migrate
bunx drizzle-kit studio
docker compose up --build
docker compose down
```

## Docker Compose

`docker-compose.yml` deve conter:

- `app` com Bun, volume do projeto, cache Bun, `node_modules` isolado e portas de UI/API.
- `db` com `postgres:16-alpine`, volume persistente e healthcheck `pg_isready`.
- `depends_on` com `condition: service_healthy` para o `app`.

## Env

`.env` deve declarar:

```dotenv
APP_PORT=3000
API_PORT=3333
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3333
API_URL=http://localhost:3333
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=bootcamp_treinos
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@db:5432/bootcamp_treinos
DATABASE_URL_LOCAL=postgresql://postgres:postgres@localhost:5432/bootcamp_treinos
```

## API Pattern

```ts
export const workoutRoutes = new Elysia({ prefix: '/workout-plans' }).post(
  '/',
  async ({ body, set }) => {
    const result = await createWorkoutPlan.execute(body)
    set.status = 201
    return result
  },
)
```

## Drizzle Pattern

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

## UI Pattern

- Preferir componentes ShadCN/UI existentes.
- Usar Tailwind com tokens como `bg-background`, `text-muted-foreground`, `bg-primary`.
- Evitar `"use client"` salvo quando houver estado, eventos, efeitos ou API do browser.
- Usar `NEXT_PUBLIC_API_URL` para chamadas feitas no browser.

## Validacao

- Validar env no bootstrap.
- Validar `body`, `params` e `query` nas rotas.
- Validar response quando endpoint tiver contrato publico relevante.
- Usar Zod 4 e validadores ISO (`z.iso.date()`, `z.iso.datetime()`, `z.iso.time()`, `z.iso.duration()`).

## Segurança

- Nao commitar secrets reais em `.env`.
- Rotas protegidas devem usar middleware/plugin de autenticacao.
- Nunca retornar campos sensiveis diretamente do banco.
