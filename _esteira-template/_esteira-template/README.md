# _esteira-template

Template reutilizável da **esteira de desenvolvimento** (fluxo Linear ↔ repo, 12 passos, 5 gates, modo autônomo, MCP isolado por projeto, docs estruturados). Extraído e genericizado do projeto Jusli — **só a camada de processo**, zero conteúdo de domínio.

Stack-alvo do scaffold: **Next.js + Supabase** (app único, ambiente único prod, deploy Vercel).

## O que tem aqui

```
_esteira-template/
├── init.sh          # instancia a esteira num projeto novo (troca os tokens)
├── README.md        # este arquivo
└── scaffold/        # o que é copiado pra cada projeto
    ├── CLAUDE.md          # fluxo operacional completo p/ agentes (12 passos, gates)
    ├── AGENTS.md          # entrada p/ Codex (aponta p/ CLAUDE.md)
    ├── README.md  SECURITY.md  .gitignore  .claude/
    └── docs/
        ├── INDEX.md
        ├── architecture/  (RULES, CODEBASE, DADOS, UI-UX — esqueletos)
        ├── decisions/     (DECISOES.md — registro cronológico)
        ├── domain-specs/  (README + glossario — vazios, preencher no projeto)
        ├── feature-specs/ (README — vazio)
        ├── runbooks/      ← setup DO ZERO (contas + repo + banco + MCP):
        │     00-BOOTSTRAP · SETUP-GITHUB · SETUP-SUPABASE
        │     SETUP-LINEAR · SETUP-CLAUDE-CODE · DEPLOY · SMOKE-TEST
        ├── tasks/          (execution-order + task-spec-guide + archive)
        ├── tests/          (test-case-registry)
        └── templates/      (adr, runbook, task-spec, domain-spec, feature-spec)
```

## Tokens

Apenas **um valor a decidir**: o **nome do projeto**. O resto é derivado.

| Token              | O que é                  | Como é resolvido          |
| ------------------ | ------------------------ | ------------------------- |
| `{{PROJETO}}`      | nome de exibição (`Acme`) | argumento do `init.sh`    |
| `{{PROJETO_SLUG}}` | kebab lowercase (`acme`)  | derivado do nome          |
| `{{PREFIXO}}`      | key Linear (`ACME`)       | derivado do nome (override opcional) |

Valores criados durante o bootstrap (project-ref do Supabase, IDs do Linear, emails) ficam como `<PREENCHER>` e são resolvidos seguindo os runbooks `SETUP-*`.

## Como usar (projeto novo)

```bash
cd /Users/pettersonpalumbo/Documents/Projetos/_esteira-template
./init.sh "Nome Do Projeto" /caminho/para/o/repo-novo
# prefixo Linear custom (opcional):
./init.sh "Nome Do Projeto" /caminho/para/o/repo-novo PREF
```

Depois, no projeto gerado: seguir `docs/runbooks/00-BOOTSTRAP.md` (cria contas GitHub/Supabase/Linear do zero, configura MCP isolado) e preencher as seções **Projeto / Domínio / Stack** do `CLAUDE.md`. Enquanto essas seções estiverem vazias, os agentes pausam antes de inventar regra de negócio — é de propósito.

## Manutenção do template

Se a esteira evoluir num projeto (novo gate, mudança no fluxo de 12 passos, runbook melhor), **traga a melhoria de volta pra `scaffold/`** aqui antes de instanciar o próximo projeto. Template desatualizado vira ficção. Não trazer conteúdo de domínio de nenhum projeto pra cá.
