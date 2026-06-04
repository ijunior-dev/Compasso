# `<NOME-DO-PROCEDIMENTO>`

<!-- Nome do arquivo: MAIUSCULAS-COM-HIFEN.md (ex: SMOKE-TEST.md, RESTORE-BACKUP.md). Verbo ou ação clara. -->

| Campo           | Valor               |
| --------------- | ------------------- |
| Criado em       | `<YYYY-MM-DD>`      |
| Última execução | `<YYYY-MM-DD \| —>` |
| Responsável     | `<Nome>`            |

---

## 1. Quando usar

<!-- Situação específica em que este runbook se aplica. Não é "quando quiser" — é um gatilho concreto. -->

`<gatilho/situação>`

---

## 2. Pré-requisitos

<!-- Acessos, credenciais, ferramentas, variáveis de ambiente necessárias antes de começar. -->

- `<acesso>` (ex: login no painel X)
- `<ferramenta>` (ex: `supabase` CLI autenticada)
- `<variável>` (ex: `SUPABASE_SECRET_KEY` em `.env`)

---

## 3. Passos

<!-- Numerados, executáveis, sem ambiguidade. Inclua comandos literais quando aplicável. -->

### 1. `<ação>`

```bash
<comando, se houver>
```

`<descrição do que o comando faz ou o que esperar>`

### 2. `<ação>`

`<instrução>`

---

## 4. Verificação

<!-- Como confirmar que o procedimento deu certo. Observável. -->

- `<o que observar>` (ex: "output mostra `success`")
- `<o que NÃO deve aparecer>`

---

## 5. Troubleshooting

<!-- Problemas comuns e soluções. Atualizar sempre que um erro novo aparecer na execução. -->

### Erro: `<mensagem ou sintoma>`

**Causa provável:** `<explicação>`

**Solução:** `<passos>`

---

## 6. Histórico

<!-- Adicionar linha a cada execução. Ajuda a detectar degradação. -->

| Data           | Responsável | Observações                                     |
| -------------- | ----------- | ----------------------------------------------- |
| `<YYYY-MM-DD>` | `<Nome>`    | `<o que aconteceu, ajustes necessários, tempo>` |
