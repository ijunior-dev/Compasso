# Arquitetura

Meta-specs que cobrem decisões estruturais cruzando domínio, banco e código. Documentos aqui explicam _como_ o sistema é construído (e _por quê_), não _o que_ ele faz (isso fica em `feature-specs/`) nem quais entidades existem (isso fica em `domain-specs/`).

## Arquivos

- [`RULES.md`](RULES.md) — regras de negócio e fluxos críticos (domain core estável)
- [`CODEBASE.md`](CODEBASE.md) — estrutura de pastas, responsabilidades, scripts, convenções, anti-padrões
- [`DADOS.md`](DADOS.md) — schema, RLS, convenções de nomenclatura, classificação de dados
- [`UI-UX.md`](UI-UX.md) — guideline visual

## Como adicionar um doc novo aqui

1. Há necessidade concreta de registrar uma decisão/padrão arquitetural?
2. O conteúdo cruza camadas (domínio + banco + código / infra + produto)?
3. Não cabe em `decisions/DECISOES.md` (denso demais, > ~30 linhas) nem em `domain-specs/` (não é entidade)?

Se sim pros três, é aqui. Senão, é `decisions/`, `domain-specs/` ou `runbooks/`.

Não criar placeholders vazios — cada arquivo nasce quando há conteúdo real a registrar.
