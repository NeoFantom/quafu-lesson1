#!/usr/bin/env bash
set -euo pipefail
PORT="${PORT:-4177}"
python3 -m http.server "$PORT" -d site >/tmp/quafu-lesson-http.log 2>&1 &
pid=$!
trap 'kill $pid 2>/dev/null || true' EXIT
for i in {1..40}; do
  if curl -fsS "http://127.0.0.1:$PORT/" >/tmp/quafu-lesson-index.html; then break; fi
  sleep 0.25
done
curl -fsS "http://127.0.0.1:$PORT/docs-cn/" >/tmp/quafu-lesson-docs.html
grep -q 'Quafu Lesson 1' /tmp/quafu-lesson-index.html
grep -q 'Quafu 官方文档中文导读' /tmp/quafu-lesson-docs.html
echo "smoke ok: http://127.0.0.1:$PORT/ and /docs-cn/"
