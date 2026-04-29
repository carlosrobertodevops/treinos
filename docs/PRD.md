# PRD - Bootcamp Treinos

## Objetivo

Construir uma aplicacao fullstack para gestao e execucao de treinos, usando Next.js, Bun, Elysia, Drizzle ORM, PostgreSQL, Zod 4, Docker, ShadCN/UI e Tailwind CSS.

## Usuarios

- Pessoa que monta e acompanha planos de treino.
- Pessoa que inicia sessoes de treino e registra progresso.
- Desenvolvedor que evolui API, UI e banco com ambiente local reproduzivel.

## Problema

Usuarios precisam organizar planos, dias, exercicios e sessoes de treino com estado persistente, validacao consistente e interface clara.

## Escopo Funcional

- Criar e listar planos de treino.
- Consultar plano, dia e dados resumidos do usuario.
- Iniciar sessoes de treino por dia de plano.
- Atualizar progresso de sessoes.
- Exibir dashboard/resumo na UI.
- Validar entradas e respostas com Zod 4.

## Telas (Figma `FIT.AI Alunos / Estudos`)

- `/login`: hero foto + painel azul + Google CTA.
- `/home`: greeting, semana de consistência, streak, treino de hoje.
- `/ai/onboarding` (e `/ai` redireciona): chat Coach AI com bubbles de boas-vindas e botão `Começar!`.
- `/ai/coach`: chat principal sobre fundo escuro com quick actions.
- `/workout-plans`: hero do plano + cards por dia (rest e treino).
- `/workout-plans/[planId]/days/[dayId]`: detalhe do dia com lista de exercícios.
- `/profile`: avatar, métricas (KG, CM, GC, ANOS), sair da conta.
- `/evolution`: streak hero (gradient laranja quando ativo), heatmap, stats e tempo total.

## Escopo Tecnico

- UI com Next.js App Router.
- Componentes visuais com ShadCN/UI e Tailwind CSS.
- API REST com Elysia em Bun.
- Banco PostgreSQL via Docker Compose.
- Drizzle ORM para schema, queries e migrations.
- `docker-compose.yml` com `app` e `db`.

## Fora de Escopo Inicial

- App mobile nativo.
- Pagamentos.
- Multi-tenant avancado.
- Integracoes com wearables.

## Criterios de Sucesso

- `docker compose up --build` sobe aplicacao e banco.
- UI consome API por `NEXT_PUBLIC_API_URL`.
- API valida requests e responses com Zod 4.
- Drizzle gera e aplica migrations no PostgreSQL.
- Fluxo de iniciar sessao retorna identificador da sessao criada.
- Telas Figma mapeadas (login, home, ai/onboarding, ai/coach, workout-plans, profile, evolution) renderizam usando tokens semânticos e ShadCN primitives.
- `bun run test:e2e` executa smoke do design system em todas as telas mapeadas.

## Riscos

- Divergencia entre schemas Zod, DTOs e schema Drizzle.
- Regras de negocio vazando para handlers Elysia.
- Variaveis de ambiente inconsistentes entre host e Docker.
- Componentes UI customizados demais sem seguir ShadCN/Tailwind tokens.
