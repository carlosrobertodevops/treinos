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
| E2E       | `bun run test:e2e`                      |

## Project Structure

- `src/app/`: Next.js routes, layouts, pages, route handlers.
- `src/components/ui/`: ShadCN/UI primitives (avatar, badge, button, card, dialog, input, scroll-area, separator, sheet).
- `src/components/`: app-level shared components (e.g. `bottom-nav.tsx`).
- `src/server/`: Elysia API, plugins, middlewares, routes.
- `src/db/`: Drizzle client, schema, queries.
- `drizzle/`: generated migrations.
- `public/figma/`: vendored Figma assets (PNG/SVG) referenced as `/figma/<hash>.<ext>`.
- `tests/e2e/`: Playwright smoke tests (mobile chromium profile).
- `docs/`: PRD, SDD, SPEC, and API prompts.

## Design System (Figma)

- Source: `https://www.figma.com/design/ljuq4iRj8Oa3OU9g47e1Ht/FIT.AI--Alunos---Estudos`.
- Screens: `/login`, `/home`, `/ai/onboarding`, `/ai/coach` (`/ai` redirects to `/ai/onboarding`), `/workout-plans`, `/workout-plans/[planId]/days/[dayId]`, `/profile`, `/evolution`.
- Theme tokens live in `src/app/globals.css`:
  - `--primary: #2b54ff`, `--background: #ffffff`, `--secondary/muted: #f1f1f1`, `--muted-foreground: #656565`.
  - Streak tokens: `--streak: #f06100`, `--streak-soft: #ffe4cc`.
  - Font: Inter Tight via `next/font/google` exposed as `--font-sans` in `src/app/layout.tsx`.
- Always prefer semantic tokens (`bg-primary`, `text-muted-foreground`, `bg-secondary`) over hardcoded colors.
- Figma assets must be mirrored under `public/figma/` and referenced via `/figma/<hash>.<ext>` — never `localhost:3845`.
- Bottom navigation lives in `src/components/bottom-nav.tsx`; pass `active` to highlight the current tab.

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
