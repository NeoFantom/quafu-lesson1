# Quafu Lesson 1 QA validation checklist

Date: 2026-07-06 Asia/Shanghai  
Owner lanes: OMX team worker-1/2/3 plus leader integration

## Current public tutorial scope

The public page is a durable student-facing tutorial for Quafu Lesson 1. It covers:

1. Platform entry overview: `/home`, `/login`, `/framework/home`, English docs, Chinese docs.
2. Public home preview: SQCLab login button, blue `here` docs link, chip cards, chip detail page.
3. Register/login: email, password, verification email, email activation, login.
4. Framework console: Home, Composer, Tasks, User.
5. Jupyter demo: `demo.ipynb` with default token already prepared for direct running and a chip topology view.
6. QuarkStudio SDK: `tmgr.status()`, `tmgr.run(task)`, `tmgr.result(tid)`.
7. Result reading and quafu-skill follow-up.

## Current PASS checks to run before publishing

- `npm run lint`
  - required public files exist;
  - public text guardrails pass;
  - local HTML links and image/script/style assets resolve;
  - required lesson keywords are present.
- `npm run typecheck`
  - static-project sentinel passes.
- `npm test`
  - local server responds for `/` and `/docs-cn/`;
  - headless Chrome opens early figure zoom modals when Chrome is available.
- Public text scan for:
  - Chinese platform name;
  - organizer/judging/competition-registration copy;
  - personal email or credential-looking assignments;
  - forbidden sentence pattern requested by the user.
- Browser screenshots at desktop, tablet/collapsed side-dock, and mobile widths.

## Asset policy

- `site/assets/screenshots/00-register.png` is a stable public URL already referenced by another repository. Do not rename, move, or delete it.
- `site/assets/images/lesson-qr.png` is intentionally public and referenced twice: hero top-right and closing section.
- `site/assets/screenshots/08-jupyter-demo.png` is intentionally public and referenced by the Jupyter demo section.
- `site/assets/screenshots/09-login.png` is the login screenshot with a white URL strip.

## Known validation gaps

1. Raster screenshots are checked for existence, not OCR text or exact visual content.
2. QR content is not decoded automatically in `npm run validate`.
3. Smoke tests do not click every single figure, every quick link, and every pager stop.
4. Layout regressions still require screenshot review at representative widths.

## Recommended future hardening

- Decode `site/assets/images/lesson-qr.png` in CI when `zbarimg` or an equivalent decoder is available.
- Add screenshot dimension assertions for stable assets.
- Extend browser smoke to click every `.figure`, toggle the theme, and call `pageNext()` / `pagePrev()`.
- Keep public copy scans focused on `site/index.html` plus rendered HTML assets, while avoiding false positives from developer notes.

## Team evidence integrated

- Task 1: student-facing structure and copy pass.
- Task 2: responsive navigation, quick-link alignment, side-dock dots, mobile layout, and hero handoff behavior.
- Task 3: QA checklist, public-copy guardrails, screenshot/QR risk review.
- Task 4: no-edit guardrail lane and validation sanity check.
