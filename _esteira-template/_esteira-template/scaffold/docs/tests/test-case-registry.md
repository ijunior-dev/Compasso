# Test Case Registry

Atualizado: `<YYYY-MM-DD do bootstrap>`

> Registro append-only de todos os test cases gerados ao longo das issues.
> Cada TC nasce no passo 10 da esteira (ver `CLAUDE.md` -> Fluxo do dev) dentro da task-spec da issue. Uma linha nova aqui aponta pra {{PREFIXO}}-X que o originou.

---

## Como usar

- **Ao concluir uma issue:** adicionar uma linha pra cada TC gerado na task-spec.
- **Antes de release:** rodar a lista como suite de regressao manual + automatizada conforme a tag `verified-by`.
- **TC nao some:** se um teste ficar obsoleto, marcar status `deprecated` e referenciar a issue que o substituiu. **IDs nunca sao reutilizados.**

---

## Convencoes

- **ID:** `TC-XXX` sequencial (TC-001, TC-002, ...). Comecar do proximo disponivel.
- **Issue:** link pra {{PREFIXO}}-X que gerou o teste.
- **Status:** `active` | `deprecated` | `blocked`
- **Covers:** `golden-path` | `edge` | `regression-check`
- **Verified-by:** `code` (Claude roda — `node --check`, `grep`, `tsc --noEmit`, query SQL) | `user smoke` (browser, login real, e-mail — dev faz manualmente)

---

## Registry

| ID  | Descricao curta | Issue | Covers | Verified-by | Status |
| --- | --------------- | ----- | ------ | ----------- | ------ |
| _(vazio — TC-001 entra com a primeira issue concluida)_ | | | | | |
