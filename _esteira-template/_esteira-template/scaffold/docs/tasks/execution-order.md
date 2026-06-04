# Execution Order — Marco 1 — `<nome do primeiro marco>`

Atualizado: `<YYYY-MM-DD do bootstrap>`

> Ordem em que as issues do marco ativo devem ser puxadas. Espelha o estado do Linear + racional que o `blockedBy` sozinho não expressa.

**Linear é a fonte de verdade.** Este arquivo é um índice ordenado pra consulta rápida. Ao divergir do Linear, o Linear vence e este arquivo é regravado por Claude (ver [CLAUDE.md § Manutenção da execution-order](../../CLAUDE.md#manutenção-da-execution-order)).

**Marco ativo:** `<link do project Marco 1 no Linear — preencher após SETUP-LINEAR>`

---

## Sequência de execução

| #   | Issue | Título curto | Priority | Blocked by | Por que nessa posição |
| --- | ----- | ------------ | -------- | ---------- | --------------------- |
| _(vazio — primeira issue {{PREFIXO}}-1 entra aqui quando criada no Linear)_ | | | | | |

---

## Como manter este arquivo

Mantido pelo Claude Code automaticamente. Regravado sempre que o Linear muda de estado. Gatilhos:

- Issue do marco movida pra `Done` → linha removida
- Issue nova criada no marco → linha adicionada com posição + racional
- Mudança de `blockedBy` ou priority → racional ajustado

**Não editar manualmente.** Pra reordenar: "mova {{PREFIXO}}-X pra posição Y" ou "{{PREFIXO}}-X depende de {{PREFIXO}}-Y" → Claude regrava.

---

## Legenda

- **Priority:** `Urgent` > `High` > `Medium` > `Low`
- **Blocked by:** dependência formal registrada no Linear (campo `blockedBy`)
- **Por que nessa posição:** racional da posição — não o que a issue faz, mas por que vem agora
