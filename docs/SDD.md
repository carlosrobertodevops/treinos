# SDD - Software Design Document

## Arquitetura Geral

Aplicacao fullstack com UI Next.js, API Elysia e banco PostgreSQL acessado via Drizzle ORM.

```text
Browser
  -> Next.js App Router (UI)
  -> Elysia REST API
  -> Use cases / services
  -> Drizzle ORM
  -> PostgreSQL
```

## Componentes

## UI Next.js

- App Router para paginas, layouts, loading e error boundaries.
- Server Components por padrao.
- Client Components apenas para estado, eventos, efeitos ou APIs do browser.
- Consumo da API via `NEXT_PUBLIC_API_URL`.

## Design System

- ShadCN/UI como base de componentes; primitives instalados: `avatar`, `badge`, `button`, `card`, `dialog`, `input`, `scroll-area`, `separator`, `sheet`.
- Tailwind CSS com tokens semanticos definidos em `src/app/globals.css` (`--primary: #2b54ff`, surfaces brancas, `--secondary/muted: #f1f1f1`, `--streak`/`--streak-soft` para sequência de treinos).
- Tipografia Inter Tight via `next/font/google` em `src/app/layout.tsx`, exposta como `--font-sans`.
- Componentes devem usar composicao completa quando existir (`CardHeader`, `CardContent`, `DialogTitle`, etc.).
- Telas mapeadas para o Figma `FIT.AI Alunos / Estudos`. Cada rota possui contraparte direta no design (ver SPEC.md → "Telas Mapeadas").
- `BottomNav` (`src/components/bottom-nav.tsx`) é a navegação fixa das telas autenticadas; recebe `active`.
- Assets vindos do Figma ficam em `public/figma/<hash>.<ext>` e são referenciados como `/figma/<hash>.<ext>`.

## API Elysia

- Rotas REST agrupadas por recurso em `src/server/`.
- Handlers validam entrada, chamam camada de negocio e retornam status HTTP explicito.
- Middlewares/plugins centralizam autenticacao, CORS, logs e tratamento de erros quando aplicavel.
- Zod 4 valida env, body, params, query e responses quando aplicavel.

## Dominio

- Use cases/services concentram regras de negocio.
- DTOs separam formato publico da API do formato de banco.
- Erros de dominio usam classes ou codigos previsiveis para mapeamento HTTP.

## Banco de Dados

- PostgreSQL como banco unico.
- Drizzle define schema em `src/db/schema.ts` ou `src/db/schema/`.
- Drizzle client em `src/db/client.ts` ou `src/db/index.ts`.
- Migrations em `drizzle/` via `bunx drizzle-kit generate`.
- Aplicacao de migrations via `bunx drizzle-kit migrate`.

## Docker

- `app`: imagem Bun, instala dependencias e roda `bun run dev`.
- `db`: PostgreSQL 16 Alpine com volume persistente.
- `app` depende do healthcheck de `db`.
- `.env` alimenta ambos os servicos.

## Variaveis

- `APP_PORT`: porta da UI Next.js.
- `API_PORT`: porta da API Elysia.
- `NEXT_PUBLIC_API_URL`: URL publica da API para client/browser.
- `DATABASE_URL`: conexao interna Docker usando host `db`.
- `DATABASE_URL_LOCAL`: conexao pelo host local.

## Qualidade

- TypeScript strict.
- Sem `any`.
- Zod 4 para fronteiras de dados.
- Transacoes Drizzle quando regra alterar multiplas tabelas.
- Docker Compose deve validar com `docker compose config`.
- Playwright (`tests/e2e/`) cobre smoke de cada tela do design system. Rodar com `bun run test:e2e`.
