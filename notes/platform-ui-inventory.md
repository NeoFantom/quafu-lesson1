# Quafu platform UI inventory (participant-facing lane)

Capture date: 2026-07-06 (Asia/Shanghai)  
Primary URL: https://quafu-sqc.baqis.ac.cn/framework/home

## Evidence saved

- `sources/raw/platform-ui/home.curl.html` — initial SPA shell from the primary URL.
- `sources/raw/platform-ui/home.curl.headers.txt` — HTTP status/final URL headers for the shell capture.
- `sources/raw/platform-ui/assets/CnezOGbS.js` — main bundled application script referenced by the shell.
- `sources/raw/platform-ui/assets/BOZ3q9N9.css` — main stylesheet referenced by the shell.
- `sources/raw/platform-ui/assets/chunks/` — lazy-loaded JS/CSS chunks referenced by the main bundle.
- `sources/raw/platform-ui/home.screenshot.png` — anonymous browser screenshot of the primary URL.
- `sources/raw/platform-ui/home.login-redacted.png` — derivative screenshot with the non-lesson event notice covered; safe candidate for internal design reference.
- `sources/raw/platform-ui/home.rendered.dom.html` — anonymous browser-rendered DOM for the primary URL.
- `sources/raw/platform-ui/routes/*.dom.html` and `sources/raw/platform-ui/routes/*.screenshot.png` — anonymous route probes for `/framework/home`, `/framework/composer`, `/framework/tasks`, `/framework/user`, `/framework/jupyter`, `/framework/meters`, and `/framework/monitor`.
- `sources/raw/platform-ui/bundle-extract.json` — route/API/string extraction from the main bundle.
- `sources/raw/platform-ui/feature-string-inventory.json` — route/API/string extraction from lazy chunks.

## What anonymous users can see

The primary URL is browser-readable without credentials, but the application gates participant functionality behind login. Anonymous route probes for the lesson-relevant routes resolve to the login screen, and `/framework/tasks` additionally shows an “Authentication is required, please login” message.

The visible anonymous login screen has these lesson-relevant orientation points:

- Quafu uses an email/password login flow.
- A forgot-password path is visible.
- A sign-up link is visible, but the lesson should avoid walking through sign-up or event-specific flows.
- The page uses an abstract light-blue quantum/computing background and a centered white login card.

## Participant-relevant features inferred from browser-readable assets

Because logged-in pages are gated, the feature inventory below is an inference from public SPA route names, API paths, and chunk strings. It should be presented as “the platform has areas for…” rather than as a screenshot-verified walkthrough until a sanitized logged-in capture is available.

| Area | Evidence | Lesson-safe framing |
| --- | --- | --- |
| Home/dashboard | Routes `/framework/home`; chunk strings include dashboard, Tasks statistics, available chips, current user, and feedback APIs. | Use as the post-login orientation page: check overall status, available resources, and account state. |
| Circuit composer | Route `/framework/composer`; chunks reference circuit editing, OpenQASM export/import style strings, generated circuits, target qubits, available chips, task submission APIs. | Teach this as the “build a simple circuit and prepare a run” area. |
| Backend / chip availability | API paths `/api/availableChips`, strings such as AllChips, MyChips, Qubits, chipName. | Explain that learners should select an available backend/simulator and note qubit limits before running. |
| Tasks / jobs | Route `/framework/tasks`; API path `/api/tasks`; strings include Task Name, Task details, Refresh task status, cancel/delete selected tasks. | Teach this as the “monitor submitted runs” area: search by task ID, refresh status, inspect details. |
| Results | Composer/task chunks include result components and simulation result strings. | Explain that results are reached from task details after a run completes. |
| API token | Home chunk references `/api/api-token`, `/api/api-token-expiration`, Refresh token, Token copied, Token refreshed. | Mention only conceptually: token exists for API use; never display or copy a real token in tutorial screenshots. |
| Jupyter | Routes `/framework/jupyter`; chunk strings include Jupyter/JupyterLab server and `/api/jupyterhub`. | Optional orientation: note that some users may have a Jupyter environment, if enabled by their account. |
| Meters / monitor | Routes `/framework/meters`, `/framework/monitor`; APIs include meters info and system stats. | Treat as platform status/monitoring areas, not core lesson-1 flow unless the leader decides to include them. |

## Hard exclusions for the public lesson

Do not include event-specific notices, event sign-up flows, review/judging routes, organizer views, password reset walkthroughs, activation flows, raw API tokens, usernames, emails, project/team identifiers, or any account-specific task IDs.

Denylist observed in assets:

- `/challenges/*`
- `/framework/review*`
- `/framework/review-management*`
- `/framework/review-assignment*`
- `/register`
- `/activation`
- `/retrievePassword`
- `/resetPassword`

## Suggested lesson-1 flow from this lane

1. Start with a public-safe login/orientation screenshot (`home.login-redacted.png` if a visual is needed).
2. Explain that participants sign in with their provided account, but credentials are never written into lesson files.
3. After login, orient them to Home/dashboard, Composer, backend selection, Tasks, Results, and API token location at a high level.
4. Avoid any step that asks learners to sign up, enter event flows, review submissions, or expose tokens.
5. If a later lane provides sanitized logged-in captures, replace inferred feature descriptions with screenshot-backed steps.
