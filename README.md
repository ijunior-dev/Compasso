# Compasso — Repertório de Palco

App web de repertório musical para uso ao vivo: cifras com acordes alinhados, transposição de tom, modo Palco em tela cheia e ajuste automático do tamanho da cifra à tela. Funciona no celular, tablet e desktop, instalável como app (PWA).

HTML, CSS e JavaScript puros (módulos ES nativos, sem framework nem build), funções serverless na Vercel e Supabase para licenças.

## Estrutura

```
index.html          estrutura da página
css/styles.css      estilos (temas claro/escuro, responsivo, Palco, impressão)
js/
  app.js            ponto de entrada: inicializa e expõe ao HTML as funções dos botões
  songs.js          repertório — só dados (cifras e lista de músicas)
  chords.js         detecção de acordes, transposição, formatação da cifra
  state.js          estado, salvar/carregar no navegador, migração de músicas novas
  fit.js            ajuste do tamanho da cifra à largura da tela
  render.js         barra lateral, palco e formulário de edição
  actions.js        ações do usuário, modais e atalhos de teclado
  pages.js          páginas Início e Mais (gêneros, tema, fonte)
  export.js         exportação TXT e PDF
  license.js        tela de ativação de licença
  pwa.js            ícone e manifest do app instalável
api/
  validate-license.js   valida a chave de licença
  hotmart-webhook.js    gera licença a cada compra aprovada
  keepalive.js          consulta diária para o Supabase não pausar
supabase/schema.sql     tabela de licenças
```

## Rodar localmente

Módulos ES não carregam abrindo o `index.html` direto no navegador (`file://`) — precisa de servidor:

```powershell
vercel.cmd dev
```

e abra `http://localhost:3000`. Configuração de Supabase, Vercel e Hotmart em [SETUP.md](SETUP.md).

## Adicionar músicas

Edite só `js/songs.js`: crie a constante com a cifra, registre em `SPECIFIC` e acrescente a linha em `RAW_SONGS`. Aparelhos que já usam o app recebem as músicas novas automaticamente ao abrir.
