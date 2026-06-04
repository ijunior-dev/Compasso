# SETUP-LINEAR — Conta, workspace e team do {{PROJETO}}

| Campo           | Valor          |
| --------------- | -------------- |
| Criado em       | `<YYYY-MM-DD>` |
| Última execução | `—`            |
| Responsável     | `<Nome>`       |

> Do zero: criar conta de serviço dedicada, workspace, team `{{PREFIXO}}`, status flow, labels, priority, project Marco 1, e preencher os `<PREENCHER>` do `CLAUDE.md`. Etapa 3 do [00-BOOTSTRAP](00-BOOTSTRAP.md). Linear é a **fonte de verdade** das issues — o repo só espelha em `execution-order.md`.

---

## 1. Quando usar

Início do projeto. Workspace ainda não existe.

---

## 2. Pré-requisitos

- Um email **dedicado ao projeto** (ex: `{{PROJETO_SLUG}}.dev@gmail.com`). Recomendado separar da conta pessoal — o MCP autentica como essa conta e `assignee: "me"` resolve pra ela.

---

## 3. Passos

### 1. Criar a conta de serviço + workspace

1. [linear.app](https://linear.app) → Sign up com o **email dedicado** `<email-dedicado>`
2. Criar workspace: **Name** `{{PROJETO}}`, **URL** `{{PROJETO_SLUG}}` (→ `linear.app/{{PROJETO_SLUG}}`)
3. Plano Free serve pro início

### 2. Configurar o team

- O Linear cria um team inicial. Renomear/criar: **Name** `{{PROJETO}}`, **Identifier (key)** `{{PREFIXO}}` (issues ficam `{{PREFIXO}}-1`, `{{PREFIXO}}-2`, ...)
- Settings do team → **Workflow / Statuses**: garantir exatamente o fluxo da esteira:

  `Backlog` → `Todo` → `In Progress` → `Done` (+ `Canceled`/`Duplicate` se quiser)

  (Remover status extras que não usamos pra não criar drift na execution-order.)

### 3. Labels (em inglês, conforme CLAUDE.md § Ao criar issue)

Criar labels no team: `Bug`, `Improvement`, `Feature`, `Hotfix`, `Decision`.

Priority é nativa do Linear: `Urgent` > `High` > `Medium` (padrão) > `Low`.

Convenção de título: tag em prefixo `[BUG]` `[FIX]` `[MELHORIA]` `[FEATURE]` `[HOTFIX]` `[DECIDIR]`.

### 4. Roadmap = projects (1 project por marco)

A lista de **projects** é o roadmap macro — sem doc-espelho no repo (CLAUDE.md § Linear workspace).

- Criar project **`Marco 1 — <nome do primeiro marco>`** e marcá-lo como o marco ativo
- Descrição do project carrega: objetivo, escopo, definição de pronto, pré-condições
- Marcos seguintes entram conforme o roadmap evolui — não criar todos agora

### 5. Capturar os IDs (preenche os `<PREENCHER>` do CLAUDE.md)

Mais fácil **depois** de configurar o MCP ([SETUP-CLAUDE-CODE.md](SETUP-CLAUDE-CODE.md)) — Claude roda:

- `mcp__linear__list_teams` → pega `id` do team `{{PROJETO}}` e a `key` `{{PREFIXO}}`
- `mcp__linear__list_projects` → pega `id` do project Marco 1
- `mcp__linear__list_users` → pega `id` da conta `<email-dedicado>`

Substituir em `CLAUDE.md` (seção **Linear workspace — referência rápida**):

| Placeholder | Valor |
| ----------- | ----- |
| Team id `<PREENCHER no SETUP-LINEAR>` | id real do team |
| Marco 1 id `<PREENCHER>` | id real do project |
| `<email-dedicado-ao-projeto>` | email real | 
| Usuário id `<PREENCHER>` | id real do usuário |

Antes do MCP, dá pra pegar o team id via API:

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: lin_api_..." -H "Content-Type: application/json" \
  -d '{"query":"{ teams { nodes { id name key } } viewer { id email } }"}' | jq
```

### 6. Personal API key (para o MCP)

- Logado como `<email-dedicado>`: [linear.app/settings/account/security](https://linear.app/settings/account/security) → Personal API keys → **Create** → label `{{PROJETO_SLUG}}-claude-code-local`
- Copiar `lin_api_...` (aparece uma vez). Guardar no gerenciador. Usado no [SETUP-CLAUDE-CODE.md](SETUP-CLAUDE-CODE.md).

### 7. Conectores claude.ai web (desabilitar pra isolamento real)

Se houver um conector `Linear` ativo em [claude.ai → Settings → Conectores], **desconectar** — ele é global (conta claude.ai inteira, todos os projetos) e conflita com o MCP local por-projeto. Confirmar com `claude mcp list` que não aparece `claude.ai Linear`.

---

## 4. Verificação

- [ ] Workspace `{{PROJETO_SLUG}}`, team `{{PROJETO}}` com key `{{PREFIXO}}`
- [ ] Status flow exatamente `Backlog→Todo→In Progress→Done`
- [ ] Labels `Bug/Improvement/Feature/Hotfix/Decision` criadas
- [ ] Project `Marco 1` criado e ativo
- [ ] Personal API key `lin_api_...` guardada
- [ ] `<PREENCHER>` do CLAUDE.md substituídos pelos IDs reais
- [ ] Nenhum conector `claude.ai Linear` global ativo

---

## 5. Troubleshooting

### MCP retorna issues de outro workspace

Conector `claude.ai Linear` global ativo, ou MCP em escopo `user`. Desconectar o conector e garantir MCP em escopo `local` (SETUP-CLAUDE-CODE.md).

### `assignee: "me"` cria issue pra conta errada

`"me"` = conta que autentica o MCP. Sempre usar o email explícito `<email-dedicado>` (CLAUDE.md já avisa disso).

### Claude editou execution-order.md "errado"

Linear é a fonte de verdade. Claude regrava a execution-order a partir do Linear (gatilho 3). Não editar o arquivo à mão — ajustar a issue no Linear.

---

## 6. Histórico

| Data | Responsável | Observações |
| ---- | ----------- | ----------- |
| `<YYYY-MM-DD>` | `<Nome>` | `<o que rolou>` |
