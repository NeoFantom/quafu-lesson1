# Quafu Lesson 1 Project Workflow

## Project type
Mixed research + writing + static website.

## Non-negotiable content rules
- Public tutorial files must use only “Quafu”; do not use the Chinese platform name.
- Do not teach or document competition review/judging or competition registration systems.
- Do not store credentials in files, commits, screenshots, or final reports.

## Source discipline
- Raw captures go in `sources/raw/`.
- Processed summaries/translations go in `sources/processed/` or `notes/`.
- Polished learner-facing output goes in `site/`.
- Every platform/docs claim in the tutorial should trace back to official site/docs captures or clearly marked visual inspection.

## Static site standard
- Prefer dependency-light HTML/CSS/JS before adding frameworks.
- Keep navigation keyboard-friendly and usable as a teaching deck.
- Add scripts/checks for content guardrails and local smoke validation.

## How to change these rules
When a new constraint or repeated friction appears, update this file first, then propagate the change to `AGENTS.md`, validation scripts, and tutorial copy in the same change set.
