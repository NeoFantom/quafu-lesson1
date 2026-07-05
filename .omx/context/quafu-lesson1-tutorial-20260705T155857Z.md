# Context Snapshot — Quafu Lesson 1 Tutorial

## Task statement
Prepare a web-based tutorial for the first public Quafu quantum cloud platform lesson on 2026-07-07, targeted at quantum competition participants. Use the visual language and page-turning feel of https://what.usay.dev/quafu-agent-report/ as reference.

## Desired outcome
- A static tutorial website in this repo, runnable locally and ready for GitHub Pages/static hosting.
- A Chinese translation/static mirror of Quafu documentation from https://quafu-sqc.readthedocs.io/en/latest/ with natural Chinese, independently calibrated/reviewed rather than stiff literal translation.
- Tutorial content that explains Quafu platform features and Python SDK workflow with screenshots/diagrams/text.

## Known facts/evidence
- Official platform: https://quafu-sqc.baqis.ac.cn/framework/home
- Official docs: https://quafu-sqc.readthedocs.io/en/latest/
- Reference visual template: https://what.usay.dev/quafu-agent-report/
- Non-committee user credentials were provided in chat for website login; do not write them into project files or commits.
- Project directory was initially almost empty and not a git repo.

## Constraints
- Use only the English name “Quafu”; do not use the Chinese name in tutorial/public files.
- Exclude competition review/judging system and competition registration system content; those are not relevant to normal participants and may be visible only to committee accounts.
- Prefer static, dependency-light implementation.
- Keep source evidence separate from polished tutorial; facts should have source links.
- Do not leak credentials into files, logs committed to repo, screenshots, or final output.

## Acceptance criteria
1. Local static site exists and opens from `site/index.html` or an equivalent root entry.
2. Visual design clearly borrows the reference report style: warm/paper-like background, card sections, simple page/slide navigation.
3. Website includes a learner-oriented Quafu first-lesson path: account/login, platform orientation, circuit building, simulator/real-backend submission, task/results, SDK/docs workflow, troubleshooting, next steps.
4. Public tutorial files contain no forbidden Chinese platform name and no review/registration/judging guidance.
5. Docs translation artifacts exist under `site/docs-cn/` or equivalent and are linked from the tutorial.
6. Evidence artifacts exist in `sources/` or `notes/` for website/docs/template research.
7. Build/smoke checks pass: link/file existence, static content guardrails, and at least one local server smoke check.
8. If external GitHub Pages publishing is not safely possible, repo includes a clear publish command/script and final report states the blocker.

## Unknowns/open questions
- Exact current Quafu UI feature set visible to the provided non-committee account.
- Whether a complete docs crawl can finish quickly enough; if not, prioritize full nav inventory plus translated core pages for lesson 1.
- Whether GitHub CLI is authenticated and which personal GitHub Pages repo should be used.
- Whether AI image endpoints are available; if not, use hand-authored SVG/CSS diagrams.

## Likely touchpoints
- `AGENTS.md`, `WORKFLOW.md` for project-local governance.
- `sources/raw/` for captured HTML/Markdown/screenshots.
- `notes/` for research synthesis and outline.
- `site/` for tutorial static website, docs translation, assets, validation scripts.
