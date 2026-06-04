# `<Entidade>` — Domain Spec

<!-- Nome do arquivo: docs/domain-specs/<entidade>.md — kebab-case lowercase, 1 arquivo por entidade -->

Atualizado: `<YYYY-MM-DD>`

> Spec de domínio de uma entidade. Estado atual (o quê), não o porquê (isso vive em `decisions/`). Convenções globais herdadas estão em [domain-specs/README.md](../domain-specs/README.md) — aqui só destacar **exceções** a elas.

---

## Visão geral

<!-- 2-4 linhas: o que esta entidade representa no domínio, qual papel cumpre. -->

`<descrição>`

---

## Campos

<!-- Casar com a tabela real em supabase/migrations + DADOS.md. snake_case, sem acento/ç. -->

| Campo | Tipo | Obrigatório | Descrição |
| ----- | ---- | ----------- | --------- |
| `id` | uuid | sim | PK |
| `<campo>` | `<tipo>` | `<sim/não>` | `<...>` |
| `created_at` / `updated_at` | timestamptz | sim | auditoria (trigger `set_updated_at`) |

---

## Relações

<!-- FKs de entrada e saída. Cardinalidade. ON DELETE. -->

- `<entidade>.<fk>` → `<outra_entidade>.id` (`<1:N / N:N>`, `ON DELETE <...>`)

---

## Estados

<!-- Se a entidade tem máquina de estado, descrever transições. Senão, "sem estado". A máquina canônica resumida vive em RULES.md; aqui o detalhe. -->

`<estados e transições, ou "sem estado">`

---

## Regras de negócio

<!-- Regras específicas desta entidade. Numerar como RN-XXX se forem promovidas a RULES.md no passo 11. -->

- `<regra>`

---

## Isolamento (RLS)

<!-- Só destacar se diferente do default global de DADOS.md. -->

`<policy / "padrão do projeto, ver DADOS.md">`

---

## Termos relacionados

<!-- Termos do domínio usados aqui — devem estar em domain-specs/glossario.md. -->

- `<termo>` → ver [glossario.md](glossario.md)
