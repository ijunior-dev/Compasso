# SETUP-SUPABASE — Conta, projeto e keys do {{PROJETO}}

| Campo           | Valor          |
| --------------- | -------------- |
| Criado em       | `<YYYY-MM-DD>` |
| Última execução | `—`            |
| Responsável     | `<Nome>`       |

> Do zero: criar conta Supabase, organização, projeto (prod — ambiente único), pegar URL/keys/PAT, `.env.local`, CLI. Etapa 2 do [00-BOOTSTRAP](00-BOOTSTRAP.md).

---

## 1. Quando usar

Início do projeto. Banco ainda não existe.

---

## 2. Pré-requisitos

- Conta GitHub já criada (login no Supabase via GitHub é o mais simples)
- `supabase` CLI instalada (`supabase --version`, ≥ 2.x) — `brew install supabase/tap/supabase` ou via npm

---

## 3. Passos

### 1. Criar conta + 2FA

1. [supabase.com/dashboard](https://supabase.com/dashboard) → Sign in with GitHub (ou email)
2. Settings → Account → **habilitar 2FA**. Guardar recovery codes.

### 2. Criar organização

- Nova org `{{PROJETO}}` (ou reusar a pessoal). Plano Free serve pro início.
- 1 org por produto evita confundir billing/projetos entre produtos diferentes.

### 3. Criar o projeto (prod — ambiente único)

- **New project** dentro da org
- **Name:** `{{PROJETO_SLUG}}-prod`
- **Database password:** gerar forte, **salvar no gerenciador de senhas imediatamente** (some da tela)
- **Region:** mais perto dos usuários (ex: `sa-east-1` São Paulo)
- Aguardar provisionar (~2 min) até `ACTIVE_HEALTHY`

> Ambiente único (prod) sem staging enquanto for 1 dev / pré-primeiro-cliente — ver [CLAUDE.md § Stack](../../CLAUDE.md#stack). Migration arriscada valida em **Supabase Branch efêmera** (botão Branches no dashboard), não em projeto staging separado.

### 4. Anotar o project-ref

- Settings → General → **Reference ID** (ex: `abcdwxyzabcdwxyzabcd`) → este é o `project-ref`
- Substituir nos `<PREENCHER ... project-ref>` de `docs/runbooks/SETUP-CLAUDE-CODE.md` e `CLAUDE.md`

### 5. Pegar URL e keys da aplicação

Settings → API:

| O que | Onde usar |
| ----- | --------- |
| **Project URL** (`https://<ref>.supabase.co`) | `NEXT_PUBLIC_SUPABASE_URL` |
| **Publishable key** (antiga "anon") | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — client, OK expor |
| **Secret key** (antiga "service_role") | `SUPABASE_SECRET_KEY` — **server-side only, nunca em client** |

Settings → Database → Connect → **Session pooler** (porta 5432): connection string com a senha do passo 3 → `DATABASE_URL` (se precisar de acesso direto a Postgres).

### 6. Personal Access Token (para o MCP — NÃO é project key)

- [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) → **Generate new token** → label `{{PROJETO_SLUG}}-mcp`
- Copiar `sbp_...` (aparece uma vez). **Guardar no gerenciador.** Usado no [SETUP-CLAUDE-CODE.md](SETUP-CLAUDE-CODE.md).
- ⚠️ Project keys (publishable/secret) **não** servem pro MCP — só o PAT da conta.

### 7. `.env.local` (NÃO commitar — está no `.gitignore`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable>
SUPABASE_SECRET_KEY=<secret>
# DATABASE_URL=postgresql://...:5432/postgres   # se precisar
```

Criar também `.env.example` (sem valores) e commitar esse.

### 8. Linkar a CLI ao projeto (para migrations versionadas)

```bash
cd <caminho-do-projeto>
supabase login                       # abre browser
supabase init                        # cria supabase/ se ainda não existe
supabase link --project-ref <ref>    # vincula este repo ao projeto prod
```

Migrations vivem em `supabase/migrations/*.sql`, aplicadas com `supabase db push --project-ref <ref>` em commit deliberado (nunca via MCP — ver política em SETUP-CLAUDE-CODE.md).

---

## 4. Verificação

- [ ] Projeto `ACTIVE_HEALTHY`, senha do DB no gerenciador
- [ ] `project-ref` anotado e substituído nos `<PREENCHER>`
- [ ] `.env.local` com URL + 2 keys; `.env.example` commitado sem valores
- [ ] PAT `sbp_...` gerado e guardado (separado das project keys)
- [ ] `supabase link` ok (`supabase projects list` mostra o projeto linkado)

Smoke (valida PAT):

```bash
curl -s "https://api.supabase.com/v1/projects/<ref>" \
  -H "Authorization: Bearer sbp_..." | jq '{name,region,status}'
# esperado: status=ACTIVE_HEALTHY
```

---

## 5. Troubleshooting

### MCP/CLI "Unauthorized"

Usou project key onde precisa do PAT da conta (`sbp_...`). Regerar e usar o PAT.

### `supabase db push` pede senha e rejeita

Senha do passo 3 errada/trocada. Settings → Database → Reset password, guardar a nova.

### Esqueci a senha do banco

Reset no painel (acima). Atualizar `DATABASE_URL` onde estiver.

---

## 6. Histórico

| Data | Responsável | Observações |
| ---- | ----------- | ----------- |
| `<YYYY-MM-DD>` | `<Nome>` | `<o que rolou>` |
