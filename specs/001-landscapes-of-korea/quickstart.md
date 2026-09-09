# Quickstart: 한국의 결 (Landscapes of Korea)

Validation guide for the single-page static site. No build step exists — every check below runs
directly against the static files.

## Prerequisites

- The 5 required photos exist under `assets/images/` (`hero-korea.*`, `seoraksan.*`, `jeju.*`,
  `suncheon-bay.*`, `boseong-tea-fields.*`), each ≤ ~300–500KB, each with a matching row in
  `CREDITS.md` (see `data-model.md` → `ImageAsset`). If any is missing, implementation is not
  complete — do not substitute a placeholder and proceed with validation.
- `assets/vendor/gsap/gsap.min.js` and `ScrollTrigger.min.js` are present locally.
- `assets/fonts/` contains the self-hosted Inter woff2 file(s) with an OFL note in `CREDITS.md`.

## Run locally

No server framework is involved; any static file server works, e.g.:

```bash
cd korea-nature
python3 -m http.server 8000
# open http://localhost:8000/index.html
```

(Opening `index.html` directly via `file://` also works for a quick check, but use a local server
to catch any path issues that only surface over HTTP.)

## Validation scenarios

Each scenario maps to an acceptance scenario in `spec.md`.

### 1. Desktop full journey (User Story 1)

1. Open the page at a desktop width (≥ 1280px window).
2. Confirm the Hero shows title "한국의 결", English label "LANDSCAPES OF KOREA", and the full
   lead paragraph — not just a title.
3. Scroll down slowly and confirm, for each of the four places in order (Seoraksan → Jeju →
   Suncheon Bay → Boseong Tea Fields):
   - The place's Korean + English name, one-line tagline, both full body paragraphs, and 2–3
     keywords all appear.
   - The incoming image scales in and briefly overlaps/cross-fades with the outgoing image (no
     hard cut, no snap-stop).
   - Scrolling quickly back and forth does not cause a section to swap instantly — the
     transition still tracks scroll position continuously.
4. Confirm each place holds long enough on screen to read both paragraphs before the next scene
   fully takes over (no flash-and-gone text).
5. Reach the final CTA: confirm the exact title, sentence, and button label from the spec appear,
   plus a simple footer.
6. Click "처음 풍경부터 다시 보기" and confirm the page returns to the Hero section top.

### 2. Mobile content parity (User Story 2)

1. Open the page in a mobile-width viewport (e.g. DevTools responsive mode, ~390px wide).
2. Scroll through all sections and confirm the pinned/scrub journey is replaced by a normal
   vertical flow with simple transitions (no pin, no pinned stage).
3. Confirm every place still shows both full body paragraphs and all keywords — nothing is
   shortened to one line or hidden.

### 3. Reduced motion & keyboard access (User Story 3)

1. Enable "reduce motion" at the OS level (macOS: System Settings → Accessibility → Display →
   Reduce Motion; or DevTools → Rendering → Emulate CSS `prefers-reduced-motion: reduce`).
2. Reload and scroll through the page: confirm no scale/cross-fade/parallax animation plays, and
   every section's content is immediately fully visible and readable while scrolling normally.
3. With motion back to normal, use only the Tab key from page load: confirm focus reaches the
   final CTA button (and any other interactive element) in a logical order, with a visible focus
   ring, and Enter/Space activates it.

### 4. Resize resilience

1. With reduced motion off and a desktop-width window, scroll to roughly the middle of the
   journey (e.g. inside the Jeju scene).
2. Resize the browser window narrower, crossing the mobile breakpoint, then back to desktop
   width.
3. Confirm the layout recovers correctly at each size (no leftover pinned/stuck state, no
   misaligned scenes) — this exercises the `ScrollTrigger.matchMedia()` + resize/refresh handling
   from `research.md` §3.

### 5. GitHub Pages subpath check

1. Serve the repository root such that `index.html` is reachable at a *non-root* path, e.g.
   `http://localhost:8000/korea-nature/index.html` (rename/symlink the served folder, or use any
   static server that lets you nest the project under a subpath).
2. Confirm all 5 images, the vendored GSAP scripts, the fonts, and `styles.css`/`script.js` all
   load with no 404s — this is the local stand-in for GitHub Project Pages' `/repo-name/` prefix.

## Expected outcome

All five scenarios pass without console errors, without any placeholder/solid-color image boxes,
and without any body paragraph appearing truncated. This corresponds to `spec.md` Success
Criteria SC-001 through SC-008.
