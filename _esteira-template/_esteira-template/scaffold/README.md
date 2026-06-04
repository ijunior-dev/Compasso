# {{PROJETO}}

`<descrição de uma linha do produto — preencher no bootstrap>`

## Status

Em desenvolvimento. A ordem de execução das issues `{{PREFIXO}}-X` vive em [docs/tasks/execution-order.md](docs/tasks/execution-order.md) e espelha o Linear.

## Stack

- **App:** Next.js 16 + React 19 + Tailwind 4 + shadcn/ui (App Router, Server Actions, Route Handlers)
- **Banco / Auth / Storage:** Supabase (Postgres + RLS + Auth + Storage)
- **Tipos:** TypeScript + Zod
- **Deploy:** Vercel + Supabase
- **Package manager:** `<pnpm | npm | bun>`

## Onde começar

- **Setup do zero (contas + repo + banco + MCP):** [docs/runbooks/00-BOOTSTRAP.md](docs/runbooks/00-BOOTSTRAP.md)
- **Como os agentes trabalham aqui:** [CLAUDE.md](CLAUDE.md) (fluxo de 12 passos, gates, esteira Linear↔repo)
- **Mapa da documentação:** [docs/INDEX.md](docs/INDEX.md)

## Estrutura

```text
{{PROJETO_SLUG}}/
├── AGENTS.md        # entrada de instrucoes para Codex
├── CLAUDE.md        # fluxo operacional completo para agentes
├── app/             # Next.js App Router (ou src/app — definir no bootstrap)
├── supabase/
│   └── migrations/  # schema versionado
└── docs/            # ver docs/INDEX.md
```
