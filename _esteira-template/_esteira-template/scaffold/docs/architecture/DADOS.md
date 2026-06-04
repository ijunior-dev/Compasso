# DADOS.md — Arquitetura de dados do {{PROJETO}}

Atualizado: `<YYYY-MM-DD>`

> Schema concreto + RLS + convenções. Fluxo entidade → tabela → tipo TS. **Regra:** se aplicou migration / criou tabela / mudou enum/coluna / RLS policy → atualizar o Inventário abaixo + o `Atualizado:` do topo na mesma sessão.

## Convenções de nomenclatura

- Tabelas e colunas em `snake_case`, sem acento, sem ç
- Termos do domínio preservados como estão (ver [glossario.md](../domain-specs/glossario.md))
- Toda entidade de negócio: `created_at`, `created_by`, `updated_at`, `updated_by`
- Trigger `set_updated_at` automatiza `updated_at` em UPDATE

## Isolamento de dados (RLS)

`<Definir o modelo de isolamento no bootstrap: por usuário? por tenant/escritorio_id? público? Toda tabela com dado protegido tem policy. Nenhum endpoint filtra por aplicação — confia em RLS.>`

## Migrations

- Versionadas em `supabase/migrations/*.sql` (timestamp prefix)
- Migration aplicada nunca é editada — criar nova
- Migration arriscada (drop/rename/change type/backfill) valida em Supabase Branch efêmera antes de prod

## Inventário atual do banco

| Tabela | Propósito | RLS | Observações |
| ------ | --------- | --- | ----------- |
| _(vazio — preencher quando a 1ª migration entrar)_ | | | |

Tipos TS gerados via Supabase CLI/MCP em `<caminho — definir>`.
