# INDEX.md — Mapa de Documentação do {{PROJETO}}

Atualizado: `<YYYY-MM-DD do bootstrap>`

> Mapa canônico de todos os documentos do projeto. Antes de implementar, consulte este mapa para saber onde encontrar cada informação.

---

## Estrutura

```
AGENTS.md                    <- Entrada de instruções para Codex
CLAUDE.md                    <- Fluxo operacional completo para agentes

docs/
  INDEX.md                   <- ESTE ARQUIVO

  architecture/              <- Stack e camadas técnicas (CAIXA ALTA)
    CODEBASE.md                Mapa de arquivos implementados
    DADOS.md                   Arquitetura de dados (RLS, schema)
    RULES.md                   Regras de negocio e fluxos criticos
    UI-UX.md                   Guideline visual

  decisions/                 <- ADRs (decisões arquiteturais imutáveis)
    DECISOES.md                Registro cronologico
    ADR-NNN-*.md               ADRs numeradas

  domain-specs/              <- Specs de domínio por entidade (PT-BR, kebab-case)
    README.md                  Índice
    glossario.md               Termos do domínio que não se traduzem
    <entidade>.md

  feature-specs/             <- Specs operacionais de tela
    README.md                  Mapeamento tela → {{PREFIXO}}-X

  runbooks/                  <- Procedimentos operacionais
    00-BOOTSTRAP.md            Ordem mestra de setup do zero
    SETUP-GITHUB.md  SETUP-SUPABASE.md  SETUP-LINEAR.md
    SETUP-CLAUDE-CODE.md       MCPs isolados por projeto
    DEPLOY.md  SMOKE-TEST.md

  tasks/                     <- Execução: ordem + briefings
    execution-order.md         Ordem das issues Todo do marco ativo
    task-specs/                Briefings hidratados (uma spec por {{PREFIXO}}-X)
      task-spec-guide.md       Guia para escrever/hidratar
      archive/                 Task-specs concluídas

  tests/                     <- Test cases gerados pela IA
    test-case-registry.md      Registry append-only de TC-XXX

  templates/                 <- Templates reutilizáveis
    adr.md  runbook.md  task-spec.md  domain-spec.md  feature-spec.md
```

---

## Guia rápido: "Onde encontro...?"

| Preciso saber...                       | Leia                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------ |
| Como configurar tudo do zero           | `runbooks/00-BOOTSTRAP.md`                                                                  |
| Regras de negócio e fluxos críticos    | `architecture/RULES.md` (domain core) + `domain-specs/<entidade>.md` (detalhe por entidade) |
| Onde fica cada arquivo de código       | `architecture/CODEBASE.md`                                                                  |
| Schema do banco + RLS                  | `architecture/DADOS.md` + migrations em `supabase/migrations/`                              |
| Decisão arquitetural histórica         | `decisions/DECISOES.md` (cronológico) + `decisions/ADR-NNN-*.md` (densas)                   |
| Roadmap (marcos do produto)            | Linear: lista de projects do team `{{PROJETO}}`. Sem doc-espelho no repo                    |
| Issues em execução                     | Linear (workspace `{{PROJETO_SLUG}}`, team `{{PROJETO}}`, prefixo `{{PREFIXO}}`)            |
| Ordem das issues do marco ativo        | `tasks/execution-order.md`                                                                  |
| Briefings hidratados                   | `tasks/task-specs/{{PREFIXO}}-X-*.md`                                                       |
| Task-specs concluídas                  | `tasks/task-specs/archive/`                                                                 |
| Test cases por issue                   | `tests/test-case-registry.md`                                                               |
| Configurar Claude Code / Codex / MCPs  | `runbooks/SETUP-CLAUDE-CODE.md`                                                             |
| Como fazer deploy                      | `runbooks/DEPLOY.md`                                                                        |
| Smoke test pós-deploy                  | `runbooks/SMOKE-TEST.md`                                                                    |
| Spec operacional de tela               | `feature-specs/<tela>.md` (uma tela por arquivo, mapeada pra {{PREFIXO}}-X)                 |
| Domain spec de uma entidade            | `domain-specs/<entidade>.md`                                                                |

---

## O que mora em qual arquivo (regra anti-duplicação)

**Antes de adicionar conteúdo novo, consulte aqui pra saber onde escrever.**

| Tema                                                                     | Onde mora                                       | NÃO duplicar em                               |
| ------------------------------------------------------------------------ | ----------------------------------------------- | --------------------------------------------- |
| **Histórico cronológico de decisões** (porquê, alternativas, trade-offs) | `decisions/DECISOES.md`                         | RULES.md, CLAUDE.md, ADRs                      |
| **ADR formal** (decisão densa com análise de alternativas)               | `decisions/ADR-NNN-*.md`                        | DECISOES.md (só link curto)                   |
| **Estado atual consultável** (regras vigentes, sem motivo histórico)     | `architecture/RULES.md`                         | DECISOES.md (RULES.md aponta pra DECISOES.md) |
| **Termos do domínio** (catálogo)                                         | `domain-specs/glossario.md`                     | qualquer outro lugar                          |
| **Máquinas de estado / regras numeradas (RN-001) / fluxos (FC-01)**      | `architecture/RULES.md`                         | qualquer outro lugar                          |
| **Schema do banco** (DDL, RLS, índices)                                  | `architecture/DADOS.md` + `supabase/migrations/` | RULES.md (pointer apenas)                     |
| **Mapa de arquivos do código**                                           | `architecture/CODEBASE.md`                      | qualquer outro lugar                          |
| **Guideline visual / UI**                                                | `architecture/UI-UX.md`                         | qualquer outro lugar                          |
| **Roadmap macro** (marcos do produto, escopo, gates)                     | Linear projects                                 | repo (`docs/`)                                |
| **Issue específica em execução**                                         | Linear ({{PREFIXO}}-X) + task-spec hidratada    | DECISOES, RULES                               |
| **Domain spec longa de uma entidade**                                    | `domain-specs/<entidade>.md`                    | RULES.md (só pointer curto)                   |
| **Spec operacional de tela**                                             | `feature-specs/<tela>.md`                       | qualquer outro lugar                          |
| **Convenções de código + workflow**                                      | `CLAUDE.md` (raiz)                              | qualquer outro lugar                          |
| **Setup operacional** (bootstrap, deploy, MCP, smoke test)               | `runbooks/*.md`                                 | qualquer outro lugar                          |

### Regra prática: pointer em vez de cópia

Quando RULES.md (estado atual) e DECISOES.md (porquê) tocam no mesmo tema: **DECISOES.md** carrega o conteúdo completo (motivo, alternativas, trade-offs); **RULES.md** traz só o veredito curto (1-3 linhas) + link pra decisão. Quando uma decisão é revogada, o pointer em RULES.md aponta pra mais recente. RULES nunca tem decisão obsoleta visível.

---

## Regras para o agente

1. Antes de implementar feature: leia este mapa → identifique docs relevantes → leia-os.
2. **Antes de adicionar conteúdo novo a qualquer doc, consulte a tabela "O que mora em qual arquivo".**
3. Spec é a intenção, código é a realidade.
4. Não criar novos `.md` sem propósito. Prefira atualizar os existentes. Se criar, atualize este mapa.
5. Ao final de cada sessão: verifique se decisões tomadas precisam ser refletidas nos docs.
