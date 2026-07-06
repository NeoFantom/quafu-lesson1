# webpage-respond template update

Date: 2026-07-06

External skill files updated:

- `/home/neo/.codex/skills/webpage-respond/SKILL.md`
- `/home/neo/.claude/skills/webpage-respond/SKILL.md`

Purpose: make the current Quafu Lesson 1 webpage the standard `webpage-respond` tutorial/report template while preserving the warm-paper design system.

Included requirements:

- Code blocks use light-theme syntax highlighting with language labels.
- OpenQASM snippets and Python strings containing `OPENQASM` receive dedicated highlighting and the label `OpenQASM lint: syntax parse check`.
- The template records the full rendering regression checklist from this lesson thread: figure zoom, URL-strip screenshots, numbered callouts, anti-aliased markers, no connector-line clutter, separated TOC/resource links, optional left TOC, optional top fixed bar, fixed pager, link-grid filler prevention, external-link jump icons, and deployment smoke checks.
- The process now asks agents to choose page modules before building and to run the rendering checklist before delivery.
- Local hosting instructions now work from Codex and Claude skill locations.

Validation evidence:

- Codex and Claude `SKILL.md` files are byte-identical after synchronization.
- A structural assertion checked required headings, OpenQASM guidance, optional navigation modules, and the forbidden Chinese contrast phrasing.
- The bundled `quick_validate.py` flags the pre-existing local custom frontmatter key `disable-model-invocation`; that key was retained to avoid changing runtime behavior outside this template update.
