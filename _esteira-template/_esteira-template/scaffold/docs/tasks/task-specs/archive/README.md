# Task Specs Archive

> Task-specs de issues concluidas. Preservadas (nao deletadas) para rastreabilidade de regressao e onboarding.

Quando uma issue eh concluida (passo 11 da esteira), a task-spec eh movida para ca em vez de ser deletada.

**Por que nao deletar:**

- Quando um bug aparece meses depois, a task-spec arquivada explica _por que_ cada decisao foi tomada
- `git log` recupera arquivos deletados, mas com friccao. Arquivamento = acesso direto
- Onboarding de novo dev: specs passadas sao contexto historico

**Antes de arquivar, graduar o que emergiu de estavel:**

- regra de negocio → [`docs/architecture/RULES.md`](../../../architecture/RULES.md)
- termo de dominio cunhado/refinado → [`docs/domain-specs/glossario.md`](../../../domain-specs/glossario.md) ou o spec da entidade
