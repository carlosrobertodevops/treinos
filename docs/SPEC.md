# SPEC - Especificacao Tecnica

## Stack Obrigatoria

- Next.js com App Router.
- Bun como runtime, package manager e executor.
- Elysia para API HTTP.
- Drizzle ORM para acesso ao PostgreSQL.
- PostgreSQL em Docker.
- Zod 4 para validacao.
- ShadCN/UI e Tailwind CSS para UI.
- Inter Tight via `next/font/google` para tipografia.
- Playwright para testes E2E (perfil mobile Chromium).

## Scripts Esperados

```bash
bun install
bun run dev
bun run test:e2e
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
- Usar Tailwind com tokens como `bg-background`, `text-muted-foreground`, `bg-primary`, `bg-secondary`, `text-primary`, `bg-streak`, `bg-streak-soft`.
- Evitar `"use client"` salvo quando houver estado, eventos, efeitos ou API do browser.
- Usar `NEXT_PUBLIC_API_URL` para chamadas feitas no browser.

## Design System

- Fonte do design: Figma `FIT.AI Alunos / Estudos` (`https://www.figma.com/design/ljuq4iRj8Oa3OU9g47e1Ht/...`).
- Tokens centralizados em `src/app/globals.css` (`--primary: #2b54ff`, `--background: #ffffff`, `--secondary/muted: #f1f1f1`, `--muted-foreground: #656565`, `--streak: #f06100`, `--streak-soft: #ffe4cc`).
- Tipografia Inter Tight registrada em `src/app/layout.tsx` via `next/font/google`, exposta como `--font-sans`.
- Assets do Figma vivem em `public/figma/<hash>.<ext>` e devem ser referenciados como `/figma/<hash>.<ext>`. Nunca apontar para `http://localhost:3845`.
- Bottom nav compartilhada: `src/components/bottom-nav.tsx`. Recebe `active` para destacar a aba.
- ShadCN primitives instalados: `avatar`, `badge`, `button` (com size `icon`), `card`, `dialog`, `input`, `scroll-area`, `separator`, `sheet`.

## Telas Mapeadas (Figma)

| Rota                                   | Figma node             | Resumo                                                        |
| -------------------------------------- | ---------------------- | ------------------------------------------------------------- |
| `/login`                               | `3606-1276`            | Hero foto + painel azul + Google CTA + ©                      |
| `/home`                                | `3606-2`               | Hero greeting + Consistência semana + Streak + Treino de Hoje |
| `/ai`                                  | —                      | redirect → `/ai/onboarding`                                   |
| `/ai/onboarding`                       | `3606-1053`            | Chat Coach AI + bubbles + `Começar!` + input                  |
| `/ai/coach`                            | `3606-936`             | Sheet sobre fundo escuro + X close + quick actions            |
| `/workout-plans`                       | `3606-79`              | Hero `Plano de Treino` + day cards (rest/treino)              |
| `/workout-plans/[planId]/days/[dayId]` | `3606-808`, `3606-679` | Header voltar + hero + lista de exercícios                    |
| `/profile`                             | `3606-608`             | Avatar + 2x2 stats + Sair da conta                            |
| `/evolution`                           | `3606-410`, `3606-212` | Streak hero (gradient laranja > 0) + heatmap + stats          |

## E2E

- `playwright.config.ts` na raiz; `testDir: ./tests/e2e`.
- Projeto único `mobile-chromium` baseado em `devices['Pixel 7']` com `browserName: 'chromium'`.
- `baseURL` controlado por `E2E_BASE_URL` (default `http://localhost:3000`).
- Specs vivem em `tests/e2e/*.spec.ts` e devem cobrir, no mínimo, smoke de cada tela do design system.

## Validacao

- Validar env no bootstrap.
- Validar `body`, `params` e `query` nas rotas.
- Validar response quando endpoint tiver contrato publico relevante.
- Usar Zod 4 e validadores ISO (`z.iso.date()`, `z.iso.datetime()`, `z.iso.time()`, `z.iso.duration()`).

## Segurança

- Nao commitar secrets reais em `.env`.
- Rotas protegidas devem usar middleware/plugin de autenticacao.
- Nunca retornar campos sensiveis diretamente do banco.
