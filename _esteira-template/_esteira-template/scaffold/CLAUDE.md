# CLAUDE.md — {{PROJETO}}

> Fluxo operacional completo para Claude Code e outros agentes de IA trabalhando neste repositório. Codex entra por `AGENTS.md`, que aponta para este arquivo.
>
> Este arquivo nasceu do template de esteira `_esteira-template`. A **camada de processo** (fluxo de 12 passos, 5 gates, manutenção da execution-order, git flow) é estável e não deve ser reescrita por projeto — só ajustada quando o processo evoluir. A seção **Domínio** e **Stack** são onde este projeto se diferencia: preencher.

## Projeto

**{{PROJETO}}** — `<descrição de uma linha do produto: o que é, para quem, qual problema resolve>`.

> ⚠️ Seção a preencher no bootstrap. Enquanto estiver assim, qualquer agente deve tratar regras de negócio como **não definidas** e pausar (ver "Quando parar e perguntar") antes de inventar.

### Domínio

`<2-4 linhas: modelo de negócio, atores principais, restrições legais/operacionais que não saem do código>`

Regras de negócio detalhadas vivem em [docs/architecture/RULES.md](docs/architecture/RULES.md) (core estável) e [docs/domain-specs/](docs/domain-specs/) (1 arquivo por entidade). Decisões e o porquê em [docs/decisions/DECISOES.md](docs/decisions/DECISOES.md).

## Stack

- **Frontend + Backend:** Next.js 16 (App Router) + React 19 + Tailwind 4 + shadcn/ui — Server Components, Server Actions e Route Handlers no mesmo app (sem serviço de API separado)
- **Banco / Auth / Storage:** Supabase (Postgres + RLS + Auth + Storage) — **1 projeto único (prod)** no início, sem staging. Migrations versionadas em `supabase/migrations/`
- **Tipos:** TypeScript + Zod. Tipos do banco gerados via Supabase CLI/MCP
- **Deploy:** Vercel (app Next.js) + Supabase (banco) — ambiente único (prod) no início, sem staging
- **Pkg manager:** `<pnpm | npm | bun — definir no bootstrap>`
- **Outros serviços:** `<email transacional, billing, etc. — adicionar conforme entrarem em código, não antes>`

> Ambiente único (prod) sem staging enquanto for 1 dev / pré-primeiro-cliente. Migration arriscada (drop/rename/backfill): criar **Supabase Branch efêmera** pelo dashboard, validar, depois aplicar em prod. Staging volta a fazer sentido com 2º dev OU primeiro cliente pagante.

## Disclosure progressiva

Não leia toda a documentação de uma vez. Siga esta ordem conforme necessidade:

1. **Sempre:** este arquivo
2. **Antes de implementar issue:** briefing em `docs/tasks/task-specs/{{PREFIXO}}-X-*.md` (hidratar se não existir, ver seção Tarefas)
3. **Se tocar em regras de negócio:** [docs/architecture/RULES.md](docs/architecture/RULES.md)
4. **Se precisar mapa de arquivos:** [docs/architecture/CODEBASE.md](docs/architecture/CODEBASE.md)
5. **Se tocar no banco:** [docs/architecture/DADOS.md](docs/architecture/DADOS.md) + ADRs em `docs/decisions/`
6. **Para regra/conceito de negócio detalhado:** [docs/domain-specs/](docs/domain-specs/) — 1 arquivo `.md` por entidade
7. **Para feature/tela específica:** [docs/feature-specs/](docs/feature-specs/) — 1 arquivo `.md` por tela, mapeado pra {{PREFIXO}}-X

## Regras gerais

1. **Decisões mais recentes vencem.** Em caso de conflito, a decisão mais recente prevalece.
2. **Spec é a intenção, código é a realidade.** Quando divergem: erro de implementação → corrigir código; descoberta legítima → atualizar spec.
3. **Tudo em português** — código, banco, variáveis, nomes de arquivo, comentários, commits.
4. **Identificadores sem acento e sem ç** (ex: `numero_interno`, não `número_interno`).
5. **`snake_case` no banco, `camelCase` em TS, `PascalCase` para tipos/classes.**
6. **Termos próprios do domínio NÃO se traduzem.** Catalogar em [docs/domain-specs/glossario.md](docs/domain-specs/glossario.md). Viram nomes de coluna como estão (sem acento/ç).
7. **Nunca remover funcionalidade existente** sem decisão explícita.
8. **Husky habilitado.** Pre-commit roda gitleaks + lint-staged. Não pular hooks (`--no-verify`) sem motivo declarado.

## Convenções de docs

- **Nomenclatura:**
  - `docs/architecture/*.md` — CAIXA ALTA (`CODEBASE.md`, `RULES.md`, `DADOS.md`, `UI-UX.md`)
  - `docs/tasks/`, `docs/tests/`, `docs/runbooks/` — kebab-case (`execution-order.md`) ou `{{PREFIXO}}-X-*.md`
  - `docs/decisions/ADR-NNN-*.md` — ADRs numeradas
  - `INDEX.md` e arquivos da raiz (`CLAUDE.md`) — CAIXA ALTA
- **Campo `Atualizado: YYYY-MM-DD`** no topo de todo `.md` em `docs/architecture/`. Atualizar a cada mudança substantiva.

## Documentação

```
docs/
  INDEX.md                     ← Mapa de navegação completo

  architecture/                ← Stack e camadas técnicas (CAIXA ALTA)
    CODEBASE.md                  Mapa de arquivos implementados
    DADOS.md                     Arquitetura de dados (RLS, schema)
    RULES.md                     Regras de negocio e fluxos criticos
    UI-UX.md                     Guideline visual

  decisions/                   ← ADRs (decisões arquiteturais imutáveis)
    DECISOES.md                  Registro cronológico
    ADR-NNN-*.md                 ADRs numeradas

  domain-specs/                ← Specs de domínio por entidade (PT-BR, kebab-case)
    README.md                    Índice + escopo
    glossario.md                 Termos do domínio que não se traduzem
    <entidade>.md                1 arquivo por entidade

  feature-specs/               ← Specs operacionais de tela
    README.md                    Mapeamento tela → {{PREFIXO}}-X + escopo

  runbooks/                    ← Procedimentos operacionais
    00-BOOTSTRAP.md              Ordem mestra de setup do zero
    SETUP-GITHUB.md, SETUP-SUPABASE.md, SETUP-LINEAR.md
    SETUP-CLAUDE-CODE.md         MCPs isolados por projeto
    DEPLOY.md, SMOKE-TEST.md

  tasks/                       ← Execução: ordem + briefings
    execution-order.md           Ordem das issues Todo do marco ativo (espelha Linear)
    task-specs/                  Briefings hidratados (uma spec por {{PREFIXO}}-X)
      task-spec-guide.md         Guia para escrever/hidratar
      archive/                   Task-specs concluídas (preservadas)

  tests/                       ← Test cases gerados pela IA
    test-case-registry.md        Registry append-only de TC-XXX

  templates/                   ← Templates reutilizáveis
    adr.md  runbook.md  task-spec.md  domain-spec.md  feature-spec.md
```

## Tarefas — Fluxo Linear ↔ Repo

Issues vivem no **Linear** (team `{{PROJETO}}`, prefixo `{{PREFIXO}}`). Specs de domínio e tela vivem no **repo** (`docs/domain-specs/` + `docs/feature-specs/`).

**Camadas:**

- **Linear (issues `{{PREFIXO}}-X`)** — unidade de execução. Descrição enxuta do sintoma.
- **Repo `docs/domain-specs/`** — entidades, regras de negócio detalhadas.
- **Repo `docs/feature-specs/`** — specs operacionais de tela.
- **Repo `docs/tasks/task-specs/{{PREFIXO}}-X-descricao.md`** — briefing hidratado. Criado ao puxar a issue.
- **Repo `docs/tasks/execution-order.md`** — índice ordenado das issues `Todo` do marco ativo.
- **Repo `docs/architecture/RULES.md`** — domain core estável.

### Fluxo do dev (12 passos)

Esteira projetada pra mitigar erros de premissa antes de codar e minimizar risco de regressão depois. Ao receber `puxe próxima` ou `puxe {{PREFIXO}}-X`, Claude executa **1-11 autonomamente** (silenciosamente, sem confirmações intermediárias). **Passo 12 sempre espera comando explícito** (`terminei a {{PREFIXO}}-X` ou `pode commitar`).

1. **Escolher issue** `Todo` no Linear → ordem canônica em [docs/tasks/execution-order.md](docs/tasks/execution-order.md).
2. **Sanity check da premissa.** Antes de hidratar, ler 1-2 arquivos centrais mencionados no título/descrição. A premissa bate com o código atual? Se issue está stale (já corrigida, escopo errado, premissa contradita), pausar (Gate C).
3. **Hidratar task-spec** em `docs/tasks/task-specs/{{PREFIXO}}-X-descricao.md` → ver [task-spec-guide.md](docs/tasks/task-specs/task-spec-guide.md).
4. **Preencher Regression Surface** (files touched, dependents, shared state, adjacent features). Profundidade escala com o que revela.
5. **Montar Plan** com trade-offs explicitados.
6. **Análise adversarial pré-impl.** 3 perguntas contra a spec recém-escrita: (a) cenário onde o fix falha? (b) arquivo no diff esperado que NÃO está em Files touched? (re-grep dos consumidores reais) (c) schema/migration/integração que a spec não mencionou? Output: `Análise ok` ou `Pause: <questão material>`. Material = premissa contradita, scope ≥2x maior, dependent ausente, mudança fora do plano. Cap: 1 iteração; se 2ª pausar, escalar pro dev (Gate C).
7. **Mover issue pra `In Progress`** + criar branch: `git checkout -b {{PREFIXO}}-X-descricao-curta`.
8. **Implementar.**
9. **Post-impl review.** Revalidar Regression Surface contra diff + `git diff --name-only` vs Files touched (discrepância = anotar como escopo legítimo OU reverter como creep) + marcar critérios verificados.
10. **Gerar Test Cases (TC-XXX)** com tag obrigatória: `[verified-by: code]` (`node --check` / `grep` / `tsc --noEmit` / automatizável) ou `[verified-by: user smoke]` (browser — Claude não consegue, delegado ao dev). Registrar em [docs/tests/test-case-registry.md](docs/tests/test-case-registry.md) (append-only).
11. **Arquivar task-spec** movendo pra `docs/tasks/task-specs/archive/`. Antes de arquivar, graduar o que emergiu de estável: (a) regra de negócio → [docs/architecture/RULES.md](docs/architecture/RULES.md); (b) termo de domínio cunhado/refinado → [docs/domain-specs/glossario.md](docs/domain-specs/glossario.md) ou o spec da entidade correspondente.
12. **Commit + merge na `dev`** _(esperar comando explícito do dev)_. Após `git merge --no-ff`: push da `dev`, mover issue pra `Done` no Linear, atualizar [docs/tasks/execution-order.md](docs/tasks/execution-order.md) (remover linha), **`git branch -d {{PREFIXO}}-X-descricao-curta`** (cleanup obrigatório). Promoção `dev → main` acontece em release (não por issue).

**Princípio:** passos 2, 4, 5, 6, 9, 10 existem pra TODA issue — triviais resolvem em minutos, complexas se expandem.

#### 5 gates de pausa autônoma

Fora destes, Claude executa silenciosamente 1-11. Quando pausar, formular proposta completa em uma rodada (todas as opções, todos os IDs) — evitar pingue-pongue.

- **Gate A.** Drift ambíguo no Linear (múltipla interpretação razoável da próxima issue, status inconsistente, etc.).
- **Gate B.** Bulk modify de estado compartilhado >3 itens (sweep de issues, mass update de DB via MCP Supabase, edição de múltiplos workflows).
- **Gate C.** Sanity check (passo 2) ou Análise adversarial (passo 6) revela problema material.
- **Gate D.** Conflict de merge não previsto durante implementação.
- **Gate E.** Falha não-óbvia (smoke test quebra de forma não-localizada, comportamento divergente da spec, erro não reproduzível).

### Ao criar issue

- **Sintoma enxuto, sem investigar código.**
- **Título com tag em prefixo:** `[BUG]`, `[FIX]`, `[MELHORIA]`, `[FEATURE]`, `[HOTFIX]`, `[DECIDIR]`
- **Label em inglês:** `Bug`, `Improvement`, `Feature`, `Hotfix`, `Decision`
- **Priority:** `Urgent`, `High`, `Medium` (padrão), `Low`
- **Project:** sempre o marco ativo (nunca buckets genéricos)
- **blockedBy:** mapear dependências
- **Branch sugerida:** `{{PREFIXO}}-X-descricao-curta` no corpo da issue
- **Spec longo (se houver):** linkar caminho do `docs/domain-specs/` ou `docs/feature-specs/` na descrição da issue
- **Nomenclatura de testes:** prefixo `TC-XXX`

### Linear workspace — referência rápida

- **Workspace:** `{{PROJETO_SLUG}}` (linear.app/{{PROJETO_SLUG}})
- **Team:** `{{PROJETO}}` · key `{{PREFIXO}}` · id `<PREENCHER no SETUP-LINEAR>`
- **Roadmap (fonte de verdade):** a lista de projects do Linear é o roadmap macro. Cada project = um "Marco". Sem doc-espelho no repo — a descrição de cada project carrega objetivo, escopo, definição de pronto e pré-condições.
  - **Marco 1 — `<nome do primeiro marco>`** · id `<PREENCHER>` · **ativo**
  - Marcos seguintes criados conforme o roadmap evolui.
- **Usuário real (conta de serviço Linear):** `<email-dedicado-ao-projeto>` (id `<PREENCHER>`). Conta dedicada ao projeto, separada da pessoal.
- **Pegadinha do MCP:** `assignee: "me"` resolve pra conta que autentica MCP. Sempre usar email explícito (`<email-dedicado-ao-projeto>`).
- **Status flow:** `Backlog` → `Todo` → `In Progress` → `Done`

> IDs e emails reais são preenchidos seguindo [docs/runbooks/SETUP-LINEAR.md](docs/runbooks/SETUP-LINEAR.md). Até lá, ficam como `<PREENCHER>`.

## Git Flow

Branches: `dev → main`

- Trabalho novo nasce em branch partindo de `dev` (ex: `{{PREFIXO}}-23-descricao`)
- Merge na `dev` quando issue fecha
- PR de `dev → main` pra release (dispara deploy em prod via Vercel)

**Uma issue por branch.** Facilita bisect de regressão.

### Promoção `dev → main` é decisão do Claude (dev é informado)

Claude decide autonomamente quando promover `dev → main`. O dev não pede — Claude propõe e executa após confirmação curta. **Sempre informar antes de fazer**, mas a iniciativa vem de Claude.

**Critérios pra propor promoção:**

1. **Bloco coeso de features pronto** — não promove a cada issue. Espera 2-3 issues que fazem sentido juntas como "release notes".
2. **Nada "visivelmente quebrado" em prod** — links que dão 404, telas em branco, fluxos cortados pela metade. Polish de design e doc são OK promover standalone.
3. **Antes do cutover/go-live** — promoção obrigatória pra colocar `dev` inteiro em `main`.
4. **Hotfix urgente** — pula a regra do bloco, vai direto.

**Como propor:** ao detectar que algum critério bate, abrir frase curta no fim de uma resposta: "Achei que é hora de promover `dev → main` — bloco X + Y + Z. Confirma?". Se topar, executar imediatamente. Se não, anotar o próximo gatilho esperado e seguir.

**Não promover sem informar.** Mesmo quando óbvio, sempre anunciar antes do `git push origin main`.

> **Por que sem `staging`:** ambiente único (prod) enquanto for 1 dev / pré-primeiro-cliente. Branch `staging` não existe. Volta a fazer sentido com 2º dev OU primeiro cliente pagante.

## Esteira de Desenvolvimento

```
Ideia/bug →
  Linear issue {{PREFIXO}}-X (execução, daily aloca pro marco)
    → Claude adiciona {{PREFIXO}}-X em docs/tasks/execution-order.md
      → Dev fala "puxe próxima" ou "puxe {{PREFIXO}}-X"
        → [autônomo 1-11] Sanity check da premissa
          → Hidrata task-spec (docs/tasks/task-specs/{{PREFIXO}}-X.md)
            → Regression Surface + Plan
              → Análise adversarial pré-impl (3 perguntas contra a spec)
                → Move {{PREFIXO}}-X pra In Progress + cria branch {{PREFIXO}}-X-desc
                  → Implementa
                    → Post-impl review (revalida + git diff --name-only)
                      → Test Cases TC-XXX [verified-by: code|user smoke]
                        → Registra TCs em docs/tests/test-case-registry.md
                          → Arquiva task-spec em docs/tasks/task-specs/archive/
                            → [pausa] Espera dev: "terminei a {{PREFIXO}}-X" / "pode commitar"
                              → [12] Commit + merge na dev (no-ff) + push
                                → Move {{PREFIXO}}-X pra Done no Linear
                                  → Remove de docs/tasks/execution-order.md
                                    → git branch -d {{PREFIXO}}-X-desc (cleanup obrigatório)
                                      (release dev → main em sprint separado)
```

- **Não criar issue sem priorização.** Bug/ideia passa pela daily primeiro. Exceção: HOTFIX pula direto.
- **Uma issue por branch.**
- **Modo autônomo:** ao receber `puxe próxima` / `puxe {{PREFIXO}}-X`, Claude executa passos 1-11 sem confirmação intermediária. Pausa apenas nos 5 gates (A-E acima). Passo 12 sempre espera comando explícito.

## Manutenção da execution-order

[docs/tasks/execution-order.md](docs/tasks/execution-order.md) é mantido automaticamente por Claude em três gatilhos. **Linear é a fonte de verdade.**

**Gatilho 1 — Issue concluída** (dev fala "terminei a {{PREFIXO}}-X"):

1. Mover issue pra `Done` no Linear (via MCP)
2. Remover linha de execution-order.md
3. Sugerir commit

**Gatilho 2 — Issue nova criada no marco ativo:**

1. Criar issue no Linear (via MCP)
2. Adicionar linha em execution-order.md com posição sugerida + racional (considerar `blockedBy`, priority, risco de conflito de merge)
3. Informar ao dev a posição escolhida

**Gatilho 3 — Drift detectado** (ao consultar execution-order pra responder "qual a próxima?"):

1. Rodar `list_issues` no Linear filtrado por projeto + state `Todo` antes de responder
2. Se houver divergência, regrava silenciosamente antes de responder
3. Avisar ao dev que houve drift e foi corrigido

**Regra:** o arquivo nunca é editado manualmente pelo dev.

## Configuração específica do projeto

> **Princípio:** instruções versionáveis deste projeto vivem **dentro do repo** (`AGENTS.md`, `CLAUDE.md`, `docs/`). Configurações locais de assistentes vivem no diretório do projeto em pastas ignoradas pelo Git (`.claude/`, `.codex/`). **Nada de comportamento ou permissão específica do {{PROJETO}} deve ir pra `~/.claude/`, `~/.codex/` global ou memória global** — esses contextos são compartilhados com outros projetos do mesmo computador e vazariam.
>
> Em especial, **MCPs com credenciais por projeto (Supabase, Linear) ficam em escopo `local`, nunca `user`/global** — ver [docs/runbooks/SETUP-CLAUDE-CODE.md](docs/runbooks/SETUP-CLAUDE-CODE.md). Auditar isolamento periodicamente.
>
> O comportamento autônomo da esteira (1-11 silencioso, pausar só nos 5 gates, passo 12 espera comando) está integral em [Fluxo do dev (12 passos)](#fluxo-do-dev-12-passos). Esse é o ponteiro único — não há memory file espelho em `~/.claude/projects/`.
>
> Para Codex, ver [AGENTS.md](AGENTS.md) e [docs/runbooks/SETUP-CLAUDE-CODE.md](docs/runbooks/SETUP-CLAUDE-CODE.md).

## Para devs (conversa direta)

**Disparar a esteira (modo autônomo, executa 1-11 sem perguntar):**

- `puxe próxima` → Claude pega o topo da execution-order e executa passos 1-11 silenciosamente. Pausa só nos 5 gates (A-E) ou quando atingir o passo 12.
- `puxe {{PREFIXO}}-X` → mesmo fluxo, mas com issue específica.
- Ao final do passo 11, Claude reporta status compacto e espera `terminei a {{PREFIXO}}-X` / `pode commitar` pra disparar passo 12.

**Status de issue (atalhos manuais):**

- `terminei a {{PREFIXO}}-10` → Claude executa passo 12 (commit + merge --no-ff + push + Done no Linear + remove da execution-order + `git branch -d`)
- `comecei a {{PREFIXO}}-10` → Claude move pra `In Progress` no Linear (sem disparar esteira inteira)
- `qual a próxima?` → Claude consulta execution-order + valida contra Linear (gatilho 3) + responde sem executar

## Quando parar e perguntar

No modo autônomo (1-11), Claude pausa **apenas nos 5 gates** definidos em [Fluxo do dev (12 passos)](#fluxo-do-dev-12-passos):

- **Gate A — drift ambíguo no Linear:** múltipla interpretação razoável da próxima issue.
- **Gate B — bulk modify >3 itens:** sweep de issues, mass update via MCP Supabase, edição de múltiplos workflows.
- **Gate C — sanity check ou análise adversarial revela problema material:** premissa contradita, scope ≥2x maior, dependent ausente.
- **Gate D — conflict de merge não previsto** durante implementação.
- **Gate E — falha não-óbvia:** smoke test quebra de forma não-localizada, comportamento divergente da spec.

Fora dos gates, executar silenciosamente. Quando pausar, formular proposta completa em uma rodada (todas as opções, todos os IDs) — evitar pingue-pongue.

**Outras situações que justificam pausa (fora da esteira automática):**

- Regra de negócio ambígua em RULES.md ou domain-specs/ — **inclui a seção Domínio/Stack ainda não preenchida**
- Decisão arquitetural que afeta múltiplas issues
- Alternativa técnica com trade-off real (ex: duas bibliotecas viáveis)
- Código/banco contradiz o que está documentado
- Precisaria criar novo arquivo fora da estrutura definida

É melhor pausar por 30 segundos do que executar errado por 30 minutos.

## O que NÃO fazer

- Inventar regras de negócio que não estão documentadas
- Pular para a próxima issue sem fechar a atual no Linear
- Criar commits enormes misturando múltiplas issues
- Criar novos tipos de arquivo ou pastas sem autorização
- Traduzir termos próprios do domínio para inglês
- Editar `execution-order.md` manualmente (Claude regrava)
- Skip de Husky hooks (`--no-verify`) sem motivo declarado
- Adicionar MCP com credencial em escopo `user`/global (vaza pra outros projetos)

## Ao final de cada sessão

1. Se criou/modificou arquivos relevantes, verificar se [docs/architecture/CODEBASE.md](docs/architecture/CODEBASE.md) precisa atualizar
2. **Se aplicou migration / criou tabela / mudou enum / coluna / RLS policy**, atualizar [docs/architecture/DADOS.md](docs/architecture/DADOS.md) e o campo `Atualizado:` no topo
3. Sugerir commit com nome descritivo prefixado por `{{PREFIXO}}-X:` se relacionado a issue
