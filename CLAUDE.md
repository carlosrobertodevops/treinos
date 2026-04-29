# CLAUDE.md

## Visao Geral

Projeto fullstack de treinos com **Bun**, **Next.js**, **Elysia**, **Drizzle ORM**, **PostgreSQL**, **Zod 4**, **Tailwind CSS** e **ShadCN/UI**. Ambiente local deve rodar via Docker Compose com servicos `app` e `db`.

## Package Manager

Use **Bun**:

```bash
bun install
bun run dev
```

## Docker

```bash
# Sobe app + PostgreSQL
docker compose up --build

# Sobe em background
docker compose up -d --build

# Para ambiente
docker compose down
```

## Banco de Dados

Use Drizzle ORM com PostgreSQL.

```bash
# Gerar migrations
bunx drizzle-kit generate

# Executar migrations
bunx drizzle-kit migrate

# Abrir Drizzle Studio
bunx drizzle-kit studio
```

## Testes E2E

Playwright com perfil mobile Chromium (Pixel 7) em `tests/e2e/`.

```bash
bun run test:e2e
```

`playwright.config.ts` na raiz; specs em `tests/e2e/screens.spec.ts`.

## Arquitetura

- **Next.js App Router** para UI, paginas, layouts e server actions quando fizer sentido.
- **ShadCN/UI + Tailwind CSS** para componentes, tokens e estilos.
- **Elysia** para API HTTP, plugins, middlewares e rotas REST.
- **Zod 4** para validacao de env, requests e responses.
- **Drizzle ORM** para schema, queries e migrations.
- **PostgreSQL** como banco unico da aplicacao.
- **Playwright** para testes E2E com perfil mobile Chromium.

## Design System (Figma)

Fonte: [`FIT.AI Alunos / Estudos`](https://www.figma.com/design/ljuq4iRj8Oa3OU9g47e1Ht/FIT.AI--Alunos---Estudos).

### Telas implementadas

| Rota                                   | Figma node              | Notas                                                   |
| -------------------------------------- | ----------------------- | ------------------------------------------------------- |
| `/login`                               | `3606-1276`             | Hero escuro + painel azul + Google CTA                  |
| `/home`                                | `3606-2`                | Hero + Consistência + Streak + Treino de Hoje           |
| `/ai`                                  | `3606-1053`             | redirect → `/ai/onboarding`                             |
| `/ai/onboarding`                       | `3606-1053`             | Chat Coach AI + bubbles welcome + `Começar!`            |
| `/ai/coach`                            | `3606-936`              | Sheet sobre fundo escuro com X close + quick actions    |
| `/workout-plans`                       | `3606-79`               | Hero `Plano de Treino` + day cards (rest/treino)        |
| `/workout-plans/[planId]/days/[dayId]` | `3606-808` / `3606-679` | Header voltar + hero + lista de exercícios              |
| `/profile`                             | `3606-608`              | Avatar + 2x2 stats + Sair da conta                      |
| `/evolution`                           | `3606-410` / `3606-212` | Streak hero (gradient laranja se > 0) + heatmap + stats |

### Tokens e tipografia

Tokens em `src/app/globals.css`:

- `--primary: #2b54ff`, `--background: #ffffff`, `--secondary/muted: #f1f1f1`, `--muted-foreground: #656565`.
- Streak: `--streak: #f06100`, `--streak-soft: #ffe4cc`.
- Fonte Inter Tight injetada por `next/font/google` em `src/app/layout.tsx`, exposta como `--font-sans`.

### Regras de uso

- Preferir `bg-primary`, `text-muted-foreground`, `bg-secondary` no lugar de cores hex.
- Assets Figma ficam em `public/figma/<hash>.<ext>` e são referenciados como `/figma/<hash>.<ext>` — nunca `http://localhost:3845`.
- `BottomNav` (`src/components/bottom-nav.tsx`) é o nav fixo das telas autenticadas; passar `active` para destacar a aba.
- ShadCN primitives disponíveis: `avatar`, `badge`, `button`, `card`, `dialog`, `input`, `scroll-area`, `separator`, `sheet`.

## Convencoes

- TypeScript strict em todo codigo.
- Bun como runtime, package manager e executor de scripts.
- Componentes ShadCN devem ser compostos antes de criar markup customizado.
- Tailwind deve usar tokens semanticos e utilitarios consistentes.
- API Elysia deve manter regras de negocio fora dos handlers quando houver complexidade.
- Drizzle deve mapear resultados para DTOs quando atravessar camada de API.
- Variaveis de ambiente ficam em `.env`; nao commitar secrets reais.

## Variaveis Principais

- `APP_PORT` porta do Next.js.
- `API_PORT` porta da API Elysia.
- `DATABASE_URL` conexao Postgres usada dentro do Docker.
- `DATABASE_URL_LOCAL` conexao Postgres usada no host.
- `NEXT_PUBLIC_API_URL` URL publica da API consumida pela UI.
