# DEPLOY — {{PROJETO}} (Vercel + Supabase)

| Campo           | Valor          |
| --------------- | -------------- |
| Criado em       | `<YYYY-MM-DD>` |
| Última execução | `—`            |
| Responsável     | `<Nome>`       |

> Primeira subida do app Next.js na Vercel + migrations no Supabase prod, com auto-deploy via GitHub. Etapa 6 do [00-BOOTSTRAP](00-BOOTSTRAP.md). Ambiente único (prod) — sem staging.

---

## 1. Quando usar

- Primeira subida do app
- Re-cadastro completo de env vars
- Re-deploy de rotina **não** exige este runbook — `git push origin main` dispara auto-deploy

---

## 2. Pré-requisitos

- Repo no GitHub com `main` e `dev` ([SETUP-GITHUB](SETUP-GITHUB.md))
- Supabase prod ACTIVE + keys ([SETUP-SUPABASE](SETUP-SUPABASE.md))
- Conta Vercel com **2FA habilitado**
- `vercel` CLI (`vercel --version`) e `supabase` CLI autenticadas
- Repo local limpo (`git status` clean)

---

## 3. Passos

### Ordem crítica

1. Env vars na Vercel **antes** do primeiro push
2. Migrations no Supabase prod **antes** do primeiro deploy (senão telas que leem o banco quebram)
3. Push em `main` só depois dos dois anteriores

### Etapa 1 — Importar projeto na Vercel

- [vercel.com/new](https://vercel.com/new) → conta com 2FA → selecionar repo `{{PROJETO_SLUG}}`
- **Framework Preset:** Next.js (auto)
- **Root Directory:** raiz (ou `apps/web` se monorepo — conforme decidido no bootstrap)
- **Production Branch:** `main`
- Preview Branches: "All branches" (Vercel cria preview por branch — útil pra revisar `dev`/`{{PREFIXO}}-X`)

### Etapa 2 — Env vars (Production scope = `main`)

| Nome | Valor |
| ---- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase prod |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key |
| `SUPABASE_SECRET_KEY` | Secret key — **server-side only** (2FA do painel Vercel é a barreira) |
| `NEXT_PUBLIC_APP_URL` | URL Vercel (ajustar se domínio custom) |
| `NODE_ENV` | `production` |

> Preview branches (`dev`, `{{PREFIXO}}-X`): por padrão herdam as mesmas vars (ambiente único = mesmo Supabase prod). Se um dia houver staging, separar aqui.

### Etapa 3 — Migrations no Supabase prod

```bash
ls supabase/migrations/
supabase db push --project-ref <PROJECT_REF>   # ref EXPLÍCITO, nunca --linked
supabase migration list --project-ref <PROJECT_REF>   # confirmar aplicadas
```

Seed de dev (se houver) fica em `supabase/seeds/` e **nunca** é aplicado em prod.

### Etapa 4 — Primeiro push dispara o deploy

```bash
git status                            # clean
git log origin/main..main --oneline   # o que vai subir
git push origin main
```

Vercel builda automático. Acompanhar: `vercel inspect --logs <deployment-url>` ou o dashboard.

### Etapa 5 — Auth URLs no Supabase

Supabase → Authentication → URL Configuration → **Site URL** = URL Vercel de prod (e redirect URLs). Sem isso, login/callback quebra.

### Etapa 6 — Ajustes finos

- Domínio custom na Vercel (se houver) → atualizar `NEXT_PUBLIC_APP_URL` + Site URL do Supabase
- Cada update de env var redeploya automaticamente

---

## 4. Verificação

- [ ] Vercel linkado, Production Branch = `main`
- [ ] Env vars Production cadastradas
- [ ] `supabase migration list --project-ref <PROJECT_REF>` mostra as migrations aplicadas
- [ ] Seed de dev NÃO aplicado em prod
- [ ] `GET <vercel-url>/` → 200
- [ ] Supabase Auth Site URL = URL prod
- [ ] Smoke test ([SMOKE-TEST.md](SMOKE-TEST.md)) verde

---

## 5. Troubleshooting

### Build falha "command not found" (pnpm/bun)

Vercel → Settings → General → Node ≥ 20; confirmar Framework Preset = Next.js; se persistir, setar Install Command manual (`corepack enable && pnpm i --frozen-lockfile`).

### Login redireciona em loop

Supabase Auth Site URL ≠ URL Vercel real, ou `NEXT_PUBLIC_SUPABASE_URL` errado. Conferir Etapa 5 + env vars.

### Migration falha pedindo senha

Senha do DB trocada. Supabase → Settings → Database → Reset password, guardar a nova.

---

## 6. Histórico

| Data | Responsável | Observações |
| ---- | ----------- | ----------- |
| `<YYYY-MM-DD>` | `<Nome>` | `<o que rolou>` |
