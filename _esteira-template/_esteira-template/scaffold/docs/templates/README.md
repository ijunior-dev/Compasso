# Templates

Esqueletos reutilizáveis para os documentos recorrentes do projeto. Copie o template, renomeie para o local correto, substitua placeholders, **preencha**.

## Templates disponíveis

| Template                             | Usar em                                          |
| ------------------------------------ | ------------------------------------------------ |
| [`task-spec.md`](task-spec.md)       | `docs/tasks/task-specs/{{PREFIXO}}-X-*.md`       |
| [`adr.md`](adr.md)                   | `docs/decisions/ADR-NNN-*.md`                    |
| [`domain-spec.md`](domain-spec.md)   | `docs/domain-specs/<entidade>.md`                |
| [`feature-spec.md`](feature-spec.md) | `docs/feature-specs/<tela>.md`                   |
| [`runbook.md`](runbook.md)           | `docs/runbooks/<NOME-DO-PROCEDIMENTO>.md`        |

## Convenção de placeholders

- `` `<VALOR>` `` → valor a substituir (visível no render porque está em backticks)
- `<!-- instrução -->` → orientação de preenchimento que some no render do GitHub mas aparece no editor
- `{{PROJETO}}` / `{{PROJETO_SLUG}}` / `{{PREFIXO}}` → tokens do projeto, já resolvidos pelo `init.sh` no bootstrap

## Como usar

1. Copie o template para o local correto (ver tabela)
2. Renomeie seguindo a convenção da pasta destino
3. Substitua os `` `<VALOR>` `` por valores reais
4. Leia os `<!-- comentários -->` — remova quando não forem mais úteis
5. Apague seções vazias que não se aplicam (documento pequeno é melhor que documento com espaços em branco)

## Regra de manutenção

Se os documentos reais divergirem do template (uma seção nova que faz sentido), **atualize o template antes de copiar de novo**. Template desatualizado vira ficção.
