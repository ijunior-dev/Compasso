#!/usr/bin/env bash
#
# init.sh — instancia a esteira num projeto novo.
#
# Uso:
#   ./init.sh "<Nome do Projeto>" <caminho-destino> [PREFIXO]
#
# Exemplos:
#   ./init.sh "Acme" /Users/me/Projetos/Acme/dev/acme
#   ./init.sh "Acme Saude" ../acme-saude ACMS
#
# O único valor obrigatório a decidir é o NOME do projeto.
#   - {{PROJETO_SLUG}}  é derivado: minúsculo, sem acento, espaços -> "-"
#   - {{PREFIXO}}       é derivado: letras maiúsculas do nome, 1ª palavra,
#                        máx 4 chars (pode sobrescrever passando o 3º arg)
#
# Não toca em git nem em contas. Depois de rodar, siga
# docs/runbooks/00-BOOTSTRAP.md no projeto gerado.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$SCRIPT_DIR/scaffold"

NAME="${1:-}"
DEST="${2:-}"
PREFIXO_OVERRIDE="${3:-}"

if [[ -z "$NAME" || -z "$DEST" ]]; then
  echo "uso: ./init.sh \"<Nome do Projeto>\" <caminho-destino> [PREFIXO]" >&2
  exit 1
fi

if [[ ! -d "$SRC" ]]; then
  echo "erro: scaffold/ não encontrado em $SCRIPT_DIR" >&2
  exit 1
fi

# --- derivar slug e prefixo a partir do nome -------------------------------
ascii() { printf '%s' "$1" | iconv -t ASCII//TRANSLIT 2>/dev/null || printf '%s' "$1"; }

SLUG="$(ascii "$NAME" \
  | tr '[:upper:]' '[:lower:]' \
  | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"

if [[ -n "$PREFIXO_OVERRIDE" ]]; then
  PREFIXO="$(printf '%s' "$PREFIXO_OVERRIDE" | tr '[:lower:]' '[:upper:]')"
else
  FIRST_WORD="$(ascii "$NAME" | awk '{print $1}')"
  PREFIXO="$(printf '%s' "$FIRST_WORD" \
    | tr -cd '[:alpha:]' | tr '[:lower:]' '[:upper:]' | cut -c1-4)"
fi

if [[ -z "$SLUG" || -z "$PREFIXO" ]]; then
  echo "erro: não consegui derivar slug/prefixo de \"$NAME\". Passe um PREFIXO explícito." >&2
  exit 1
fi

# --- destino seguro --------------------------------------------------------
if [[ -e "$DEST" ]]; then
  if [[ -n "$(ls -A "$DEST" 2>/dev/null || true)" ]]; then
    echo "erro: destino \"$DEST\" já existe e não está vazio. Abortando (não sobrescreve)." >&2
    exit 1
  fi
else
  mkdir -p "$DEST"
fi
DEST="$(cd "$DEST" && pwd)"

echo "Projeto : $NAME"
echo "Slug    : $SLUG"
echo "Prefixo : $PREFIXO   (issues $PREFIXO-1, $PREFIXO-2, ...)"
echo "Destino : $DEST"
echo

# --- copiar scaffold (inclui dotfiles: .gitignore, .claude/) ---------------
cp -R "$SRC"/. "$DEST"/

# --- substituir tokens em todos os arquivos --------------------------------
export _PROJETO="$NAME" _SLUG="$SLUG" _PREFIXO="$PREFIXO"
find "$DEST" -type f -print0 | while IFS= read -r -d '' f; do
  perl -pi -e '
    s/\{\{PROJETO_SLUG\}\}/$ENV{_SLUG}/g;
    s/\{\{PREFIXO\}\}/$ENV{_PREFIXO}/g;
    s/\{\{PROJETO\}\}/$ENV{_PROJETO}/g;
  ' "$f"
done

echo "✓ Esteira instanciada."
echo
echo "Próximos passos:"
echo "  cd \"$DEST\""
echo "  abrir docs/runbooks/00-BOOTSTRAP.md  (setup do zero: GitHub, Supabase, Linear, MCP)"
echo "  preencher as seções Projeto / Domínio / Stack do CLAUDE.md"
