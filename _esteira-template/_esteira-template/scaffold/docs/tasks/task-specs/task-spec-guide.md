# Guia de Task Specs

Atualizado: `<YYYY-MM-DD>`

> Referencia para devs (e pra Claude no modo autonomo) ao puxar uma issue do Linear cujo briefing ainda nao foi hidratado no repo.

---

## Quando hidratar

Ao puxar uma issue `Todo` do Linear, se o briefing `docs/tasks/task-specs/{{PREFIXO}}-X-*.md` nao existir (ou estiver fraco), hidrate antes de implementar. No modo autonomo, isso acontece no **passo 3** da esteira (ver `CLAUDE.md` -> Fluxo do dev).

**Como hidratar:** peca ao Claude Code para investigar o codigo e preencher as secoes faltantes. Exemplo: _"puxe {{PREFIXO}}-10"_ — Claude executa sanity check (passo 2), hidrata a spec (passo 3) e segue ate o passo 11.

Se a issue tem **link pra `docs/domain-specs/<entidade>.md` ou `docs/feature-specs/<tela>.md`**, Claude usa esse conteudo como insumo principal pra hidratacao.

---

## Estrutura obrigatoria da task-spec — 8 secoes

Toda task-spec tem **8 secoes**. Sao os checkpoints da esteira (passos 3, 4, 5, 6, 9, 10 do fluxo em `CLAUDE.md`). Use o template em [`docs/templates/task-spec.md`](../../templates/task-spec.md).

1. **Header** — Data, origem (Linear {{PREFIXO}}-X), branch sugerida, tipo, link pro domain/feature-spec se houver
2. **Sintoma + Comportamento esperado** — sintoma em linguagem de negocio; comportamento esperado com racional
3. **Arquivos envolvidos + Codigo mapeado** — tabela `arquivo:linha`, "o que ja existe" vs "o que falta"
4. **Criterios de aceite** — **minimo 5**, incluindo **>=2 negativos/edge**, cada um verificavel
5. **Regression Surface** _(obrigatorio)_ — Files touched · Dependents · Shared state · Adjacent features. Profundidade escala com o que revela
6. **Plan** _(obrigatorio)_ — mudancas em `arquivo:linha` + Trade-offs explicitos
7. **Analise pre-impl** _(obrigatorio, ANTES de criar branch)_ — 3 perguntas adversariais:
   - P1. Cenario onde o fix falha?
   - P2. Arquivo no diff esperado que NAO esta em Files touched? (re-grep dos consumidores reais)
   - P3. Schema/migration/integracao que a spec nao mencionou?
   - **Output:** `Analise ok` | `Pause: <questao material>` — Material (Gate C) = premissa contradita, scope >=2x maior, dependent ausente, mudanca fora do plano. Cap: 1 iteracao
8. **Post-impl review + Test Cases** _(obrigatorio, APOS implementar)_ — revalidar Regression Surface contra diff + `git diff --name-only` vs Files touched + criterios verificados + TC-XXX com tag `[verified-by: code | user smoke]`, registrados em `docs/tests/test-case-registry.md`

`[verified-by: code]` = `node --check`, `grep`, `tsc --noEmit`, query SQL — Claude consegue rodar.
`[verified-by: user smoke]` = browser, login real, interacao visual, e-mail recebido — dev faz manualmente.

---

## Regra de proporcionalidade

Spec proporcional a complexidade — mas as **8 secoes existem sempre**. Em tasks triviais, varias linhas sao "nenhum"/"N/A".

| Complexidade               | Spec esperada                              |
| -------------------------- | ------------------------------------------ |
| Trivial (1 linha)          | ~50 linhas, Regression Surface em 4 linhas |
| Simples (1 componente)     | ~70 linhas                                 |
| Media (multiplos arquivos) | ~120 linhas                                |
| Complexa (feature nova)    | ~200+ linhas                               |

**A chave:** todo criterio de aceite verificavel + dev sabe quais arquivos tocar antes de codar + analise adversarial preenchida antes do branch.
