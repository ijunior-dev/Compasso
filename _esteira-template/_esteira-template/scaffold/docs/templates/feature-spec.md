# `<Tela>` — Feature Spec

<!-- Nome do arquivo: docs/feature-specs/<tela>.md (ou <area>/NN-<tela>.md se houver agrupamento). 1 arquivo por tela. -->

| Campo            | Valor                                              |
| ---------------- | -------------------------------------------------- |
| {{PREFIXO}}-X    | `<issue Linear que implementa>`                    |
| Rota             | `<ex: /admin/clientes>`                            |
| Ref. visual      | `<link/origem do mockup, se houver>`               |
| Status           | `<doc \| em progresso \| implementada>`            |

---

## Objetivo

<!-- 2-3 linhas: o que esta tela entrega pro usuário. Não liste passos de implementação. -->

`<descrição>`

---

## Tabelas usadas

<!-- Entidades que a tela lê/escreve. Linkar domain-specs correspondentes — não duplicar regra de negócio. -->

- `<tabela>` → ver [domain-specs/<entidade>.md](../domain-specs/<entidade>.md)

---

## Estrutura

<!-- Blocos da tela: header, filtros, listagem/form, estados (loading/empty/erro), ações. -->

- `<bloco>` — `<o que faz>`
- **Empty state:** `<texto + CTA>`
- **Erro:** `<comportamento>`

---

## Comportamento

<!-- Interações chave: filtros, busca, paginação, validações, máscaras, permissões por papel. -->

- `<interação>` — `<resultado esperado>`

---

## Notas de adaptação

<!-- Decisões de arquitetura aplicadas: padrão de componente (UI-UX.md), Server Action vs Route Handler, RLS, etc. -->

- `<nota>`

---

## Critérios de aceite (insumo pra task-spec)

1. `<criterio verificavel>`
2. `<criterio negativo/edge>`
