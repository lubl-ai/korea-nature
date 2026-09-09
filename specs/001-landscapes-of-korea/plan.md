# Implementation Plan: 한국의 결 (Landscapes of Korea)

**Branch**: `001-landscapes-of-korea` | **Date**: 2026-09-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-landscapes-of-korea/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A single static HTML page ("한국의 결") presents Korea's natural landscapes — Seoraksan, Jeju,
Suncheon Bay, and the Boseong tea fields — as an editorial scroll journey: full Korean-language
copy (Hero lead + two body paragraphs per place) paired with real, license-verified photography.
On desktop, one pinned full-screen stage drives a single GSAP + ScrollTrigger master timeline
(`scrub`, non-`true`, `ease: none`) that scales/cross-fades between scenes and staggers in each
place's name/tagline/body text, holding each scene long enough to read before overlapping into
the next. On mobile and under `prefers-reduced-motion`, the same content renders as a normal
stacked vertical document with no pin and only light fade transitions. No build step, framework,
server, or database is used — `index.html` / `styles.css` / `script.js` plus vendored
GSAP/ScrollTrigger and self-hosted Inter are served as-is from GitHub Pages via relative paths.

## Technical Context

**Language/Version**: HTML5, CSS3, vanilla JavaScript (ES2020+, no transpilation)

**Primary Dependencies**: GSAP core + GSAP ScrollTrigger plugin (vendored locally, no CDN, no package manager)

**Storage**: N/A — static content only, no persistence

**Testing**: Manual browser-based QA per `quickstart.md` (no automated test framework — disproportionate for a static content page with no business logic)

**Target Platform**: Latest desktop and mobile browsers (Chrome, Safari, Firefox, Edge), served as static files from GitHub Pages (including project-subpath deployments)

**Project Type**: Single-page static website (frontend-only, no backend)

**Performance Goals**: 60fps scroll-driven animation using only `transform`/`opacity`; each representative photo optimized to ≤ ~300–500KB (FR-019/SC-008)

**Constraints**: No build process; no React/Vue/Next/server framework; one ScrollTrigger pin + one master timeline for the whole journey (no per-section pins, no CSS `scroll-snap`, no wheel-event hijacking, no forced `scrollTo`); all paths relative (`./assets/...`); `prefers-reduced-motion` disables the pinned/scrub journey entirely; no proprietary font files copied

**Scale/Scope**: 1 HTML page, 6 sections (Hero + 4 places + Outro/footer), 5 photographs, ~3 core files (`index.html`, `styles.css`, `script.js`) plus vendored GSAP and self-hosted Inter font assets

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment |
|---|---|
| I. Single-Page Static Site Scope | PASS — one `index.html`, no login/server/DB/API; GSAP is a client-side animation library, not a server dependency. |
| II. DESIGN.md as Visual Source of Truth | PASS — colors, spacing, radius, and typographic scale tokens from `DESIGN.md` are reused as-is (see research.md §6 for the font substitution required by licensing); `DESIGN.md` itself is not edited. |
| III. Portable Relative Paths | PASS — all asset/script references use `./assets/...`-style relative paths; verified in quickstart.md §5 (subpath check). |
| IV. Semantic HTML & Keyboard Accessibility | PASS — `<header>`/`<main>`/`<section>`/`<figure>`/`<button>` semantics planned; keyboard path validated in quickstart.md §3. |
| V. Respect Reduced-Motion Preference | PASS — `ScrollTrigger.matchMedia()` fully disables the pin/scrub/cross-fade journey under `prefers-reduced-motion: reduce` (research.md §3). |
| VI. Real Written Content, Not Just Photos | PASS — Hero lead + 2 full body paragraphs per place are first-class HTML content (data-model.md `PlaceSection`), not omitted or paraphrased. |
| VII. Body Copy as Independent Design Element | PASS — body text renders in a 36–48rem reading column/panel at readable size/line-height (FR-006), never as an image caption. |
| VIII. Real, Licensed Photography Only | PASS — sourcing/verification/optimization workflow defined in research.md §5; `CREDITS.md` records source, author, URL, license, verified date per image; no placeholders permitted (FR-017). |
| Interaction & Responsive Behavior | PASS — desktop uses one continuous pinned timeline (no per-section pin/snap stops); mobile falls back to plain vertical flow (research.md §2–3). |
| Technical Constraints | PASS — no framework/server added; GSAP+ScrollTrigger are the explicit, user-mandated animation utility, vendored locally with no build step; deployable to GitHub Pages as-is. |

No violations identified. Complexity Tracking table is not needed (left out per template instructions).

## Project Structure

### Documentation (this feature)

```text
specs/001-landscapes-of-korea/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
└── tasks.md              # Phase 2 output (/speckit-tasks command — not created by /speckit-plan)
```

No `contracts/` directory is created: this feature exposes no API, CLI, or other external
interface for another system to call against — it is a static page consumed directly by a
browser. (See Phase 1 step 2 in the command outline, which explicitly allows skipping contracts
for purely internal/non-interface projects.)

### Source Code (repository root)

```text
korea-nature/                      # repo root — served directly by GitHub Pages
├── index.html                     # the single page: Hero + 4 place sections + Outro/footer
├── styles.css                     # all layout/typography/DESIGN.md-token styling
├── script.js                      # GSAP timeline setup, ScrollTrigger.matchMedia buckets,
│                                   # reduced-motion + mobile fallback, resize/refresh handling
├── DESIGN.md                      # existing, read-only visual reference (not modified)
├── CREDITS.md                     # new — per-image source/author/URL/license/verified-date log
├── .nojekyll                      # new — disables GitHub Pages' Jekyll processing
└── assets/
    ├── images/
    │   ├── hero-korea.webp
    │   ├── seoraksan.webp
    │   ├── jeju.webp
    │   ├── suncheon-bay.webp
    │   └── boseong-tea-fields.webp
    ├── vendor/
    │   └── gsap/
    │       ├── gsap.min.js
    │       └── ScrollTrigger.min.js
    └── fonts/
        └── inter/                 # self-hosted Inter Variable woff2 (OFL-licensed)
```

**Structure Decision**: A flat static-site layout at the repository root — no `src/`, no
framework scaffolding, no backend/frontend split — matching both the user's explicit file list
and the constitution's single-page/no-build-step requirements. `specs/001-landscapes-of-korea/`
holds only planning artifacts and is not part of the shipped site.

## Complexity Tracking

*Not applicable — no Constitution Check violations were identified.*
