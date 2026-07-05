# Quafu platform UI inventory — participant-facing only

Capture date: 2026-07-06 Asia/Shanghai.
Primary URL: <https://quafu-sqc.baqis.ac.cn/framework/home>.

## Evidence retained

To avoid leaking account-specific or event/organizer-only UI, the repository retains only redacted text captures and a processed feature summary:

- `sources/raw/platform/nav/extract-7.md` — Home/dashboard text extraction.
- `sources/raw/platform/nav/extract-11.md` — Composer text extraction.
- `sources/raw/platform/nav/extract-13.md` — Tasks text extraction.
- `sources/raw/platform/nav/extract-15.md` — User page text extraction with account identifiers redacted.
- `sources/processed/platform-ui-participant-features.json` — participant-facing feature summary used by the tutorial.

Raw screenshots, route dumps, and bundled application code are intentionally not retained as publishable evidence because they can contain account-specific or non-lesson UI.

## Participant-facing areas to teach

| Area | Evidence | Lesson-safe framing |
| --- | --- | --- |
| Home/dashboard | Statistics, personal resources, task statistics, available QPUs, queue, qubits, couplers, median 1Q/2Q error. | Start here after login: check available resources and choose a healthy backend. |
| Composer | Operations palette, qubit wires, OpenQASM panel, output state panel. | Use this to explain gates visually and connect the circuit diagram to OpenQASM. |
| Tasks | Task ID, Task Name, Chip, Status, Submit Time, pagination. | Use this to monitor submitted jobs and find a result by task id. |
| User/Jupyter | User Info, JupyterLab server, Update Password; Jupyter route may show a loading state. | Mention as account/environment orientation, not as the core lesson path. |
| API token | Home exposes a token field and token expiration status. | Explain the concept and safety rules; never display or copy a real token in tutorial material. |

## Public lesson exclusions

The public tutorial must not include event-specific entry points, organizer-only workflows, raw account identifiers, raw API tokens, password-reset walkthroughs, or account-specific task IDs. The site uses redrawn diagrams and placeholders instead of raw logged-in screenshots.
