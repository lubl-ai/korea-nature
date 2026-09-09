<!--
Sync Impact Report
- Version change: [TEMPLATE] → 1.0.0 (initial ratification)
- Modified principles: N/A (first concrete adoption; all placeholders replaced)
- Added sections:
  - Core Principles I–VIII (scope & platform constraints, design fidelity, path portability,
    accessibility & motion, content depth, photo sourcing & licensing)
  - Interaction & Responsive Behavior (desktop scroll feel vs. mobile fallback)
  - Technical Constraints (no frameworks/servers, GitHub Pages deployability)
  - Governance (amendment procedure, versioning policy, compliance review)
- Removed sections: none (template placeholders only)
- Deferred TODOs: RATIFICATION_DATE set to today (2026-09-09) as the adoption date since this is
  the first ratification; no prior date exists to preserve.
- Follow-up: none — all 16 user-supplied principles mapped directly to governance content, no
  implementation work was requested in this command.
-->

# Korea Nature Constitution

## Core Principles

### I. Single-Page Static Site Scope
This project is a single-page static website introducing the beauty of Korea's nature.
No login, authentication, server, database, or API backend MAY be built or introduced at any
point. All functionality MUST be deliverable as static HTML/CSS/JS assets with no backend
runtime dependency.

**Rationale**: Keeping the project static-only eliminates operational burden, security surface,
and hosting cost, and matches the GitHub Pages deployment target.

### II. DESIGN.md as Visual Source of Truth
`DESIGN.md` at the project root is the highest-priority visual reference for all UI decisions
(colors, typography, spacing, tone). Any visual choice MUST be checked against it first. The
original `DESIGN.md` file MUST NOT be modified — it is a read-only design reference, not a
living document.

**Rationale**: Preserving `DESIGN.md` unmodified guarantees a stable, unambiguous design
contract that implementation work is measured against, rather than a moving target.

### III. Portable Relative Paths
Every page path and image path MUST be relative so the site works correctly when served from a
GitHub Project Pages subpath (e.g. `username.github.io/repo-name/`), not only from a domain root.
Absolute root-relative paths (e.g. `/images/...`) MUST NOT be used.

**Rationale**: GitHub Project Pages serves sites from a repository subpath; root-relative paths
silently break asset loading in that environment.

### IV. Semantic HTML & Keyboard Accessibility
Markup MUST use semantic HTML elements appropriate to their content role (headings, nav, main,
section, figure, etc.), and all interactive elements MUST be operable via keyboard alone, with
visible focus states.

**Rationale**: Semantic structure and keyboard access are baseline accessibility requirements
that also improve SEO and maintainability at no added cost.

### V. Respect Reduced-Motion Preference
When the user's system signals `prefers-reduced-motion`, the site MUST present all content
without relying on motion for comprehension, and MUST suppress or substantially reduce
non-essential animation so the experience remains calm and fully legible.

**Rationale**: Motion-triggered discomfort is a real accessibility concern; content must never
be gated behind an animation the user has opted out of.

### VI. Real Written Content, Not Just Photos
The site MUST NOT be a bare photo gallery. It MUST include a Hero lead paragraph and, for each
featured place, two body paragraphs of genuine written content (not filler or lorem ipsum).

**Rationale**: The project's purpose is to introduce Korea's nature meaningfully; photos alone
do not fulfill that editorial goal.

### VII. Body Copy as an Independent Design Element
Body text MUST NOT be shrunk into small captions layered on top of photos. It MUST be treated as
its own design element with readable font size and line-height, laid out independently from the
imagery it accompanies.

**Rationale**: Treating text as a first-class layout element (not a caption afterthought) is
necessary to actually deliver on Principle VI's content requirement.

### VIII. Real, Licensed Photography Only
During implementation, real photographs of Seoraksan, Jeju, Suncheon Bay, and the Boseong green
tea fields MUST be sourced and downloaded from the internet for actual use in the project.
Placeholder images, arbitrary solid-color boxes, and hotlinking to externally hosted images
MUST NOT remain in the final result. Only photos whose reuse terms can be verified MAY be used,
and for each image file the source, photographer, original URL, and license MUST be recorded in
`CREDITS.md`.

**Rationale**: Real, properly licensed imagery is essential to both the credibility of a nature
showcase site and to avoiding copyright/licensing risk; `CREDITS.md` makes reuse terms
auditable.

## Interaction & Responsive Behavior

On desktop, the site MAY use strong scroll-driven interaction, but transitions between scenes
MUST feel continuous — content MUST NOT cut abruptly or jump-snap between sections. On mobile,
the site MAY fall back to a simple, easily readable vertical flow with simpler transitions
instead of replicating the desktop scroll choreography.

## Technical Constraints

No unnecessary frameworks or server-side dependencies MAY be added beyond what is required for a
static site. The final build MUST be directly deployable on GitHub Pages without a build step
that requires server infrastructure.

## Governance

This constitution supersedes all other project practices and ad-hoc decisions for this
repository. Any deviation from a principle above MUST be justified explicitly in the relevant
spec or plan document before implementation proceeds.

**Amendment procedure**: Amendments are made by editing this file via the constitution workflow.
Each amendment MUST update the Sync Impact Report at the top of the file, bump
`CONSTITUTION_VERSION` per the versioning policy below, and set `LAST_AMENDED_DATE` to the date
of the change.

**Versioning policy** (semantic versioning):
- MAJOR: Backward-incompatible removal or redefinition of a principle.
- MINOR: A new principle or materially expanded section is added.
- PATCH: Wording clarifications or non-semantic fixes.

**Compliance review**: Every spec, plan, and implementation pass for this project MUST be
checked against these principles before being considered complete.

**Version**: 1.0.0 | **Ratified**: 2026-09-09 | **Last Amended**: 2026-09-09
