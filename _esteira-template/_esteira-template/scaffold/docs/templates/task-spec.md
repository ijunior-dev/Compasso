# {{PREFIXO}}-X — `<Titulo curto>`

| Campo   | Valor                                                                    |
| ------- | ------------------------------------------------------------------------ |
| Linear  | `<https://linear.app/{{PROJETO_SLUG}}/issue/{{PREFIXO}}-X>`              |
| Spec    | `<docs/domain-specs/<entidade>.md ou docs/feature-specs/..., se houver>` |
| Branch  | `{{PREFIXO}}-X-descricao-curta`                                          |
| Tipo    | `<Bug \| Feature \| Improvement \| Hotfix \| Decision>`                  |
| Status  | `<Todo \| In Progress \| Done>`                                          |
| Inicio  | `<YYYY-MM-DD>`                                                           |
| Termino | `<YYYY-MM-DD \| —>`                                                      |

---

## 2. Sintoma + Comportamento esperado

### Sintoma

<!-- Em linguagem de negocio. O que esta acontecendo / faltando hoje? -->

`<descricao>`

### Comportamento esperado

<!-- O que deveria acontecer + racional (por que). -->

`<descricao>`

---

## 3. Arquivos envolvidos + Codigo mapeado

<!-- Tabela arquivo:linha. Separar "ja existe" vs "falta". -->

| Arquivo:linha  | O que ja existe | O que falta |
| -------------- | --------------- | ----------- |
| `<path:linha>` | `<...>`         | `<...>`     |

---

## 4. Criterios de aceite

<!-- Minimo 5, com >=2 negativos/edge. Cada criterio verificavel. -->

1. `<criterio>`
2. `<criterio>`
3. `<criterio>`
4. `<criterio negativo/edge>`
5. `<criterio negativo/edge>`

---

## 5. Regression Surface

- **Files touched:** `<lista, com path:linha>`
- **Dependents:** `<quem importa/chama os arquivos acima>`
- **Shared state touched:** `<schema / cookies / store / nenhum>`
- **Adjacent features:** `<features que compartilham codigo>`

---

## 6. Plan

1. `<mudanca em arquivo:linha>`
2. `<...>`

**Trade-offs:**

- `<opcao A>` vs `<opcao B>` -> escolhida `<X>` porque `<razao>`

---

## 7. Analise pre-impl

<!-- Preencher ANTES de criar branch. 3 perguntas adversariais contra a spec. -->

**P1. Cenario onde o fix falha?**

`<resposta>`

**P2. Arquivo no diff esperado que NAO esta em Files touched?** (re-grep dos consumidores reais)

`<resposta>`

**P3. Schema/migration/integracao que a spec nao mencionou?**

`<resposta>`

**Output:** `<Analise ok \| Pause: <questao material>>`

<!-- Material = pausar (Gate C): premissa contradita, scope >=2x maior, dependent ausente, mudanca fora do plano. Cap: 1 iteracao. -->

---

## 8. Post-impl review + Test Cases

<!-- Preencher APOS implementar. -->

### Post-impl review

**Regression Surface revalidado contra diff:**

- [ ] Files touched: confirma lista
- [ ] Dependents: nenhum quebrou
- [ ] Shared state: `<...>`
- [ ] Adjacent features: `<...>`

**git diff --name-only vs Files touched:**

- [ ] Sem discrepancia, OU
- [ ] Discrepancia anotada como escopo legitimo: `<arquivo X — razao>`
- [ ] Discrepancia revertida como creep: `<arquivo Y>`

**Criterios de aceite verificados:**

- [ ] Criterio 1 — verificado como `<...>`
- [ ] Criterio 2 — verificado como `<...>`

### Test Cases

- **TC-XXX** `<nome curto>` `[verified-by: code | user smoke]`
  - **Setup:** `<pre-condicao>`
  - **Steps:** `<passos>`
  - **Expected:** `<resultado>`
  - **Covers:** `golden-path \| edge \| regression-check`

<!-- Apos preencher, registrar cada TC em docs/tests/test-case-registry.md. IDs nunca reutilizados. -->
