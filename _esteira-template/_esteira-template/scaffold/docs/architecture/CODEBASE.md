# CODEBASE.md — Mapa de arquivos do {{PROJETO}}

Atualizado: `<YYYY-MM-DD>`

> Mapa de onde cada coisa vive no código. Atualizar ao criar/mover arquivos relevantes (passo "Ao final de cada sessão" do CLAUDE.md).

## Topologia

```text
{{PROJETO_SLUG}}/
├── app/                  # Next.js App Router (rotas, layouts, Server Actions)
│   ├── (public)/         # rotas públicas
│   ├── admin/            # área autenticada
│   └── api/              # Route Handlers
├── components/           # componentes React (shadcn/ui + próprios)
├── lib/                  # utilitários, cliente Supabase, helpers
├── supabase/
│   └── migrations/       # schema versionado (.sql)
└── docs/                 # ver docs/INDEX.md
```

> Estrutura inicial. Ajustar conforme o projeto cresce — `src/` vs raiz, monorepo, etc. são decididos no bootstrap e registrados aqui + em DECISOES.

## Convenções

- PT-BR em tudo (ver CLAUDE.md § Regras gerais)
- `snake_case` no banco, `camelCase` em TS, `PascalCase` para tipos/classes
- Cliente Supabase: helper único em `lib/`, server vs browser separados

## Scripts

| Script         | O que faz                  |
| -------------- | -------------------------- |
| `dev`          | servidor local             |
| `build`        | build de produção          |
| `lint`         | ESLint                     |
| `typecheck`    | `tsc --noEmit`             |

## Anti-padrões

- Query que confia em filtro de aplicação pra isolar dados (use RLS)
- Segredo em código client
- Migration editada depois de aplicada (criar nova)
