# Live task checklist

Updated: 2026-07-07 Asia/Shanghai

Rule for this project: whenever a new request arrives, add it here before continuing implementation. When a task is finished and verified, mark it checked with evidence.

## Active requests from the latest review thread

- [x] Entry overview: put a small raw webpage screenshot inside each of the three official URL cards.
  - Evidence: `site/index.html` uses `entry-home-original.png`, `entry-login-original.png`, and `entry-framework-home-original.png` inside the three link cards.
- [x] Entry overview: card screenshots must have no callout numbers, no annotation labels, and no synthetic URL strip.
  - Evidence: generated from raw page captures/crops under `site/assets/screenshots/entry-*-original.png`.
- [x] Entry overview: remove the separate large screenshot row from that section so the visual belongs to each card.
  - Evidence: `entry-screens` block removed from `site/index.html`.
- [x] Desktop layout: shift the main content slightly right and use more right-side space.
  - Evidence: desktop CSS override sets `.wrap` width from available viewport and uses `margin-left:260px`.
- [x] Hero QR: move the QR card closer to the top-right area while keeping margin.
  - Evidence: desktop CSS sets `.hero-qr{justify-self:end}` and expands the hero grid.
- [x] URL label: rename the `/framework/home` card from “个人主页” to “控制台”.
  - Evidence: entry card title is now “控制台”.
- [x] Screenshot callout numbers: remake marker placement across annotated screenshots.
  - Rule: for large rectangles, place the number circle at the top-edge center of the rectangle.
  - Rule: for short controls or boxes close to marker-circle height, place the full circle above the box so the control stays visible.
  - Evidence: `scripts/annotate-screenshots.py` now uses `marker_anchor_for_rect`; regenerated `00-register.png` through `07-chip-detail.png`.
- [x] Final verification after the marker pass: run validation, scan public text, inspect representative screenshots, commit, push, deploy, and check GitHub Pages build.
  - Evidence: `npm run validate` passed; public text scan passed; representative browser screenshots inspected; master commit `e3cf407` pushed; gh-pages commit `7141838` built; live entry thumbnails and stable register asset returned HTTP 200.

## Completed earlier in this session

- [x] OMX team run finished and shut down.
- [x] Public tutorial structure rebuilt and deployed once.
- [x] QR code asset added and published.
- [x] Jupyter `demo.ipynb` screenshot added.
- [x] Stable asset rule preserved for `site/assets/screenshots/00-register.png`.
