# FIT.AI Design System

## 1. Tema Visual e Atmosfera

FIT.AI usa uma linguagem visual mobile-first, inspirada em apps de treino premium e na precisao do Figma `FIT.AI Alunos / Estudos`. O sistema alterna entre densidade emocional nas telas de marca/treino (login, hero de plano, streak hero) e calma operacional nas telas de produto (chat IA, lista de exercicios, perfil, heatmap de evolucao).

A interface deve parecer rapida, confiavel e direta. O usuario deve sempre saber qual e o proximo treino, qual e o proximo exercicio, qual e a sequencia atual e o que a IA pode fazer. Hero cards usam fotografia de alta intensidade (treino, esforco, foco) sobre fundos escuros, enquanto o corpo das telas mantem fundo branco e tipografia compacta.

FIT.AI tem dois modos de expressao no mesmo sistema:

- **Modo marca/treino:** atmosferico, com fotografia, gradientes escuros, hero cards arredondados, badges glass e CTA azul `#2b54ff`. Usado em login, hero de planos, hero de dia, treino de hoje e streak hero.
- **Modo produto:** utilitario, com fundo branco, cards de superficie clara, listas, chat bubbles, heatmap, BottomNav fixo. Usado em onboarding, chat IA, lista de exercicios, perfil, evolucao.

**Caracteristicas principais:**

- Fundacao branca: superficies `#ffffff`, separacoes via `#f1f1f1`, texto preto `#000000`.
- Azul `#2b54ff` como unico acento estrutural para CTA, foco, links, selecao e destaques.
- Laranja `#f06100` reservado exclusivamente para sequencia de treinos (streak) e estados "em andamento".
- Sem dark mode formal: hero cards trazem fundo escuro com fotografia, mas o restante da UI permanece light.
- Geometria suave e arredondada: hero cards com `rounded-b-3xl`, day cards com `rounded-xl`, pills com raio total.
- Iconografia Lucide simples e funcional, geralmente em 14-24px.
- Densidade controlada: chat e listas respiram; heatmap e cards de stats condensam.
- Mobile-first: todas as telas sao desenhadas para viewport ~390-414px com `max-w-[420px]` quando centralizadas.

## 2. Paleta de Cores e Papeis

> **Fontes internas:** `src/app/globals.css`, `docs/SPEC.md`, `docs/SDD.md`, `src/components/ui/*`.

### Primarias

- **Brand Blue** (`#2b54ff`): acao primaria, CTA, foco, selecao, status `Online`, ativos da BottomNav, badges principais.
- **Pure White** (`#ffffff`): fundo de pagina, cards, BottomNav, sheet do AI Coach, painel de auth invertido.
- **Pure Black** (`#000000`): texto principal, fundo dos hero cards e da tela de login.

### Superficies

- **Surface Soft** (`#f1f1f1`): superficie secundaria, bubbles do chat, fundo do dia de descanso, badges neutras, input do chat.
- **Surface Glass Light** (`bg-white/20 backdrop-blur-md`): badges sobre hero cards (dia da semana sobre foto).
- **Surface Glass Black** (`bg-black/5`): badges sobre fundos `f1f1f1` (dia de descanso).
- **Surface Primary Soft** (`bg-primary/5`): cards de stat de perfil e evolucao.
- **Surface Primary Outline** (`bg-primary/10`): icone container de stat card e quick actions do AI Coach.

### Texto e Metadados

- **Foreground** (`#000000`): texto primario.
- **Muted Foreground** (`#656565`): texto secundario, labels (`KG`, `CM`, `Treinos Feitos`), placeholders.
- **White on Hero** (`#ffffff`): texto sobre hero cards e painel azul de login.
- **White Soft** (`text-white/70` / `text-white/80`): subtitulos sobre hero (`Bora treinar hoje?`, copyright).

### Streak (sequencia)

- **Streak Hot** (`#f06100`): icone de chama, numero da streak no home, gradient quente do streak hero quando dias > 0, botao "Em Andamento".
- **Streak Soft** (`#ffe4cc`): fundo do card de streak no home, fundo soft de destaque.
- **Streak Hero Cold:** gradient `from-zinc-600 via-zinc-800 to-black` para streak `0 dias`.
- **Streak Hero Hot:** gradient `from-orange-400 via-streak to-red-700` para streak ativo.

### Semanticas

- **Destructive** (`#ef4444`): "Sair da conta" no perfil, erros e estados de exclusao quando aplicavel.
- **Active Session** (`#f06100`): botao "Em Andamento" no detalhe do dia (reaproveita o token streak).

### Tokens CSS

| Token                 |    Valor   | Uso                                          |
| --------------------- | ---------- | -------------------------------------------- |
| `--background`        | `#ffffff`  | Fundo de pagina e cards                      |
| `--foreground`        | `#000000`  | Texto primario                               |
| `--card`              | `#ffffff`  | Cards padrao                                 |
| `--popover`           | `#ffffff`  | Popovers, sheets e dialogs                   |
| `--primary`           | `#2b54ff`  | CTA, foco, selecao                           |
| `--primary-foreground`| `#ffffff`  | Texto sobre azul                             |
| `--secondary`         | `#f1f1f1`  | Superficie secundaria, bubbles, separacoes   |
| `--muted`             | `#f1f1f1`  | Fundos sutis                                 |
| `--muted-foreground`  | `#656565`  | Texto secundario                             |
| `--accent`            | `#f1f1f1`  | Hover de items neutros                       |
| `--destructive`       | `#ef4444`  | Erro e exclusao                              |
| `--border`            | `#f1f1f1`  | Bordas e separadores                         |
| `--input`             | `#f1f1f1`  | Borda de input                               |
| `--ring`              | `#2b54ff`  | Focus ring                                   |
| `--streak`            | `#f06100`  | Streak ativa, "Em Andamento"                 |
| `--streak-soft`       | `#ffe4cc`  | Fundo de cartao de streak                    |
| `--radius`            | `0.75rem`  | Base do scale de raio                        |
| `--font-sans`         | Inter Tight| Fonte unica do sistema                       |

### Gradientes

FIT.AI usa gradientes apenas em hero cards e overlays de legibilidade. Nunca como decoracao de pagina.

- **Hero overlay padrao:** `bg-gradient-to-t from-black/90 via-black/30 to-black/20` sobre fotografia para legibilidade.
- **Hero overlay forte:** `bg-gradient-to-t from-black/90 to-transparent` em cards de plano.
- **Login bottom:** `bg-gradient-to-t from-black via-black/30 to-transparent` na transicao foto -> painel azul.
- **Streak hero hot:** `bg-gradient-to-br from-orange-400 via-streak to-red-700`.
- **Streak hero cold:** `bg-gradient-to-br from-zinc-600 via-zinc-800 to-black`.

## 3. Regras de Tipografia

### Familia

- **Sans unico:** Inter Tight via `next/font/google`, exposta como `--font-sans` em `src/app/layout.tsx` (`Inter_Tight`, subset `latin`, `display: swap`).
- **Heading:** Inter Tight com pesos 600-900.
- **Body:** Inter Tight 400-500.
- **Mono:** nao usado no produto; reservar caso surja exibicao tecnica futura.

### Hierarquia

| Papel             | Tamanho |    Peso | Line-height | Uso                                                |
| ----------------- | ------: | ------: | ----------: | -------------------------------------------------- |
| Brand Logo Hero   |    32px |     900 |       tight | "FIT.AI" no top do login                           |
| Brand Logo Inline |    22px |     900 |       tight | "FIT.AI" em headers de profile, evolution, plans   |
| Auth Headline     |    32px |     600 |        1.05 | "O app que vai transformar a forma..."             |
| Greeting          |    28px |     600 |        1.05 | "Ola, {nome}" no home                              |
| Streak Number     |    48px |     600 |        0.95 | "15 dias" no streak hero                           |
| Stat Number       |    24px |     600 |        1.15 | KG, CM, Treinos Feitos, %                          |
| Card Title        |    24px |     600 |        1.05 | Nome do treino do dia                              |
| Section Title     |    18px |     600 |         1.4 | "Consistencia", "Treino de Hoje", "Coach AI"       |
| Exercise Title    |    16px |     600 |       tight | Nome do exercicio na lista                         |
| Body / Chat       |    14px |     400 |        1.4  | Bubbles, paragrafos, microcopy                     |
| Quick Action      |    14px |     500 |       tight | Chips de quick actions do AI Coach                 |
| Link / CTA Inline |    12px |     400 |        1.15 | "Ver historico", "Ver treinos", "Online"           |
| Badge / Day Pill  |    10px |     700 |        none | "SEGUNDA", "SEXTA", "HIPERTROFIA & FORCA"          |
| Stat Label        |    12px |     400 |       normal | "KG", "ANOS", "Tempo Total", "Taxa de conclusao"   |

### Principios

- **Compacta, nao apertada:** chat e listas respiram, mas hero cards mantem titulos grandes e curtos.
- **Peso antes de cor:** use `font-semibold` ou `font-black` antes de adicionar nova cor.
- **Tracking pontual:** use `tracking-tight` ou `tracking-tighter` em logos e numeros grandes; use `tracking-wide` em day pills uppercase.
- **Microcopy discreta:** auxiliares devem usar `text-muted-foreground` em `text-xs` ou `text-[10px]`.
- **Numeros viram heroi:** streak, KG, treinos feitos e tempo total ganham peso 600+ e tamanho generoso.
- **Uppercase comedido:** apenas em badges de dia, badges de plano e labels de stat (`KG`, `CM`, `GC`, `ANOS`).

## 4. Estilo de Componentes

### Botoes

Todos definidos em `src/components/ui/button.tsx` (variants: `default`, `secondary`, `outline`, `ghost`; sizes: `default`, `sm`, `lg`, `icon`).

- **Primary (`default`):** fundo `primary`, texto `primary-foreground`, raio `md`. Usar para "Bora!", "Iniciar Treino", "Fazer login com Google" (variante invertida com fundo branco), enviar mensagem.
- **Streak:** fundo `bg-streak`, texto branco. Reservado para "Em Andamento".
- **Disabled:** fundo `bg-white/20` sobre hero, texto branco. Usado em "Descanso" no detalhe do dia.
- **Icon:** `size: icon` (`size-9`), arredondado `rounded-full` quando usado em chat (`size-[42px]`), com icone Lucide 18-20px.
- **Pills:** badges e quick actions usam `rounded-full` com padding horizontal compacto.
- **Google CTA login:** botao branco `rounded-full h-12` com icone Google + label `font-semibold text-black`.

### Cards e Containers

- **Hero Card (login, plans, day, today, ai/coach bg):** altura 200-280px, fundo `bg-zinc-900` com `<img>` em opacity 80%, overlay gradient escuro, raio `rounded-xl` (cards) ou `rounded-b-3xl` (banners).
- **Day Rest Card:** `bg-secondary` com badge dia + icone `Zap` + titulo "Descanso". Altura compacta `h-[110px]`.
- **Stat Card:** `bg-primary/5 rounded-xl p-5`, icone container `bg-primary/10`, numero grande, label muted uppercase ou normal. Componente helper inline em `profile/page.tsx` e `evolution/page.tsx`.
- **Streak Hero:** ocupa `h-[220px]` com gradient laranja (`isHotStreak`) ou frio. Icone `Flame` em `bg-white/10 backdrop-blur-sm`.
- **Chat Bubble:** assistant `bg-secondary text-foreground`, user `bg-primary text-primary-foreground`. Raio `rounded-xl` com canto reduzido (`rounded-tl-sm` / `rounded-tr-sm`) opcional.
- **AI Coach Sheet:** card branco com `rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)]` cobrindo 82vh sobre fundo escuro.
- **Exercise Card:** `border-border shadow-none`, padding `p-4`, mostra nome + 3 badges (SERIES/REPS/SEG).
- **Heatmap Container:** `border border-border rounded-xl p-5` com colunas de semanas e celulas `size-5 rounded-md`.

### Inputs e Forms

- Definido em `src/components/ui/input.tsx` (ShadCN new-york).
- Altura padrao em chat: 42px com `rounded-full` e fundo `bg-secondary`.
- Placeholder: `text-muted-foreground` (`#656565`).
- Focus: `ring` azul `#2b54ff`. Em chat usamos `focus-visible:ring-0` para preservar contorno suave.
- Erro: aplicar token `destructive` sem inventar nova paleta (ainda nao existem forms longos no produto).

### Navegacao

- **BottomNav** (`src/components/bottom-nav.tsx`): fixo, `max-w-[420px]`, `rounded-t-3xl border-t border-border bg-background px-6 py-4`. Cinco itens: home, plans, ai (centro flutuante azul), evolution, profile. Recebe `active` (uma das chaves) e destaca a aba ativa em `text-foreground` enquanto inativos ficam em `text-muted-foreground`.
- **Center FAB:** botao quadrado `rounded-full bg-primary p-4 -mt-8` com icone `Sparkles` que sempre aponta para `/ai/coach`.
- **Header de detalhe:** chevron voltar na esquerda, titulo centralizado, spacer na direita (ex.: dia do plano).
- **Header de marca:** logo `FIT.AI` em `text-[22px] font-black uppercase tracking-tighter`, alinhado a esquerda em profile, evolution, plans.
- **Coach AI header:** avatar circular com `Sparkles`, titulo `Coach AI`, status `Online` em texto azul + dot azul.

### Badges e Tags

- **Day pill (sobre hero):** `bg-white/20 backdrop-blur-md text-white rounded-full px-3 py-1` com icone `Calendar` + dia em uppercase 10px.
- **Day pill (sobre superficie):** `bg-black/5 text-foreground rounded-full px-3 py-1` para dias de descanso.
- **Plan tag:** `bg-primary text-white rounded-full px-3 py-1` com icone `Target` + nome do plano.
- **Exercise badge:** `bg-secondary text-muted-foreground px-2.5 py-1 text-[10px] uppercase` (SERIES, REPS, segundos).
- **Streak badge no home:** card retangular `bg-streak-soft` com icone `Flame text-streak` + numero.
- **Online dot:** `size-2 rounded-full bg-primary` ao lado do texto `Online`.

### Imagens

- **Source:** `public/figma/<hash>.<ext>`, referenciadas como `/figma/<hash>.<ext>`. Nunca apontar para `http://localhost:3845`.
- **Hero opacity:** `opacity-80` ou `opacity-90` sobre fundo escuro mais overlay gradient para garantir legibilidade.
- **Login hero:** `cc3d9c8a..png` (back muscle) ou `773c1692..png` (push-up) ocupando full bleed.
- **Plans hero:** `8178ff0f..png` (livro com Goals).
- **Day cover fallback:** `c44110f5..png` quando `coverImageUrl` ausente.
- **Avatar profile:** `cf5a3551..png` aplicado em `Avatar` ShadCN com `AvatarFallback` exibindo iniciais.
- **Sem foto:** day rest card usa cor solida `bg-secondary` com icone `Zap` text-primary.

### Iconografia

Lucide React. Tamanhos canonicos: 14px (badges), 18-20px (acoes inline), 24px (BottomNav), 48px (streak hero).

| Icone                        | Uso                                                |
| ---------------------------- | -------------------------------------------------- |
| `Sparkles`                   | Coach AI, FAB centro da BottomNav                  |
| `Home`                       | BottomNav home                                     |
| `Calendar`                   | BottomNav planos, dia da semana em badges          |
| `BarChart2`                  | BottomNav evolucao                                 |
| `User` / `UserRound`         | BottomNav perfil, idade no perfil                  |
| `Flame`                      | Streak hero, card de streak no home                |
| `CheckCircle2`               | "Treinos Feitos" no evolution                      |
| `PercentCircle`              | "Taxa de conclusao" no evolution                   |
| `Hourglass`                  | "Tempo Total" no evolution                         |
| `Weight`                     | KG no perfil                                       |
| `Ruler`                      | CM no perfil                                       |
| `BicepsFlexed`               | GC no perfil                                       |
| `Timer`                      | Duracao do treino do dia                           |
| `Dumbbell`                   | Quantidade de exercicios                           |
| `Zap`                        | Descanso, segundos de descanso entre series        |
| `Target`                     | Tag do plano (HIPERTROFIA & FORCA)                 |
| `HelpCircle`                 | Ajuda do exercicio na lista                        |
| `ChevronLeft`                | Voltar no header de detalhe                        |
| `LogOut`                     | Sair da conta                                      |
| `ArrowUp`                    | Enviar mensagem no chat                            |
| `X`                          | Fechar sheet do AI Coach                           |

## 5. Principios de Layout

### Sistema de Espacamento

- Unidade base: 4px/8px.
- Gap minimo: 4px entre icone + texto em badges.
- Gap padrao: 8-12px em headers e listas.
- Gap de grupo: 16-24px entre secoes (`gap-6` em `<main>`).
- Padding de tela: 20px (`p-5`) em todas as paginas mobile.
- Padding de hero card: 20px (`p-5`).
- Padding bottom global: 96px (`pb-24`) para nao sobrepor a BottomNav.

### Grid e Container

- **Container global:** `max-w-[420px]` quando centralizado (BottomNav, sheet do AI).
- **Stat grid:** `grid grid-cols-2 gap-3` em perfil e evolution; quando solo (Tempo Total) usa coluna unica `w-full`.
- **Heatmap:** `flex justify-between gap-1 overflow-x-auto no-scrollbar` com colunas de semanas (`min-w-[20px]`).
- **Day list:** stack vertical em coluna unica com gap 16px.
- **Chat:** flex column, bubbles `max-w-[80%]` ou `max-w-[85%]`.
- **Quick actions:** `flex gap-2 overflow-x-auto no-scrollbar` para chips de scroll horizontal.

### Filosofia de Whitespace

- Tela deve parecer rapida e leve mesmo no scroll.
- Hero cards podem ser densos visualmente porque carregam fotografia e CTA.
- Listas devem ter respiro entre items (`gap-3` ou `gap-4`).
- BottomNav fixa preserva sempre 24px de respiro inferior via `pb-24`.
- Separacao deve vir de superficie e tipografia, nao de bordas pesadas.

### Escala de Radius

| Token                | Valor aproximado | Uso                                           |
| -------------------- | ---------------: | --------------------------------------------- |
| `--radius-sm`        |              8px | Badges quadrados, celulas do heatmap          |
| `--radius-md`        |             10px | Botoes padrao                                 |
| `--radius-lg`        |             12px | Cards, dia de descanso, exercise card         |
| `--radius-xl`        |             16px | Hero day cards, chat bubbles                  |
| `rounded-2xl`        |             16px | Auth painel azul (`rounded-t-[24px]`)         |
| `rounded-3xl`        |             24px | BottomNav (`rounded-t-3xl`), AI Coach sheet   |
| `rounded-b-[24px]`   |             24px | Hero banner do home                           |
| `rounded-full`       |            999px | Pills, badges, FAB, avatar do Coach AI        |
| `50%`                |         circular | Avatar do usuario, dots de status             |

## 6. Profundidade e Elevacao

| Nivel | Tratamento                                | Uso                                      |
| ----- | ----------------------------------------- | ---------------------------------------- |
| 0     | Superficie plana `background`             | Fundo de pagina                          |
| 1     | Tonal step `bg-secondary` ou `bg-primary/5` | Stat cards, dia de descanso, bubbles    |
| 2     | Hero card escuro com fotografia + overlay | Login bottom, plans hero, day hero, home banner |
| 3     | `rounded-t-3xl bg-background` + sombra negativa | AI Coach sheet sobre fundo escuro    |
| 4     | Streak hero com gradient quente/frio      | Evolution streak hero                    |
| Focus | `ring` azul                               | Inputs, botoes ativos, links no foco     |

Profundidade deve ser contida. Evite empilhar sombras. FIT.AI ganha hierarquia por contraste foto-vs-branco, raio progressivo e uso pontual de blur.

### Profundidade Decorativa

- Hero cards podem usar fotografia, gradient overlay e badge glass para comunicar emocao do treino.
- Streak hero pode usar gradient laranja vibrante quando a sequencia esta ativa.
- Sheet do AI Coach pode usar sombra negativa `shadow-[0_-10px_40px_rgba(0,0,0,0.3)]` para flutuar sobre fundo escuro.
- Resto do produto deve evitar decoracao solta.
- Animacoes ainda nao sao parte do sistema; quando entrarem, preferir `transition-colors` e `transition-transform duration-500` em hover de hero cards (`group-hover:scale-105`).

## 7. Do's and Don'ts

### Do

- Use os tokens de `globals.css` antes de criar novas cores.
- Reserve `bg-primary` (`#2b54ff`) apenas para acao, foco, links, selecao e marca.
- Reserve `bg-streak`/`bg-streak-soft` apenas para sequencia de treinos e estados "em andamento".
- Use Lucide com tamanho consistente (14, 18-20, 24).
- Componha com ShadCN (`Avatar`, `Badge`, `Button`, `Card`, `Dialog`, `Input`, `ScrollArea`, `Separator`, `Sheet`).
- Mantenha BottomNav presente em todas as telas autenticadas e passe `active` certo.
- Mantenha `pb-24` em paginas com BottomNav fixa.
- Trunque nomes longos sem quebrar grid; use `whitespace-nowrap` em chips.
- Use Inter Tight com peso e tracking certos antes de mudar cor.
- Hero cards devem ter overlay gradient escuro para legibilidade.
- Exporte como arrow function com named export quando o framework permitir.

### Don't

- Nao crie nova paleta fora de azul `#2b54ff`, brancos, cinzas `#f1f1f1`/`#656565` e streak `#f06100`/`#ffe4cc`.
- Nao use sombras fortes para resolver separacao; prefira contraste e raio.
- Nao misture novas familias tipograficas; Inter Tight e o unico sans.
- Nao referencie assets em `http://localhost:3845`; use sempre `/figma/<hash>.<ext>`.
- Nao esconda CTA principal atras de icone sem label em telas onde a acao e ambigua.
- Nao use streak (laranja) como CTA principal em formularios.
- Nao remova foco visivel em botoes, inputs e links.
- Nao crie BottomNav local em paginas; use `src/components/bottom-nav.tsx`.
- Nao deixe ai/onboarding e ai/coach divergirem sem motivo: header, bubbles e input devem usar os mesmos tokens.

## 8. Comportamento Responsivo

### Breakpoints

| Nome         |     Largura | Mudancas                                                          |
| ------------ | ----------: | ----------------------------------------------------------------- |
| Small Mobile |   ate 374px | Hero card mantem ratio, badges encolhem, chat bubble max 90%      |
| Mobile       |   375-414px | Layout canonico (Pixel 7, iPhone 13). Container `max-w-[420px]`   |
| Tablet       |   415-833px | Centralizar conteudo em `max-w-[420px]`, sobras em background     |
| Desktop      |    834px+   | Mesmo container central; nao expandimos para wide                 |

A aplicacao nao possui layout desktop diferenciado. O design e mobile-first e o desktop apenas centraliza o frame.

### Touch Targets

- Botoes principais devem ter `h-10` (40px) ou mais.
- Icon buttons no chat usam `size-[42px]`.
- BottomNav usa `p-2` em links comuns e `p-4` no FAB central.
- Pills de quick action devem ter padding `px-4 py-2` para toque.
- Stat card e link de "Sair da conta" devem ter area generosa para tap.

### Colapso

- BottomNav permanece sempre visivel com altura fixa.
- Heatmap do evolution scrolla horizontalmente quando o numero de semanas excede a largura.
- Quick actions do AI Coach scrollam horizontalmente quando passam da largura.
- Chat scrolla verticalmente; input e quick actions ficam ancorados ao rodape do sheet.
- Hero cards mantem proporcao e nao crescem alem do container central.

## 9. Guia de Prompts para Agentes

### Referencia Rapida de Cor

- Acao principal: `#2b54ff` (`bg-primary`).
- Texto sobre azul: `#ffffff` (`text-primary-foreground`).
- Fundo de pagina: `#ffffff` (`bg-background`).
- Texto primario: `#000000` (`text-foreground`).
- Surface secundaria: `#f1f1f1` (`bg-secondary`).
- Texto secundario: `#656565` (`text-muted-foreground`).
- Streak ativo: `#f06100` (`bg-streak`, `text-streak`).
- Streak soft: `#ffe4cc` (`bg-streak-soft`).
- Destrutivo: `#ef4444` (`text-destructive`).

### Prompts de Componentes

- "Crie uma tela FIT.AI mobile com hero card escuro full bleed (foto + gradient `from-black/90`), titulo branco peso 600 e CTA azul `bg-primary rounded-full px-6 h-10`, BottomNav `active='home'` no rodape."
- "Desenhe um chat AI no padrao FIT.AI: header com avatar `Sparkles`, titulo `Coach AI`, status `Online` azul, bubbles `bg-secondary` para o assistant e `bg-primary text-primary-foreground` para o usuario, input redondo `bg-secondary` com botao `ArrowUp` `bg-primary` 42x42."
- "Construa um stat grid 2x2 FIT.AI com cards `bg-primary/5 rounded-xl p-5`, icone container `bg-primary/10 text-primary` 34x34, numero `text-2xl font-semibold` e label muted uppercase."
- "Crie um streak hero FIT.AI com altura 220px, gradient `from-orange-400 via-streak to-red-700` quando a sequencia for ativa ou `from-zinc-600 via-zinc-800 to-black` quando zero, icone `Flame` em circulo `bg-white/10 backdrop-blur-sm` e numero `text-[48px] font-semibold` em branco."
- "Desenhe day card de plano FIT.AI: hero foto `rounded-xl h-[200px]` com badge dia `bg-white/20 backdrop-blur-md`, titulo branco e linha de meta com `Timer` minutos + `Dumbbell` exercicios."
- "Crie estado vazio para `/workout-plans`: hero `Plano de Treino` mantido, corpo com `text-muted-foreground` centralizado e CTA implícito via BottomNav."

### Guia de Iteracao

1. Comece pelos tokens existentes de `globals.css`, nao por novas cores.
2. Identifique modo da tela: marca/treino (hero escuro) ou produto (fundo branco).
3. Ajuste densidade antes de adicionar ornamento; em chat, deixe respiro entre bubbles.
4. Use ShadCN primitives (`Avatar`, `Badge`, `Button`, `Card`, `Dialog`, `Input`, `ScrollArea`, `Separator`, `Sheet`).
5. Reserve `bg-primary` para acao real e `bg-streak` para sequencia.
6. Confira que a BottomNav esta presente nas telas autenticadas e que `active` esta correto.
7. Verifique mobile (375-414px) antes de aceitar layout final.
8. Rode `bun run test:e2e` quando alterar uma tela coberta para garantir que o smoke ainda passa.

### Lacunas Conhecidas

- Dark mode ainda nao foi modelado; a UI e exclusivamente light com hero cards escuros.
- Nao existe sistema de toast/notificacao definido; quando entrar, usar tokens existentes.
- Estados de loading (skeleton, spinner) ainda dependem de classes Tailwind pontuais.
- Estados de erro de chat e formularios precisam de definicao mais formal antes de feature de auth real.
- Animacoes alem de `transition-colors` ainda nao foram padronizadas.
- Imagens vivem em `public/figma/` com nomes hash; mover para nomes semanticos (`/figma/login-hero.png`, `/figma/plan-cover.png`) deve ocorrer antes de release publico.
- `docs/SPEC.md`, `docs/SDD.md` e este documento devem ser mantidos sincronizados quando tokens, telas ou primitives mudarem.
