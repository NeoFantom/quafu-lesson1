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

if command -v google-chrome >/dev/null 2>&1; then
  cat >/tmp/quafu-zoom-test.html <<HTML
<!doctype html><meta charset="utf-8"><body>
<figure id="fig1" class="figure" onclick="zoomFig(this)"><img src="file://$PWD/site/assets/images/platform-map.svg" alt="map"></figure>
<figure id="fig2" class="figure" onclick="zoomFig(this)"><img src="file://$PWD/site/assets/images/quafu-workflow.svg" alt="workflow"></figure>
<div id="modal" onclick="closeModal()"><div id="modalInner" onclick="event.stopPropagation()"></div></div>
<script src="file://$PWD/site/assets/js/app.js"></script>
<script>
setTimeout(()=>{
  fig1.click();
  const first = modal.classList.contains('on') && modalInner.querySelector('.zoomed-media') && modalInner.querySelector('.zoomed-media').src.includes('platform-map.svg');
  closeModal();
  fig2.click();
  const second = modal.classList.contains('on') && modalInner.querySelector('.zoomed-media') && modalInner.querySelector('.zoomed-media').src.includes('quafu-workflow.svg');
  document.body.setAttribute('data-zoom-test', first && second ? 'ok' : 'fail');
}, 50);
</script>
</body>
HTML
  timeout 20s google-chrome --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-extensions --disable-background-networking --no-first-run --no-default-browser-check --virtual-time-budget=1000 --dump-dom file:///tmp/quafu-zoom-test.html >/tmp/quafu-zoom-test-dom.html 2>/tmp/quafu-zoom-test.log
  grep -q 'data-zoom-test="ok"' /tmp/quafu-zoom-test-dom.html
  echo "zoom smoke ok: Fig.1/Fig.2 modal preview"
fi
