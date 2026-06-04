# SETUP-GITHUB — Conta, repo e branches do {{PROJETO}}

| Campo           | Valor          |
| --------------- | -------------- |
| Criado em       | `<YYYY-MM-DD>` |
| Última execução | `—`            |
| Responsável     | `<Nome>`       |

> Do zero: criar conta GitHub (se não tiver), repo, push do scaffold, branches `main`/`dev`, proteção. Etapa 1 do [00-BOOTSTRAP](00-BOOTSTRAP.md).

---

## 1. Quando usar

Início do projeto. Repo ainda não existe no GitHub.

---

## 2. Pré-requisitos

- `git` e `gh` (GitHub CLI) instalados (`gh --version`)
- Email pra conta (use um dedicado ao projeto se quiser separar de pessoal — recomendado, consistente com a conta de serviço do Linear)
- Scaffold já gerado localmente pelo `init.sh` (este repo)

---

## 3. Passos

### 1. Criar conta GitHub (pular se já tem)

1. [github.com/signup](https://github.com/signup) → email, senha, username
2. Confirmar email
3. **Habilitar 2FA** (obrigatório — Settings → Password and authentication → Two-factor): app TOTP (Authy/1Password) ou chave. Guardar recovery codes no gerenciador de senhas.

### 2. Autenticar o `gh` CLI

```bash
gh auth login
# GitHub.com → HTTPS → autenticar via browser → confirmar 2FA
gh auth status   # deve mostrar a conta logada
```

### 3. Inicializar o repo local

A partir da raiz do scaffold já gerado (onde estão `CLAUDE.md`, `docs/`):

```bash
cd <caminho-do-projeto>
git init
git add -A
git commit -m "chore: bootstrap {{PROJETO}} a partir do template de esteira

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### 4. Criar o repo remoto e dar push

```bash
# privado por padrão (recomendado até go-live)
gh repo create {{PROJETO_SLUG}} --private --source=. --remote=origin --push
gh repo view --web   # confere no browser
```

### 5. Criar branch `dev` (onde todo trabalho nasce)

```bash
git checkout -b dev
git push -u origin dev
git checkout main
```

Convenção do projeto: `main` = release/prod, `dev` = integração, `{{PREFIXO}}-X-desc` = trabalho por issue. Ver [CLAUDE.md § Git Flow](../../CLAUDE.md#git-flow).

### 6. Proteger `main`

Branch protection rule em `main` (Settings → Branches → Add rule, ou via API):

```bash
gh api -X PUT repos/:owner/{{PROJETO_SLUG}}/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f "required_pull_request_reviews[required_approving_review_count]=0" \
  -F "enforce_admins=false" \
  -F "required_status_checks=null" \
  -F "restrictions=null"
```

(1 dev: review count 0, só impede push direto acidental e force-push. Subir o rigor quando entrar 2º dev.)

### 7. Husky + gitleaks (pre-commit)

Depois que o app Next.js existir (Etapa 5 do bootstrap):

```bash
<pnpm|npm|bun> add -D husky lint-staged
npx husky init
# pre-commit deve rodar: gitleaks protect --staged + lint-staged
```

Garante que segredo não vaze em commit. Não pular hook com `--no-verify` sem motivo declarado (CLAUDE.md § Regras gerais).

---

## 4. Verificação

- [ ] `gh auth status` logado, 2FA ativo, recovery codes guardados
- [ ] `gh repo view` mostra `{{PROJETO_SLUG}}` (privado)
- [ ] `git branch -r` lista `origin/main` e `origin/dev`
- [ ] Push direto em `main` bloqueado (proteção ativa)
- [ ] (após Etapa 5) commit dispara gitleaks + lint-staged

---

## 5. Troubleshooting

### `gh repo create` falha com "name already exists"

Já existe repo com esse nome na conta. Escolher outro slug ou apagar o antigo (`gh repo delete`).

### `git push` rejeitado em `main`

Proteção funcionando. Trabalhe em branch e abra PR, ou faça merge em `dev` e promova `dev → main` via PR (fluxo padrão — CLAUDE.md).

### Commitou segredo por engano

Não basta `git rm`. Rotacionar a credencial **imediatamente** no provedor, depois reescrever histórico (`git filter-repo`) e force-push. Ver [SECURITY.md](../../SECURITY.md).

---

## 6. Histórico

| Data | Responsável | Observações |
| ---- | ----------- | ----------- |
| `<YYYY-MM-DD>` | `<Nome>` | `<o que rolou>` |
