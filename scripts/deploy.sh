#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -f .env.deploy ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.deploy
  set +a
fi

SSH_USER="${DEPLOY_SSH_USER:-root}"
SSH_HOST="${DEPLOY_SSH_HOST:-68.183.161.41}"
REMOTE_PATH="${DEPLOY_REMOTE_PATH:-/usr/share/nginx/html/admin}"
DEPLOY_URL="${DEPLOY_URL:-https://admin.anandvrindavan.com/}"

SSH_OPTS=(-o StrictHostKeyChecking=accept-new)

# Password auth needs a TTY (or DEPLOY_SSH_INTERACTIVE=1). Keys use BatchMode for CI/Cursor.
USE_INTERACTIVE=false
if [[ "${DEPLOY_SSH_INTERACTIVE:-}" == "1" ]]; then
  USE_INTERACTIVE=true
elif [[ -z "${DEPLOY_SSH_KEY:-}" ]] && [[ -t 0 ]]; then
  USE_INTERACTIVE=true
fi

if [[ "$USE_INTERACTIVE" == true ]]; then
  echo "→ Interactive SSH (you may be prompted for your server password once)."
else
  SSH_OPTS=(-o BatchMode=yes "${SSH_OPTS[@]}")
fi

if [[ -n "${DEPLOY_SSH_KEY:-}" ]]; then
  SSH_KEY="${DEPLOY_SSH_KEY/#\~/$HOME}"
  if [[ ! -f "$SSH_KEY" ]]; then
    echo "error: SSH key not found at $SSH_KEY" >&2
    exit 1
  fi
  SSH_OPTS=(-i "$SSH_KEY" "${SSH_OPTS[@]}")
  if [[ "$USE_INTERACTIVE" != true ]] && ! ssh-keygen -y -f "$SSH_KEY" >/dev/null 2>&1; then
    if ! ssh-add -l >/dev/null 2>&1; then
      echo "error: SSH key at $SSH_KEY requires a passphrase. Load it first:" >&2
      echo "  ssh-add $SSH_KEY" >&2
      exit 1
    fi
  fi
fi

echo "→ Building avd-admin-vue..."
if command -v bun >/dev/null 2>&1; then
  bun run build
else
  npm run build
fi

if [[ ! -d dist ]] || [[ ! -f dist/index.html ]]; then
  echo "error: build did not produce dist/index.html" >&2
  exit 1
fi

MAIN_JS="$(grep -Eo 'src="/admin/assets/[^"]+\.js"' dist/index.html | head -1 | sed 's/src="//;s/"//')"
if [[ -z "$MAIN_JS" ]]; then
  echo "error: dist/index.html has no /admin/assets/*.js entry (check vite base)" >&2
  exit 1
fi

if [[ "$USE_INTERACTIVE" != true ]]; then
  if ! ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SSH_HOST}" "echo ok" >/dev/null 2>&1; then
    echo "error: SSH to ${SSH_USER}@${SSH_HOST} failed." >&2
    echo "" >&2
    echo "If you use ssh-copy-id but deploy fails only in Cursor:" >&2
    echo "  Cursor's sandbox cannot read ~/.ssh/id_rsa or use your ssh-agent." >&2
    echo "  Run deploy in Terminal.app instead:  bun run deploy" >&2
    echo "" >&2
    echo "Verify key login in Terminal:  ssh -o BatchMode=yes ${SSH_USER}@${SSH_HOST} echo ok" >&2
    exit 1
  fi
fi

# Remote script runs via bash -c; stdin must be only the gzip tar stream (no heredoc on ssh).
REMOTE_CMD='set -euo pipefail
mkdir -p "$REMOTE_PATH"
find "$REMOTE_PATH" -mindepth 1 -delete
tar -C "$REMOTE_PATH" -xzf -
remote=$(grep -Eo '"'"'src="/admin/assets/[^"]+\.js"'"'"' "$REMOTE_PATH/index.html" | head -1 | sed '"'"'s/src="//;s/"//'"'"')
if [[ "$remote" != "$MAIN_JS" ]]; then
  echo "error: remote index.html asset mismatch ($remote vs $MAIN_JS)" >&2
  exit 1
fi
echo "remote ok: $remote"'

echo "→ Uploading to ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/ ..."
tar -C dist -czf - . | ssh "${SSH_OPTS[@]}" "${SSH_USER}@${SSH_HOST}" \
  "MAIN_JS=$(printf '%q' "$MAIN_JS") REMOTE_PATH=$(printf '%q' "$REMOTE_PATH") bash -ce $(printf '%q' "$REMOTE_CMD")"

echo "✓ Deploy complete: ${DEPLOY_URL}"
echo "  Main bundle: ${MAIN_JS}"
