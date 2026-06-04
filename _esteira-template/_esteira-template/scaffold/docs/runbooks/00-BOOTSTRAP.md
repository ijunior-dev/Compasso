# 00-BOOTSTRAP — Subir o {{PROJETO}} do zero

| Campo           | Valor          |
| --------------- | -------------- |
| Criado em       | `<YYYY-MM-DD>` |
| Última execução | `—`            |
| Responsável     | `<Nome>`       |

> Ordem mestra pra sair do nada (sem repo, sem contas) até a esteira rodando: você fala `puxe próxima` e Claude executa o fluxo de 12 passos. Cada etapa abaixo tem um runbook próprio com o detalhe — aqui é só a sequência e o porquê da ordem.

---

## 1. Quando usar

Uma vez, no início do projeto. Reexecutar só ao provisionar um ambiente totalmente novo (troca de conta, fork pra outro produto).

---

## 2. Pré-requisitos

- Node ≥ 20, `git`, `gh` (GitHub CLI), `<pnpm|npm|bun>` instalados
- Claude Code instalado ([claude.com/claude-code](https://claude.com/claude-code))
- Cartão/identidade pra confirmar contas (todas têm tier grátis suficiente pro início)
- Decidido: **nome do projeto** (`{{PROJETO}}`), **slug** (`{{PROJETO_SLUG}}`), **prefixo Linear** (`{{PREFIXO}}`) — já aplicados no template via `init.sh`

---

## 3. Ordem de execução

> Cada item é um runbook. Fazer **nesta ordem** — cada um produz um valor que o próximo consome.

### Etapa 1 — GitHub → [SETUP-GITHUB.md](SETUP-GITHUB.md)

Criar conta (se não tiver) + 2FA, criar repo `{{PROJETO_SLUG}}`, push do scaffold, branches `main` e `dev`, proteger `main`. **Produz:** repo remoto + branch `dev` (onde todo trabalho nasce).

### Etapa 2 — Supabase → [SETUP-SUPABASE.md](SETUP-SUPABASE.md)

Criar conta + 2FA, criar org, criar projeto (prod, ambiente único), pegar URL + keys, Personal Access Token, `.env.local`. **Produz:** `project-ref`, keys, token — consumidos pelo app e pelo MCP.

### Etapa 3 — Linear → [SETUP-LINEAR.md](SETUP-LINEAR.md)

Criar conta de serviço dedicada (`<email-dedicado>`), workspace `{{PROJETO_SLUG}}`, team `{{PROJETO}}` (key `{{PREFIXO}}`), status flow `Backlog→Todo→In Progress→Done`, labels, priority, project "Marco 1". Preencher os `<PREENCHER>` de `CLAUDE.md` (team id, marco id, email). **Produz:** workspace + IDs que o MCP e a esteira usam.

### Etapa 4 — Claude Code + MCPs isolados → [SETUP-CLAUDE-CODE.md](SETUP-CLAUDE-CODE.md)

Configurar MCP Linear + Supabase **em escopo `local`** (vinculado a este diretório, nunca global). Auditoria de isolamento. (Codex análogo via `.codex/`.) **Produz:** Claude Code falando com Linear e Supabase **deste** projeto e só dele.

### Etapa 5 — App Next.js + primeira migration

Criar o app Next.js (`<pnpm|npm|bun> create next-app` ou equivalente), conectar Supabase (cliente server/browser em `lib/`), primeira migration de schema em `supabase/migrations/`. Registrar topologia em [CODEBASE.md](../architecture/CODEBASE.md) e schema em [DADOS.md](../architecture/DADOS.md).

### Etapa 6 — Deploy → [DEPLOY.md](DEPLOY.md) + [SMOKE-TEST.md](SMOKE-TEST.md)

Importar repo na Vercel (branch prod = `main`), env vars apontando pro Supabase prod, primeiro deploy via push em `main`, smoke test.

### Etapa 7 — Preencher domínio

Preencher as seções **Projeto / Domínio / Stack** do [CLAUDE.md](../../CLAUDE.md) e o glossário. Enquanto vazias, agentes pausam antes de inventar regra de negócio (é de propósito).

### Etapa 8 — Esteira rodando

Criar as primeiras issues no Linear (marco 1), Claude adiciona em [execution-order.md](../tasks/execution-order.md). Dev fala `puxe próxima` → fluxo de 12 passos do [CLAUDE.md](../../CLAUDE.md) começa.

---

## 4. Verificação

- [ ] `gh repo view` mostra `{{PROJETO_SLUG}}`; branches `main` + `dev` em origin; `main` protegida
- [ ] Supabase: projeto ACTIVE_HEALTHY; `.env.local` com URL + keys; PAT guardado
- [ ] Linear: workspace + team `{{PREFIXO}}` + status flow + project Marco 1; `<PREENCHER>` do CLAUDE.md resolvidos
- [ ] `claude mcp list` → `linear` e `supabase` `✓ Connected`, **escopo local**
- [ ] Auditoria de isolamento: `GLOBAL` vazio (ver SETUP-CLAUDE-CODE.md)
- [ ] App Next.js sobe local e conecta no Supabase
- [ ] Deploy em prod verde + smoke test ok
- [ ] CLAUDE.md § Projeto/Domínio/Stack preenchidas
- [ ] Primeira issue {{PREFIXO}}-1 criada e `puxe próxima` funciona

---

## 5. Troubleshooting

- **MCP aponta pro projeto errado:** rodar auditoria de isolamento (SETUP-CLAUDE-CODE.md). Quase sempre é MCP adicionado em escopo `user` por engano — remover e re-adicionar com `--scope local`.
- **Claude inventa regra de negócio:** seção Domínio do CLAUDE.md ainda vazia. É esperado pausar — preencher Etapa 7.

---

## 6. Histórico

| Data | Responsável | Observações |
| ---- | ----------- | ----------- |
| `<YYYY-MM-DD>` | `<Nome>` | `<o que rolou>` |
