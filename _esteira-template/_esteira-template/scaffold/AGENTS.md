# AGENTS.md — {{PROJETO}}

Instrucoes para Codex e outros agentes de IA trabalhando neste repositorio.

## Fonte canonica

- Leia primeiro `CLAUDE.md`. Ele continua sendo a fonte operacional completa do projeto e deve ser seguido por Codex tambem.
- Quando `CLAUDE.md` disser "Claude", interprete como "agente" ou "Codex", exceto em comandos especificos da CLI do Claude Code.
- Nao duplique regras longas neste arquivo. Se houver conflito, vence a decisao mais recente em `docs/decisions/DECISOES.md`; depois `CLAUDE.md`; depois este arquivo.
- Configuracao de MCPs (Claude Code e Codex) fica em `docs/runbooks/SETUP-CLAUDE-CODE.md`. MCPs locais do Codex podem ficar em `.codex/config.toml`, mas `.codex/` e ignorado pelo Git e nao deve subir para o GitHub.

## Regras obrigatorias

- Tudo em portugues: codigo, banco, variaveis, nomes de arquivo, comentarios, docs e commits.
- Identificadores sem acento e sem `ç`.
- Banco em `snake_case`; TypeScript em `camelCase`; tipos/classes em `PascalCase`.
- Nunca remover funcionalidade existente sem decisao explicita.
- Nunca pular hooks de Husky com `--no-verify` sem motivo declarado.
- Nunca inventar regra de negocio que nao esteja documentada em `docs/architecture/RULES.md`, `docs/domain-specs/` ou task-spec. Se a secao Dominio do `CLAUDE.md` ainda estiver vazia, pausar.
- Nunca editar migration ja aplicada; criar nova migration em `supabase/migrations/`.
- MCP Supabase e prod (ambiente unico no inicio). Uso diario deve ser leitura, escopo `local` (nunca `user`/global) — ver `docs/runbooks/SETUP-CLAUDE-CODE.md`.

## Disclosure progressiva

Nao leia toda a documentacao de uma vez. Siga a ordem de `CLAUDE.md`:

1. `CLAUDE.md`
2. Task-spec de `docs/tasks/task-specs/{{PREFIXO}}-X-*.md`, se estiver implementando issue
3. `docs/architecture/RULES.md`, se tocar em regra de negocio
4. `docs/architecture/CODEBASE.md`, se precisar mapa de arquivos
5. `docs/architecture/DADOS.md` e `docs/decisions/`, se tocar em banco
6. `docs/domain-specs/<entidade>.md` ou `docs/feature-specs/<tela>.md`, conforme a issue ou regra pedir

## Esteira Linear / Repo

Ao receber `puxe proxima`, `puxe próxima` ou `puxe {{PREFIXO}}-X`, siga o fluxo de 12 passos em `CLAUDE.md`:

- executar autonomamente os passos 1-11;
- pausar apenas nos Gates A-E;
- nunca executar o passo 12 sem comando explicito do dev (`terminei a {{PREFIXO}}-X` ou `pode commitar`);
- usar email explicito da conta de servico do Linear em vez de `assignee: "me"`;
- manter uma issue por branch, no formato `{{PREFIXO}}-X-descricao-curta`;
- registrar test cases em `docs/tests/test-case-registry.md`;
- arquivar task-spec concluida em `docs/tasks/task-specs/archive/`.

## Comandos comuns

Rodar da raiz do repositorio:

```bash
<pnpm|npm|bun> lint
<pnpm|npm|bun> typecheck
<pnpm|npm|bun> build
<pnpm|npm|bun> dev
```

Use `rg`/`rg --files` para buscar. Antes de editar, leia o contexto real do arquivo; specs orientam a intencao, codigo mostra o estado atual.
