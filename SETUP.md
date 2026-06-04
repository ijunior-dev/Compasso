# Compasso — Guia de Configuração

## Visão geral

```
Comprador paga no Hotmart
       ↓
Hotmart dispara webhook → /api/hotmart-webhook
       ↓
Função gera chave (CMPS-XXXX-XXXX-XXXX) e salva no Supabase
       ↓
Hotmart envia email ao comprador com a chave
       ↓
Comprador abre o app → digita a chave → /api/validate-license
       ↓
App liberado (chave salva no localStorage)
```

---

## 1. Supabase

1. Acesse https://supabase.com e crie um projeto gratuito
2. Vá em **SQL Editor** e execute o arquivo `supabase/schema.sql`
3. Em **Project Settings → API**, copie:
   - `Project URL` → será `SUPABASE_URL`
   - `service_role` secret key → será `SUPABASE_SERVICE_KEY`

---

## 2. Vercel

1. Instale a CLI: `npm i -g vercel`
2. Na raiz do projeto: `npm install`
3. Faça login: `vercel login`
4. Configure os secrets:
   ```
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_SERVICE_KEY
   vercel env add HOTMART_WEBHOOK_SECRET
   ```
5. Deploy: `vercel --prod`
6. Anote a URL gerada (ex: `https://compasso.vercel.app`)

---

## 3. Hotmart

1. Acesse o painel Hotmart e crie o produto
2. Em **Ferramentas → Webhooks**, adicione:
   - URL: `https://SEU-DOMINIO.vercel.app/api/hotmart-webhook`
   - Evento: `PURCHASE_APPROVED`
   - Copie o `hottok` gerado → use como `HOTMART_WEBHOOK_SECRET`
3. Em **Conteúdo → E-mail pós-compra**, configure o email ao comprador incluindo a chave de licença

> **Nota:** A chave é gerada e salva no Supabase pelo webhook. Para incluí-la no email automático do Hotmart, configure a integração via Zapier ou n8n (webhook → email com a chave retornada).

---

## 4. Domínio (opcional)

Se registrou `compassoapp.com.br` ou similar:
1. No painel Vercel → **Domains** → adicione o domínio
2. Aponte o DNS conforme instruído pela Vercel
3. Atualize a linha `const API_URL` no `index.html`:
   ```js
   const API_URL = 'https://compassoapp.com.br/api/validate-license';
   ```

---

## 5. Teste local

```bash
npm install
vercel dev
```

Para inserir uma chave de teste diretamente no Supabase:
```sql
insert into licenses (key, status, email)
values ('CMPS-TEST-1234-ABCD', 'pending', 'teste@email.com');
```

Abra `http://localhost:3000` e ative com `CMPS-TEST-1234-ABCD`.
