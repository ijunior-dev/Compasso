# DECISOES.md — Registro cronológico de decisões — {{PROJETO}}

> Histórico **cronológico** de decisões arquiteturais: o porquê, alternativas consideradas, trade-offs. Mais recente no topo. Decisão densa (> ~30 linhas, análise longa de alternativas) vira ADR formal em `ADR-NNN-*.md` e aqui fica só o link curto.
>
> **Decisões mais recentes vencem.** RULES.md carrega o veredito atual + link pra cá; nunca decisão obsoleta visível.

---

## `<YYYY-MM-DD>` — Bootstrap do projeto a partir do template de esteira

**Decisão:** {{PROJETO}} adota a esteira de desenvolvimento padrão (fluxo Linear ↔ repo de 12 passos, 5 gates, ambiente único prod sem staging, MCP isolado por projeto), instanciada do template `_esteira-template`.

**Contexto:** projeto novo, do zero — contas GitHub/Supabase/Linear próprias. Reuso da metodologia validada em projetos anteriores, sem carregar conteúdo de domínio de outros produtos.

**Consequências:** processo herdado e estável; domínio, stack-extra e roadmap definidos neste projeto. Setup seguido por `docs/runbooks/00-BOOTSTRAP.md`.

---

<!-- Novas decisões entram acima desta linha, mais recente no topo. Formato:

## YYYY-MM-DD — Título curto da decisão

**Decisão:** ...
**Contexto:** ...
**Alternativas:** A (descartada porque...), B (escolhida porque...)
**Consequências:** positivas / negativas / neutras
-->
