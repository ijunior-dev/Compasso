# Runbooks

Procedimentos operacionais. "O que fazer quando X acontece" / "como configurar Y do zero".

## Bootstrap (do zero — seguir nesta ordem)

| # | Runbook | O que faz |
| - | ------- | --------- |
| 0 | [`00-BOOTSTRAP.md`](00-BOOTSTRAP.md) | Ordem mestra: do nada à esteira rodando |
| 1 | [`SETUP-GITHUB.md`](SETUP-GITHUB.md) | Conta + repo + branches `main`/`dev` + proteção |
| 2 | [`SETUP-SUPABASE.md`](SETUP-SUPABASE.md) | Conta + projeto prod + keys + PAT + CLI |
| 3 | [`SETUP-LINEAR.md`](SETUP-LINEAR.md) | Conta de serviço + workspace + team `{{PREFIXO}}` + status flow |
| 4 | [`SETUP-CLAUDE-CODE.md`](SETUP-CLAUDE-CODE.md) | MCPs Linear/Supabase **isolados por projeto** |
| 5 | [`DEPLOY.md`](DEPLOY.md) | Vercel + migrations Supabase prod |
| 6 | [`SMOKE-TEST.md`](SMOKE-TEST.md) | Validação mínima pós-deploy |

## Quando criar um runbook novo

**Só quando a situação aparecer pela primeira vez.** Runbook criado proativamente vira ficção que envelhece sem validação real.

Crie depois que: (1) executou o procedimento com sucesso, (2) ele pode se repetir, (3) quer economizar tempo na próxima.

Use o template [`docs/templates/runbook.md`](../templates/runbook.md). Nome em MAIÚSCULAS-COM-HÍFEN.

## Provavelmente serão criados

- `RESTORE-BACKUP.md` — restaurar Supabase de backup (quando o 1º backup for testado)
- `RENOVAR-CREDENCIAIS.md` — rotação de keys/tokens (na 1ª rotação)
