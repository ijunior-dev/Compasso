# Domain Specs — entidades do {{PROJETO}}

> Atualizado: `<YYYY-MM-DD>`

Specs de domínio (entidades, agregados, regras de negócio detalhadas) das tabelas centrais do produto. 1 arquivo por entidade. Nascem quando a entidade entra em código (via issue {{PREFIXO}}-X), não antes.

## Convenção de arquivo

- 1 arquivo `.md` por entidade, kebab-case lowercase
- Cabeçalho `Atualizado: YYYY-MM-DD`
- Estrutura padrão (ver [template](../templates/domain-spec.md)): Visão geral · Campos · Relações · Estados · Regras de negócio · Termos relacionados
- PT-BR; identificadores sem acento e sem ç; termos do domínio preservados
- Links internos relativos (não URLs absolutas do GitHub)

## Convenções herdadas por TODAS as entidades

Para evitar repetição, valem globalmente. **Cada spec só destaca exceção.**

- **Isolamento:** modelo de RLS definido em [DADOS.md](../architecture/DADOS.md). Toda tabela protegida tem policy; queries confiam em RLS.
- **Auditoria:** `created_at`, `created_by`, `updated_at`, `updated_by` em toda entidade de negócio; trigger `set_updated_at`.
- **Privacidade:** se houver dado pessoal, definir política de retenção/anonimização em ADR + refletir aqui.

## Mapa

| Entidade | Arquivo | Observações |
| -------- | ------- | ----------- |
| Glossário do produto | [glossario.md](glossario.md) | termos que não se traduzem |
| _(entidades entram aqui conforme {{PREFIXO}}-X as implementa)_ | | |

## Relação com outros docs

- **`architecture/RULES.md`** — domain core (regras numeradas, máquinas de estado). Pointer pra cá quando o detalhe pesa.
- **`architecture/DADOS.md`** — schema concreto. Campos aqui devem casar com a tabela.
- **`feature-specs/`** — telas que consomem cada entidade.
- **`decisions/`** — o porquê. Specs aqui descrevem o estado atual.
