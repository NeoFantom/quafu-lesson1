# Reference Design Extract — `what.usay.dev/quafu-agent-report/`

Source inspected: `https://what.usay.dev/quafu-agent-report/` on 2026-07-05 UTC. Raw evidence saved in `sources/raw/`.

## Raw evidence saved

- `sources/raw/quafu-agent-report.html` — live HTML capture.
- `sources/raw/quafu-agent-report.css` — extracted inline style block.
- `sources/raw/quafu-agent-report.js` — extracted inline script block.
- `sources/raw/quafu-agent-report.headers.txt` — response headers.
- `sources/raw/quafu-agent-report-evidence.json` — asset, color, link, and font inventory.
- `sources/raw/quafu-agent-report-first-viewport.png` — 1440×1000 reference screenshot.
- `sources/raw/quafu-agent-report-mobile.png` — 390×844 mobile reference screenshot.

## Reusable visual language

### Overall feel

- Technical presentation page, not a conventional marketing page: long-scroll document with slide-style paging controls.
- IBM Carbon-like restraint: white/light gray surfaces, square corners, hairline borders, no rounded-card “consumer app” styling.
- Large amounts of whitespace and thin typography make the page feel like a lecture deck embedded in a website.
- Blue is the only dominant accent; semantic colors appear only for comparison cards or status meaning.

### Color tokens to reuse

Extracted from `sources/raw/quafu-agent-report.css` lines 7–38 and `sources/raw/quafu-agent-report-evidence.json`:

- Light base: `#ffffff` page background, `#f4f4f4` surface, `#e0e0e0` borders / secondary surface.
- Text: `#161616` primary, `#525252` secondary, `#6f6f6f` muted, `#8d8d8d` metadata.
- Accent: `#0f62fe` primary blue, `#0043ce` hover/strong blue, `#ffffff` on-accent.
- Semantic accents: `#24a148` success, `#b28600` warning, `#da1e28` danger, `#8a3ffc` purple.
- Optional dark theme mirrors the same system: background `#161616`, surface `#262626`, border `#393939`, accent `#78a9ff`.

Recommendation for lesson 1: keep light mode as default and use the blue accent for
progress, chapter numbers, links, keyboard hints, and “try this” callouts. Avoid
adding extra accent palettes.

### Typography

Evidence: `sources/raw/quafu-agent-report.css` lines 15–28.

- Display: `Space Grotesk` for logo, hero title, section headings, card labels.
- Body: `Inter` for paragraphs and navigation.
- Mono: `JetBrains Mono` for eyebrow labels, numbered chapter marks, page indicator, code and command snippets.
- Hero title style: thin display font, `font-weight: 300`, tight tracking (`letter-spacing: -.03em`), responsive clamp around 34–50px.
- Body rhythm: 16px base, `line-height: 1.65`, with slightly larger lead paragraphs.

Recommendation for lesson 1: use a bilingual-safe fallback stack, but preserve the
separation: display for headings, body for explanation, mono for procedures/code/status.

### Layout patterns

Evidence: `sources/raw/quafu-agent-report.html` structural lines around
header/nav/sections and `sources/raw/quafu-agent-report.css` lines 52–99,
139–167, 215–237.

- Sticky top nav: 60px high, translucent background with blur, bottom hairline border.
- Max content width: `1260px`; desktop side padding `40px`, mobile `22px`.
- Hero: tall top section (`96px 0 72px`) with a subtle blue-tinted gradient from top to transparent.
- Chapter index: two-column hairline grid on desktop; single-column on mobile. Each item uses mono blue number + display label.
- Section spacing: `80px 0` with bottom border; repeated “talking point” blocks separated by about `60px`.
- Main content + figure layout: two-column grid, text plus a 360px figure column; figures become inline on narrower screens.
- No border radius (`--radius: 0px`): keep square cards and controls.

Recommendation for lesson 1: use this structure directly: sticky nav, hero with
training date/context, chapter grid, then lesson sections with text/code on the left
and visual/checklist panels on the right.

### Components worth reusing

- **Pills / tags:** mono labels in gray surface boxes with border. Good for “Beginner”, “15 min”, “Circuit”, “Run on Quafu”.
- **Hairline TOC grid:** strong first-screen navigation and printable structure.
- **Figure cards:** bordered container, top bar with mono caption and zoom affordance, body area for image/SVG.
- **Comparison cards:** grid with 1px gap and top semantic border. Useful for “common mistake” vs “correct pattern”.
- **Code and command blocks:** dark pre blocks with blue left border; inline code uses gray surface + border.
- **Notes/callouts:** left blue border + gray surface.
- **Tables:** thin borders, hover highlight with translucent blue mix; useful for gate cheat sheets.

### Page-turning / presentation behavior

Evidence: `sources/raw/quafu-agent-report.js` lines 35–66 and `sources/raw/quafu-agent-report.css` lines 215–227.

- Page remains freely scrollable, but also supports slide-like navigation.
- “Slides” are collected from `.hero`, section headings, subheadings, and one ordered list; no custom per-slide markup is required.
- Bottom-right pager includes previous/next buttons and `current / total` indicator.
- Keyboard controls:
  - Space: next item.
  - Shift + Space: previous item.
  - PageDown / PageUp: next / previous item.
- Navigation centers the target item with `scrollIntoView({ block: 'center' })` except hero, which scrolls to top.
- Current index is recalculated from the element nearest 42% viewport height after scroll.

Recommendation for lesson 1: reuse this “free scroll + lesson stepper” model. It is
ideal for instructor-led training because the same page works as notes, a projected
deck, and a self-paced tutorial.

### Theme and interaction behavior

Evidence: `sources/raw/quafu-agent-report.js` lines 2–33.

- Theme toggle stores preference in `localStorage` and changes a top-right icon.
- Figure zoom clones the clicked `svg`/`img` into a modal overlay; Escape closes it.
- Modal interactions are small and safe for static hosting.

Recommendation for lesson 1: include figure zoom only if diagrams are small/dense.
Keep theme toggle optional; if time is limited, implement light-mode only and
preserve token names so dark mode can be added later.

## Asset ideas for Quafu lesson 1

Use original diagrams made for the lesson rather than copying the reference report assets. Reusable asset *types*:

1. **Circuit pipeline diagram:** “create circuit → run/simulate → inspect result”.
2. **Account/access safety diagram:** explain login/token handling without embedding any credential.
3. **Step cards:** one card per hands-on action, with command/code snippet and expected UI/result.
4. **Mistake vs fix comparison:** e.g. wrong qubit order, missing measurement, unsupported gate, confusing simulator vs hardware run.
5. **Result-reading visual:** histogram/counts panel, probability interpretation, and “what should I notice?” annotations.
6. **Instructor checkpoint grid:** “everyone should now have…” rows before moving to the next section.

## Implementation guidance for the static lesson site

- Use static HTML/CSS/JS; no build step is required.
- Keep the first screen a teaching control panel: title, short promise, required setup, and chapter grid.
- Prefer one task per visible section; the page-turner should advance through teaching beats, not arbitrary paragraphs.
- Use square, bordered panels and mono labels to match the reference.
- Keep all public-facing copy using only “Quafu”.
- Do not include competition judging/review or registration-system content.
- Do not include any credential, token, account password, or account-specific secret.

## Parallel probe note

The worker task requested a parallel probe. This pane does not expose a native
subagent launch tool, so I ran independent shell evidence slices instead: structure
extraction, interaction JS extraction, and raw capture inventory. The slices agreed
on the main implementation surface: static HTML/CSS/JS with one sticky nav, one
hero, section blocks, modal zoom, and bottom-right pager.
