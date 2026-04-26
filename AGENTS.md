# Agent Instructions

## Package Manager

Use **Bun**: `bun install`, `bun run dev`, `bunx drizzle-kit generate`, `bunx drizzle-kit migrate`.

## Stack

- Next.js App Router for UI.
- Elysia for REST API.
- Drizzle ORM with PostgreSQL.
- Zod 4 for env, request, and response validation.
- Docker Compose with `app` and `db` services.
- ShadCN/UI and Tailwind CSS for UI.

## File-Scoped Commands

| Task      | Command                                 |
| --------- | --------------------------------------- |
| Typecheck | `bunx tsc --noEmit`                     |
| Lint      | `bunx eslint path/to/file.ts`           |
| Format    | `bunx prettier --write path/to/file.ts` |

## Project Structure

- `app/` or `src/app/`: Next.js routes, layouts, pages, route handlers.
- `components/ui/`: ShadCN/UI components.
- `src/server/`: Elysia API, plugins, middlewares, routes.
- `src/db/`: Drizzle client, schema, queries.
- `drizzle/`: generated migrations.
- `docs/`: PRD, SDD, SPEC, and API prompts.

## Conventions

- TypeScript strict; no `any`.
- Named exports by default; Next.js framework files may use default exports.
- API handlers validate input, call use cases/services, and return explicit status codes.
- Keep business rules outside route handlers when logic is non-trivial.
- Map Drizzle rows to DTOs before crossing API boundaries when shape differs or sensitive fields exist.
- Use ShadCN composition and semantic Tailwind tokens before custom markup/classes.

## Docker

- `docker-compose.yml` must include `app` and `db`.
- `app` depends on `db` healthcheck.
- `db` uses persistent volume.
- Env comes from `.env`; never commit real secrets.

## Commit Attribution

AI commits MUST include:

```text
Co-Authored-By: (agent model name and attribution byline)
```
