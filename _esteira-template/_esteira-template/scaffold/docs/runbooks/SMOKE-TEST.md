# SMOKE-TEST — {{PROJETO}}

| Campo           | Valor          |
| --------------- | -------------- |
| Criado em       | `<YYYY-MM-DD>` |
| Última execução | `—`            |
| Responsável     | `<Nome>`       |

> Validação mínima end-to-end em produção após deploy. Não é teste de feature (cada feature tem TC-XXX próprio) nem regressão completa.

---

## 1. Quando usar

- Primeira subida de um ambiente
- Re-smoke após mudança grande de infra (upgrade Next, troca de pooler Supabase, rotação de keys)
- Pós-incidente, pra validar retorno ao estado saudável

---

## 2. Pré-requisitos

- Deploy verde ([DEPLOY.md](DEPLOY.md))
- `curl` no terminal; browser anônimo (sessão limpa)
- Credenciais de um usuário de teste (se já houver auth)

```
APP=<url-vercel-prod>
```

---

## 3. Passos

### Etapa 1 — Health sem autenticação

```bash
curl -sS -o /dev/null -w "HTTP %{http_code} | %{time_total}s\n" "$APP/"
# esperado: 200 (ou 307/redirect p/ /login se app exige auth — passar -L)
```

### Etapa 2 — Rota protegida sem sessão

Browser anônimo → abrir uma rota autenticada (ex: `$APP/admin`) → deve redirecionar pra `/login`.

### Etapa 3 — Login (quando houver auth)

Login com usuário de teste → cai na home autenticada. Conferir que sessão persiste em reload.

### Etapa 4 — Caminho crítico do produto

`<1-2 passos do fluxo mais central do {{PROJETO}} — preencher quando o produto tiver um. Ex: criar registro X e vê-lo na listagem.>`

### Etapa 5 — Signout

Sair → volta pra `/login` → tentar rota protegida → redireciona (sessão limpa).

---

## 4. Verificação

- [ ] `GET $APP/` → 200
- [ ] Rota protegida sem sessão → redireciona
- [ ] Login funciona e persiste
- [ ] Caminho crítico do produto ok
- [ ] Signout limpa sessão

---

## 5. Troubleshooting

### Login bem-sucedido mas volta pra /login

Cookies bloqueados (browser restrito) ou `NEXT_PUBLIC_SUPABASE_URL` ≠ URL real do projeto prod. Testar em Chrome/Firefox anônimo; conferir env var + Supabase Auth Site URL.

### 200 mas página em branco / erro de dados

Migrations não aplicadas em prod ou RLS bloqueando. Conferir `supabase migration list --project-ref <PROJECT_REF>` e advisors.

---

## 6. Histórico

| Data | Responsável | Observações |
| ---- | ----------- | ----------- |
| `<YYYY-MM-DD>` | `<Nome>` | `<o que rolou>` |
