# Política de Segurança — {{PROJETO}}

## Princípios

- **Segredos nunca no repo.** `.env*` no `.gitignore`. Husky roda `gitleaks` no pre-commit.
- **MCP isolado por projeto.** Credenciais de Supabase/Linear em escopo `local` (vinculado ao diretório), nunca `user`/global. Ver [docs/runbooks/SETUP-CLAUDE-CODE.md](docs/runbooks/SETUP-CLAUDE-CODE.md) e auditar isolamento periodicamente.
- **2FA obrigatório** em todas as contas com acesso a produção (GitHub, Supabase, Vercel, Linear).
- **Service/secret keys** (Supabase secret key) só server-side, nunca em código client. A barreira é o 2FA do painel onde a env var é cadastrada.
- **RLS é a fronteira de dados.** Nenhuma query confia em filtro de aplicação para isolamento — confia em RLS no Postgres. Toda tabela com dado de tenant/usuário tem policy.
- **Migration arriscada** (drop/rename/change type/backfill grande) valida em **Supabase Branch efêmera** antes de prod.

## Reportar vulnerabilidade

`<canal de contato — preencher>`. Não abrir issue pública para falha de segurança.

## Checklist antes de expor publicamente

- [ ] `.env*` fora do git, `gitleaks` passando
- [ ] RLS habilitada em todas as tabelas com dado sensível
- [ ] Secret keys só em env server-side
- [ ] Auditoria de isolamento de MCP limpa (`GLOBAL` vazio)
- [ ] 2FA em GitHub, Supabase, Vercel, Linear
