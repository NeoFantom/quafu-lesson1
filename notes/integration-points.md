# Delivery scaffold integration points

Task 4 created the dependency-light static shell and validation guardrails. Other lanes can merge into these surfaces:

- `site/index.html` — English learner-facing lesson shell.
- `site/docs-cn/index.html` — natural Chinese mirror shell; keep platform naming as `Quafu`.
- `site/assets/styles.css` — warm paper visual system with deck-friendly panels.
- `site/assets/app.js` — keyboard section navigation (`J` / `K`) and floating controls.
- `scripts/validate.sh` — guardrails for public content, links, repository-wide credential-looking strings, and required files.
- `scripts/smoke.sh` — local static server smoke check.

Current public copy is intentionally placeholder-level. It avoids source claims until official docs/UI evidence from the other workers is merged.
