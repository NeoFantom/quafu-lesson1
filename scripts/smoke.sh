#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8765}"
LOG="${TMPDIR:-/tmp}/quafu-lesson1-smoke.log"
TMP="$(mktemp -d)"
python3 -m http.server "$PORT" --directory "$ROOT/site" >"$LOG" 2>&1 &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" >/dev/null 2>&1 || true; rm -rf "$TMP"; }
trap cleanup EXIT
for _ in 1 2 3 4 5; do
  if curl -fsS "http://127.0.0.1:$PORT/" -o "$TMP/index.html"; then
    break
  fi
  sleep 0.2
done
curl -fsS "http://127.0.0.1:$PORT/" -o "$TMP/index.html"
curl -fsS "http://127.0.0.1:$PORT/docs-cn/" -o "$TMP/docs-cn.html"
curl -fsS "http://127.0.0.1:$PORT/assets/styles.css" -o "$TMP/styles.css"
curl -fsS "http://127.0.0.1:$PORT/assets/app.js" -o "$TMP/app.js"
grep -q 'Quafu Lesson 1' "$TMP/index.html"
grep -q 'Quafu 第一课' "$TMP/docs-cn.html"
grep -q ':root' "$TMP/styles.css"
grep -q 'scrollIntoView' "$TMP/app.js"
printf 'PASS: local static smoke check served index, Chinese mirror, CSS, and JS on port %s\n' "$PORT"
