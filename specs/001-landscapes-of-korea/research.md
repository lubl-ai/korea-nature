# Research: 한국의 결 (Landscapes of Korea)

All technical choices were specified directly by the user's `/speckit-plan` input. This document
resolves the *how* for each choice against the feature's constraints (constitution, spec FRs),
since no `NEEDS CLARIFICATION` markers remain in the Technical Context.

## 1. GSAP + ScrollTrigger distribution

- **Decision**: Download the official GSAP core and ScrollTrigger UMD minified bundles once and
  vendor them locally at `assets/vendor/gsap/gsap.min.js` and
  `assets/vendor/gsap/ScrollTrigger.min.js`. Reference them from `index.html` with relative
  `<script>` tags, registered in `script.js` via `gsap.registerPlugin(ScrollTrigger)`.
- **Rationale**: GSAP's no-cost license covers this standard client-side use. Vendoring avoids a
  runtime dependency on a third-party CDN (matches the constitution's relative-path/self-contained
  deployment principle and avoids an extra failure point on GitHub Pages). No build step or
  package manager is introduced — the files are static assets, consistent with "no build process."
- **Alternatives considered**: CDN `<script src="https://cdn.jsdelivr.net/...">` — rejected to
  avoid an external network dependency at runtime. npm + bundler (Vite/webpack) — rejected, user
  explicitly excluded any build process.

## 2. Single-pin master timeline architecture

- **Decision**: One `.journey` wrapper element sized to `(scene count) × 100vh` contains a single
  pinned `.stage` (`position: sticky` fallback + `ScrollTrigger.create({ trigger: '.journey',
  start: 'top top', end: 'bottom bottom', pin: '.stage', scrub: 1.2 })`). A single GSAP
  `gsap.timeline()` is attached to that ScrollTrigger via `animation:` and contains labeled
  segments (`hero`, `seoraksan`, `jeju`, `suncheon`, `boseong`, `outro`), each occupying a
  proportional slice of timeline duration with ~20-30% overlap into the next segment for the
  cross-fade/tunnel effect.
- **Rationale**: Directly satisfies the user's explicit "one pin, one master timeline" requirement
  and FR-010 (no per-section pins, no scroll-snap, no wheel hijacking). `scrub: 1.2` (a finite
  number, not `true`) makes the timeline lag the scrollbar slightly for a smoothed, non-jumpy feel;
  `ease: "none"` on all scrubbed tweens avoids the timeline itself accelerating/decelerating
  independent of scroll input.
- **Alternatives considered**: Per-section `ScrollTrigger.create` with individual `pin: true` —
  explicitly forbidden by the user (repeated pin/unpin causes the stop-and-go feel being avoided).
  IntersectionObserver-driven CSS class toggling — rejected because it cannot produce a
  frame-accurate scrub tied to scroll position, which the required tunnel/cross-fade effect needs.

## 3. Reduced-motion and mobile fallback

- **Decision**: Use `ScrollTrigger.matchMedia()` with two buckets:
  - `"(prefers-reduced-motion: no-preference) and (min-width: 900px)"` → builds the pinned
    master-timeline journey described above.
  - Everything else (`prefers-reduced-motion: reduce`, or narrow viewports) → no pin, no scrub;
    sections render as normal stacked blocks and only a lightweight opacity/translate-in fade
    (skipped entirely under reduced motion) is applied via IntersectionObserver, respecting
    `prefers-reduced-motion` directly in that fallback path too.
- **Rationale**: `matchMedia()` is GSAP's documented pattern for responsive ScrollTrigger setups —
  it automatically reverts/cleans up animations when the matched condition changes (e.g. window
  resize crossing the breakpoint), which directly satisfies the "resize must recompute correctly"
  requirement. It also gives one code path that simultaneously satisfies FR-011 (mobile fallback)
  and FR-012/US3 (reduced motion) without duplicated logic.
- **Alternatives considered**: Manual `matchMedia` listener with hand-written cleanup — rejected as
  more error-prone and duplicative of what `ScrollTrigger.matchMedia()` already provides.

## 4. Scene visual technique (parallax, reveal, cross-fade, tunnel)

- **Decision**: Each place is an absolutely-positioned full-viewport `.scene` layer inside
  `.stage`, itself split into a `.scene__image` layer and a `.scene__text` layer. The timeline
  tweens only `transform` (`scale`, `xPercent`/`yPercent`) and `opacity` on these layers:
  incoming scene image scales down from ~1.15 → 1.0 while fading in (the "tunnel" approach into
  the frame), the outgoing scene's image continues a slow scale/opacity fade for its overlap
  window, and text layers fade + translate in with a small stagger offset from their scene's
  image. A thin foreground gradient layer moves at a slightly different rate for the
  foreground/background parallax cue. An `overflow: hidden` mask on `.stage` handles the reveal
  clipping without needing `clip-path` animation (which would be layout-costly).
- **Rationale**: Keeps every animated property on the GPU-cheap transform/opacity path (performance
  principle), avoids animating `filter`/`blur` continuously, and reproduces the "scene enters the
  frame" sensation named in the Awwwards reference using only the primitives already decided above
  — no copied code or assets from that reference.
- **Alternatives considered**: CSS 3D perspective tunnel (`perspective` + `translateZ`) — rejected
  as added complexity/GPU cost for marginal gain over the scale+opacity approach. WebGL/Three.js —
  explicitly excessive for a static content site and against the simplicity constitution principle.

## 5. Image sourcing & optimization workflow

- **Decision**: During implementation, search Wikimedia Commons / Unsplash / Pexels for each of
  the 5 required photos, open each candidate's original detail page to confirm photographer and
  license terms (never trust thumbnail/search-result URLs), download the chosen original via
  direct file fetch into `assets/images/`, then re-encode to WebP sized for near-fullscreen
  display (~1920px long edge) and compressed to land within the clarified 300–500KB budget
  (FR-019/SC-008) while preserving visible quality and the source license's requirements. Each
  `<img>` gets explicit `width`/`height` (or a CSS `aspect-ratio`) to prevent layout shift.
- **Rationale**: Matches FR-015/FR-016/FR-017 and the constitution's photo-sourcing principle
  exactly; WebP gives the best quality-per-byte for photographic content among formats safe to
  rely on in current browsers without a fallback build step.
- **Alternatives considered**: Hotlinking source URLs — explicitly forbidden. Leaving originals
  unoptimized — would blow the 300–500KB budget and risk large layout-shift on slow connections.

## 6. Typography sourcing vs. DESIGN.md

- **Decision**: DESIGN.md's display typeface (GT Walsheim Medium/Framer Medium) is a commercial
  font that cannot be legally copied into this project. Display headings will use DESIGN.md's
  documented fallback (`GT Walsheim Medium Placeholder` / system sans-serif stack) styled with the
  same size/weight/line-height/negative-letter-spacing tokens so the *shape* of the type system is
  preserved. Body type (`Inter Variable`) is genuinely open-source (SIL OFL) — it will be
  self-hosted as a local `.woff2` under `assets/fonts/` with a proper OFL license note in
  `CREDITS.md`, rather than fetched from an external font CDN at runtime.
- **Rationale**: Satisfies the user's "don't copy proprietary fonts, use a legal substitute"
  instruction while staying faithful to DESIGN.md wherever legally possible, and keeps the site
  fully self-contained (no external font-service network dependency).
- **Alternatives considered**: Loading Inter from Google Fonts CDN — rejected in favor of a fully
  self-hosted, offline-safe asset; using a non-Inter system font for body text — rejected because
  Inter is explicitly documented in DESIGN.md and is legally self-hostable.

## 7. Testing approach

- **Decision**: No automated test framework is introduced. Verification is a manual QA pass
  (documented in `quickstart.md`) covering: full-journey scroll on desktop, mobile viewport
  content-parity check, `prefers-reduced-motion` toggle check, keyboard-only navigation to the CTA
  button, a resize check (DevTools responsive mode) confirming ScrollTrigger recalculates, and a
  GitHub Pages project-subpath smoke test for relative paths.
- **Rationale**: Consistent with the constitution's simplicity principle (no unnecessary
  frameworks/dependencies) and appropriate for a static content site with no business logic to
  unit test; GSAP/ScrollTrigger behavior is inherently visual and best verified by direct browser
  observation.
- **Alternatives considered**: Playwright/Cypress e2e suite — rejected as disproportionate tooling
  weight for a single static page with no interactive state machine beyond scroll position.
