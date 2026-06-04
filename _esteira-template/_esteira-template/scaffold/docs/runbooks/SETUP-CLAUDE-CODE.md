# SETUP-CLAUDE-CODE — MCPs isolados por projeto ({{PROJETO}})

| Campo           | Valor          |
| --------------- | -------------- |
| Criado em       | `<YYYY-MM-DD>` |
| Última execução | `—`            |
| Responsável     | `<Nome>`       |

> Configurar Claude Code + MCP Linear/Supabase **isolados a este projeto** — nada vaza pra outros projetos do mesmo computador. Etapa 4 do [00-BOOTSTRAP](00-BOOTSTRAP.md). Codex análogo no fim.

---

## 1. Quando usar

Após criar conta Supabase ([SETUP-SUPABASE](SETUP-SUPABASE.md)) e Linear ([SETUP-LINEAR](SETUP-LINEAR.md)) — você precisa do PAT do Supabase (`sbp_...`) e da Personal API key do Linear (`lin_api_...`).

---

## 2. Onde vivem as configs (e por que escopo importa)

MCP servers são configurados via `claude mcp add` e gravados em `~/.claude.json`. Existem 3 escopos:

| Escopo | Onde grava | Alcance | Usar pra |
| ------ | ---------- | ------- | -------- |
| `local` | `~/.claude.json` em `.projects["<caminho-deste-repo>"]` | **só este diretório** | ✅ MCPs com credencial por projeto (Supabase, Linear) |
| `project` | `.mcp.json` versionado no repo | quem clonar o repo | só MCP **sem segredo** (commitaria token) |
| `user` | `~/.claude.json` raiz (`.mcpServers`) | **TODOS os projetos do usuário** | ❌ nunca pra credencial por projeto |

**`.claude/settings.local.json` do projeto é só pra permissões/settings — a chave `mcpServers` ali é ignorada.** Pra MCP, usar `claude mcp add --scope local`.

### ⚠️ NUNCA usar escopo `user` para MCP com credencial por projeto

**Regra crítica.** MCP em `--scope user` vaza pra todos os projetos do computador. Pra Supabase (escopado por `--project-ref`) isso é perigoso: o Claude Code rodando **neste** projeto pode estar com o MCP apontando pro banco de **outro** produto — `execute_sql`/`apply_migration` rodam no banco errado sem aviso.

> Caso real (outro projeto): `supabase` em escopo `user` apontava pro ref de um produto B; ao rodar Claude Code no produto A, queries iam pro B. Só não corrompeu porque a tabela esperada não existia lá e o erro travou. Remédio: mover Supabase pra escopo `local` em todos os projetos, limpar o escopo `user`.

**Sempre `--scope local`** pra Supabase e Linear. Auditar isolamento periodicamente (seção 5).

### Conectores `claude.ai` web também são globais

Conectores gerenciados pela conta claude.ai (`claude.ai Linear`, etc.) aparecem em `claude mcp list` mas **não** estão no `~/.claude.json` — são da conta claude.ai inteira (todos os projetos). **Desconectar** o `Linear` em [claude.ai → Settings → Conectores] e usar só o MCP `local` deste projeto. Confirmar: `claude mcp list` não deve listar `claude.ai Linear`.

---

## 3. Passos

> Rodar **dentro do diretório do projeto** — o escopo `local` vincula ao `$PWD`.

```bash
cd <caminho-do-projeto>
```

### 1. Instalar Claude Code

[claude.com/claude-code](https://claude.com/claude-code). `claude --version` pra confirmar.

### 2. Desconectar conector claude.ai Linear global (se houver)

[claude.ai → Settings → Conectores] → desconectar `Linear`. (Evita conflito com o MCP local.)

### 3. Adicionar MCP Linear (escopo local, HTTP + Personal API key)

```bash
claude mcp add-json linear --scope local '{
  "type": "http",
  "url": "https://mcp.linear.app/mcp",
  "headers": { "Authorization": "Bearer lin_api_<SUA_KEY>" }
}'
```

Smoke (valida token + workspace):

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: lin_api_<SUA_KEY>" -H "Content-Type: application/json" \
  -d '{"query":"{ viewer { email } organization { name urlKey } }"}'
# esperado: viewer = <email-dedicado>, organization.urlKey = {{PROJETO_SLUG}}
```

### 4. Adicionar MCP Supabase (escopo local, stdio, escopado por project-ref)

```bash
claude mcp add supabase \
  --scope local \
  -e SUPABASE_ACCESS_TOKEN=sbp_<SEU_PAT> \
  -- npx -y @supabase/mcp-server-supabase@latest \
  --project-ref <PROJECT_REF> --read-only
```

Flags do server:

| Flag | Efeito |
| ---- | ------ |
| `--project-ref` | escopa a 1 projeto, desabilita "account tools" (anti-leak) — **sempre usar** |
| `--read-only` | conexão Postgres read-only (SELECT ok, DML/DDL falha) — recomendado no dia a dia |

> Mantém `--read-only` ligado. Desligar só temporariamente e deliberadamente se decidir usar `apply_migration` via MCP — o padrão do projeto é migration via arquivo versionado + `supabase db push` (ver política abaixo). `--read-only` omitido = read-write (perigoso como default).

Smoke:

```bash
TOKEN=$(jq -r --arg p "$PWD" '.projects[$p].mcpServers.supabase.env.SUPABASE_ACCESS_TOKEN' ~/.claude.json)
curl -s "https://api.supabase.com/v1/projects/<PROJECT_REF>" \
  -H "Authorization: Bearer $TOKEN" | jq '{name,region,status}'
# esperado: status = ACTIVE_HEALTHY
```

### 5. Verificar e reiniciar

```bash
claude mcp list   # linear e supabase → ✓ Connected, escopo local
```

Reiniciar o Claude Code (2x se as tools não aparecerem: 1 carrega config, 1 registra tools após auth).

---

## 4. Política de uso do MCP Supabase (leitura no dia a dia)

**Permitido:** `list_tables`, `list_extensions`, `list_migrations`, `get_logs`, `get_advisors`, `generate_typescript_types`, `execute_sql` **SELECT only**.

**Proibido via MCP** (vai pra arquivo versionado + comando deliberado):

- `apply_migration` — toda mudança de schema vem de `supabase/migrations/*.sql` via `supabase db push` em commit explícito
- `execute_sql` com DML (INSERT/UPDATE/DELETE) ou DDL (ALTER/CREATE/DROP)
- `deploy_edge_function`, `create/delete/merge/reset/rebase_branch`

Migration arriscada (drop/rename/change type/backfill grande): **Supabase Branch efêmera** pelo dashboard, validar, depois aplicar em prod.

---

## 5. Auditoria de isolamento

Rodar **periodicamente** e **sempre antes de operação destrutiva**:

```bash
jq -r '
"GLOBAL: \(.mcpServers // {} | keys | join(", ") | if . == "" then "(vazio ok)" else . + " VAZAMENTO" end)",
(.projects | to_entries[] | select(.value.mcpServers and (.value.mcpServers | length > 0)) |
"\n[\(.key | split("/") | .[-2:] | join("/"))]\n  MCPs: \(.value.mcpServers | keys | sort | join(", "))\n  Supabase ref: \(.value.mcpServers.supabase.args // [] | (.[index("--project-ref") + 1] // "(sem)"))")
' ~/.claude.json
```

**Esperado:**

- `GLOBAL: (vazio ok)` — nenhum MCP em escopo `user`
- Este projeto com **seu próprio** `Supabase ref` (`<PROJECT_REF>`)
- Nunca o mesmo ref em projetos diferentes

Se o ref estiver errado, **parar e investigar antes de qualquer `execute_sql` mutativo ou `apply_migration`**.

Alias útil no `~/.zshrc`:

```bash
alias mcp-audit='jq -r "<query-acima>" ~/.claude.json'
```

---

## 6. Codex (opcional, mesmo isolamento)

Codex lê instruções de `AGENTS.md` → que aponta pra `CLAUDE.md`. MCPs do Codex ficam em `.codex/config.toml` **dentro do checkout** (`.codex/` está no `.gitignore` — não sobe pro GitHub). Não usar `codex mcp add`/`codex mcp login` (gravam em `~/.codex` global).

`.codex/config.toml`:

```toml
[mcp_servers.linear]
command = "zsh"
args = ["-lc", "MCP_REMOTE_CONFIG_DIR=\"$PWD/.codex/mcp-auth\" exec npx -y mcp-remote https://mcp.linear.app/mcp --auth-timeout 120"]

[mcp_servers.supabase]
command = "zsh"
args = ["-lc", "token=$(jq -r --arg p \"$PWD\" '.projects[$p].mcpServers.supabase.env.SUPABASE_ACCESS_TOKEN // empty' ~/.claude.json); test -n \"$token\" || { echo 'sem SUPABASE_ACCESS_TOKEN p/ este projeto' >&2; exit 1; }; SUPABASE_ACCESS_TOKEN=\"$token\" exec npx -y @supabase/mcp-server-supabase@latest --project-ref <PROJECT_REF> --read-only"]
```

Reaproveita o token já configurado no `~/.claude.json` filtrando por `$PWD` — não copia segredo pro `.codex/config.toml`. Verificar: `codex mcp list` / `codex mcp get supabase` (deve conter `--project-ref <PROJECT_REF> --read-only`).

---

## 7. Verificação

- [ ] `claude mcp list` → `linear` e `supabase` `✓ Connected`, escopo **local**
- [ ] Smoke Linear → workspace `{{PROJETO_SLUG}}`
- [ ] Smoke Supabase → projeto `ACTIVE_HEALTHY`
- [ ] Auditoria: `GLOBAL: (vazio ok)`, ref correto neste projeto
- [ ] Nenhum conector `claude.ai Linear` global
- [ ] (Codex, se usado) `.codex/config.toml` local, nada em `~/.codex` global

---

## 8. Troubleshooting

- **Tool não aparece após `add`:** `claude mcp list`; se OK, reiniciar Claude Code 2x.
- **`settings.local.json` tem `mcpServers`:** ignorado. Remover e reconfigurar via `claude mcp add --scope local`.
- **Supabase "Failed to connect":** flag inválida pra versão do server. `npm view @supabase/mcp-server-supabase version` e conferir flags.
- **Linear/Supabase de outro projeto:** rodar auditoria. Quase sempre MCP em escopo `user` ou conector claude.ai global. Remover e re-adicionar `--scope local`.
- **Token expirou:** `claude mcp remove <name>` + `add` com token novo.

---

## 9. Histórico

| Data | Responsável | Observações |
| ---- | ----------- | ----------- |
| `<YYYY-MM-DD>` | `<Nome>` | `<o que rolou>` |
