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

## Arquitetura

- **Next.js App Router** para UI, paginas, layouts e server actions quando fizer sentido.
- **ShadCN/UI + Tailwind CSS** para componentes, tokens e estilos.
- **Elysia** para API HTTP, plugins, middlewares e rotas REST.
- **Zod 4** para validacao de env, requests e responses.
- **Drizzle ORM** para schema, queries e migrations.
- **PostgreSQL** como banco unico da aplicacao.

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
