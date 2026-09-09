---

description: "Task list template for feature implementation"
---

# Tasks: 한국의 결 (Landscapes of Korea)

**Input**: Design documents from `/specs/001-landscapes-of-korea/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: No automated test framework is introduced (per plan.md/research.md §7 — disproportionate for a static content page). Verification instead uses the manual scenarios in `quickstart.md`, referenced from the relevant tasks below.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Flat static-site layout at the repository root (per plan.md "Structure Decision" — no `src/`,
no framework scaffolding):

```text
korea-nature/
├── index.html
├── styles.css
├── script.js
├── CREDITS.md
├── .nojekyll
└── assets/
    ├── images/
    ├── vendor/gsap/
    └── fonts/inter/
```

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project skeleton and vendored dependencies, before any content or image work begins

- [X] T001 Create the static-site skeleton: empty `index.html` (doctype, `<head>` with charset/viewport meta, relative `<link>`/`<script>` placeholders), empty `styles.css`, empty `script.js`, empty `CREDITS.md` with section headers for each of the 5 images, and an empty `.nojekyll` file — all at the repository root
- [X] T002 [P] Download the official GSAP core and ScrollTrigger minified UMD bundles and vendor them at `assets/vendor/gsap/gsap.min.js` and `assets/vendor/gsap/ScrollTrigger.min.js` (research.md §1); add script include placeholders (relative paths) in `index.html`
- [X] T003 [P] Download the open-source Inter Variable font (OFL license) and self-host it as `assets/fonts/inter/InterVariable.woff2`; add an `@font-face` rule (relative `url(./assets/fonts/inter/InterVariable.woff2)`) in `styles.css` and record the font's license/source in `CREDITS.md` (research.md §6)

**Checkpoint**: Repo has its final file skeleton and both vendored dependencies (GSAP, Inter) in place.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Real, license-verified photography and the base document/timeline scaffolding that every user story (desktop journey, mobile fallback, accessibility) depends on. Per the constitution and FR-017, no user-story work may substitute a placeholder image while this phase is incomplete.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete — in particular, none of the 5 images may be a placeholder/solid-color box when Phase 3 starts.

- [X] T004 [P] Search Wikimedia Commons / Unsplash / Pexels for a Hero-appropriate Korean nature landscape photo; open the original detail page (not the thumbnail/search-result URL) to confirm photographer and reuse license; download the original into `assets/images/` as a working file
- [X] T005 [P] Search and verify (same method as T004) a Seoraksan (설악산) representative photo; download the original into `assets/images/`
- [X] T006 [P] Search and verify (same method as T004) a Jeju (제주) representative photo; download the original into `assets/images/`
- [X] T007 [P] Search and verify (same method as T004) a Suncheon Bay (순천만) representative photo; download the original into `assets/images/`
- [X] T008 [P] Search and verify (same method as T004) a Boseong tea fields (보성 녹차밭) representative photo; download the original into `assets/images/`
- [X] T009 Re-encode all 5 downloaded originals from T004–T008 to WebP at `assets/images/hero-korea.webp`, `seoraksan.webp`, `jeju.webp`, `suncheon-bay.webp`, `boseong-tea-fields.webp`, sized to ~1920px long edge and compressed to land within 300–500KB each (FR-019/SC-008) without visible quality loss beyond the source license's terms; remove the uncompressed working files once done
- [X] T010 Record all 5 images in `CREDITS.md` — file path, photographer/organization, original source URL, license/usage terms, and date verified — for every image from T004–T009 (FR-015–FR-017, SC-006)
- [X] T011 Define CSS custom properties in `styles.css` mirroring `DESIGN.md`'s color, spacing, and border-radius tokens (canvas/surface/ink/accent-blue colors; hair→section spacing scale; xs→pill radius scale), plus the `@font-face`/system-sans display-type substitution decided in research.md §6
- [X] T012 Build the base semantic HTML skeleton in `index.html`: `<header>`/Hero placeholder, a `<main class="journey">` wrapper containing 4 empty `<section>` place placeholders (with `id`s `seoraksan`, `jeju`, `suncheon-bay`, `boseong-tea-fields`), and a closing Outro/footer placeholder — no copy or images yet, just the structural landmarks and IDs that later tasks fill in
- [X] T013 In `script.js`, register the GSAP ScrollTrigger plugin (`gsap.registerPlugin(ScrollTrigger)`) and scaffold two empty `ScrollTrigger.matchMedia()` buckets — `"(prefers-reduced-motion: no-preference) and (min-width: 900px)"` and its complement — with no animation logic yet (research.md §3)

**Checkpoint**: All 5 real, licensed, optimized images exist and are credited; base document structure and matchMedia scaffolding are in place. User story implementation can now begin.

---

## Phase 3: User Story 1 - 스크롤을 따라 네 장소의 풍경과 글을 읽는다 (Priority: P1) 🎯 MVP

**Goal**: A desktop visitor scrolling from top to bottom experiences the full Hero → Seoraksan → Jeju → Suncheon Bay → Boseong → Outro journey, with one continuous pinned/scrubbed GSAP timeline driving scale/cross-fade scene transitions and staggered text reveals, each scene holding long enough to read both body paragraphs.

**Independent Test**: Load the page at a desktop width and scroll from the very top to the very bottom; per quickstart.md §1, confirm every section's full copy and image appear, transitions cross-fade/scale continuously (no snap-stops even on fast scrolling), each place holds long enough to read, and the final CTA button returns the page to the Hero.

### Implementation for User Story 1

- [X] T014 [US1] Fill the Hero placeholder in `index.html` with the title "한국의 결", English label "LANDSCAPES OF KOREA", the full lead paragraph text, and the `hero-korea.webp` image (relative `src`, explicit `width`/`height` or `aspect-ratio`, concrete Korean `alt` text) (FR-002, FR-004, FR-016)
- [X] T015 [US1] Fill the `#seoraksan` section in `index.html` with 설악산/SEORAKSAN, its one-line tagline, both full body paragraphs, its 3 keywords, and the `seoraksan.webp` image (relative `src`, dimensions/aspect-ratio, Korean `alt` text); mark it with `data-layout="image-right"` (FR-003, FR-004, FR-016)
- [X] T016 [US1] Fill the `#jeju` section in `index.html` with 제주/JEJU content and its `jeju.webp` image the same way as T015, marked `data-layout="image-left"` (a different layout variant than Seoraksan, per FR-007)
- [X] T017 [US1] Fill the `#suncheon-bay` section in `index.html` with 순천만/SUNCHEON BAY content and its `suncheon-bay.webp` image the same way as T015, marked `data-layout="panel-overlay"` (a third, distinct layout variant, per FR-007)
- [X] T018 [US1] Fill the `#boseong-tea-fields` section in `index.html` with 보성 녹차밭/BOSEONG TEA FIELDS content and its `boseong-tea-fields.webp` image the same way as T015, marked `data-layout="image-right"` variant with adjusted margin/alignment so it does not visually repeat Seoraksan's exact rhythm (FR-007) even though it shares the base variant name
- [X] T019 [US1] Fill the Outro/footer placeholder in `index.html` with the CTA title "오래 보고 싶은 풍경은 천천히 남습니다", its full sentence, a `<button id="restart-journey">` labeled "처음 풍경부터 다시 보기", and a simple `<footer>` with a short credits/copyright line pointing to `CREDITS.md`
- [X] T020 [US1] In `styles.css`, implement the three `data-layout` variants (`image-left`, `image-right`, `panel-overlay`) controlling image/text left-right position, margins, and alignment, plus the shared reading-column rules (36–48rem max-width, 17–20px font size, 1.65–1.85 line-height) and localized text-legibility treatment (gradient/panel behind text rather than a full-image darken) (FR-005, FR-006, FR-007)
- [X] T021 [US1] In `script.js`, inside the desktop `matchMedia` bucket from T013, build the pinned `.stage`/`.journey` structure and a single `gsap.timeline()` driven by one `ScrollTrigger.create({ trigger: '.journey', start: 'top top', end: 'bottom bottom', pin: '.stage', scrub: 1.2 })`, with labeled segments for `hero`, `seoraksan`, `jeju`, `suncheon-bay`, `boseong-tea-fields`, `outro` (research.md §2)
- [X] T022 [US1] In `script.js`, add `transform`/`opacity`-only tweens per scene segment: incoming image scale-in + fade, outgoing image continued fade over a 20–30% timeline overlap into the next segment, staggered text fade+translate for name/tagline/body, and a slower-moving foreground gradient layer for parallax (FR-008; research.md §4)
- [X] T023 [US1] In `script.js`, tune each scene's timeline duration/overlap so that, per FR-009, a scene's body text remains fully visible and readable for a sustained scroll interval before the next scene's overlap begins, and rapid back-and-forth scrolling never causes an instant scene swap
- [X] T024 [US1] In `script.js`, wire `#restart-journey`'s click handler to scroll the page back to the Hero section's top (`window.scrollTo` or `element.scrollIntoView`) (FR-014)
- [X] T025 [US1] In `script.js`, call `ScrollTrigger.refresh()` once all images and the self-hosted font have finished loading (`Promise.all` over `img.decode()`/`document.fonts.ready`), so pin/scrub positions are correct from the first scroll

**Checkpoint**: User Story 1 is fully functional and independently testable per quickstart.md §1 — the complete desktop journey works end to end.

---

## Phase 4: User Story 2 - 모바일에서 읽기 쉬운 세로 흐름으로 같은 콘텐츠를 본다 (Priority: P2)

**Goal**: A mobile visitor sees the same 6 sections and full copy as desktop, but as a normal stacked vertical document with simple transitions instead of the pinned/scrub journey.

**Independent Test**: Load the page at a mobile viewport width and scroll from top to bottom; per quickstart.md §2, confirm no pin/stage locking occurs and every place's full body paragraphs and keywords are present, unabridged.

### Implementation for User Story 2

- [X] T026 [US2] In `styles.css`, add the narrow-viewport layout rules (matching the `matchMedia` width threshold from T013) that turn each place section into a normal stacked block: full-bleed image followed by its text content in-flow, with the same font sizes/line-heights as desktop (no shrinking or truncation) (FR-011)
- [X] T027 [US2] In `script.js`, inside the non-desktop `matchMedia` bucket from T013, implement a lightweight `IntersectionObserver` that adds a simple fade/translate-in class to each section as it enters the viewport (no pin, no scrub, no GSAP timeline) (FR-011)
- [X] T028 [US2] Manually verify, per quickstart.md §2, that at a mobile viewport every place section shows both full body paragraphs and all keywords with nothing hidden or truncated, and that section transitions are simple (no pin/snap)

**Checkpoint**: User Stories 1 AND 2 both work independently — desktop gets the full journey, mobile gets full content in a simple flow.

---

## Phase 5: User Story 3 - 키보드 사용자와 모션 축소 설정 사용자가 콘텐츠에 접근한다 (Priority: P3)

**Goal**: Keyboard-only visitors can reach and activate every interactive element, and visitors with `prefers-reduced-motion` enabled see all content immediately without the pin/scrub/cross-fade animations.

**Independent Test**: Per quickstart.md §3, enable OS-level reduced motion and confirm no animation plays while all content remains readable; separately, tab through the page with no mouse and confirm the CTA button (and any other interactive element) is reachable with a visible focus ring and activates on Enter/Space.

### Implementation for User Story 3

- [X] T029 [US3] In `styles.css`, add a visible `:focus-visible` style for `#restart-journey` and any other interactive element, and confirm heading levels/landmarks (`<header>`, `<main>`, `<section>`, `<footer>`) follow a logical, single top-to-bottom reading/tab order (FR-013)
- [X] T030 [US3] In `script.js`, confirm the `prefers-reduced-motion: reduce` branch of the `matchMedia` scaffold from T013 never builds the pinned/scrub timeline from T021–T023, instead falling through to the same non-pin stacked-flow path used for mobile in T027 (FR-012)
- [X] T031 [US3] Manually verify, per quickstart.md §3, that reduced motion shows all content immediately with no animation, and that Tab-only navigation reaches and can activate `#restart-journey` with a visible focus indicator

**Checkpoint**: All three user stories are independently functional — desktop journey, mobile fallback, and accessibility are each verifiable on their own.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-story validation and final constitution/spec compliance checks

- [X] T032 [P] Per quickstart.md §4, verify resizing the browser across the mobile/desktop breakpoint mid-scroll (with reduced motion off) leaves no stuck pinned state and recalculates scene positions correctly (`ScrollTrigger.matchMedia()` resize handling)
- [X] T033 [P] Per quickstart.md §5, serve the site from a non-root subpath (simulating GitHub Project Pages) and confirm all images, vendored GSAP scripts, fonts, `styles.css`, and `script.js` load with no 404s (FR-018, SC-007)
- [X] T034 Audit `script.js`/`styles.css` to confirm all scroll-driven animations touch only `transform`/`opacity` (no continuously animated `filter`/`blur`), and that `will-change` is applied only to the elements actually being transformed during the journey
- [X] T035 Re-run the full `quickstart.md` scenario list end to end and confirm `CREDITS.md` has one complete, accurate row per image (path, author, source URL, license, verified date) with no image left undocumented (SC-006)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories (in particular, real images from T004–T010 must exist before any story work begins; no placeholders permitted)
- **User Stories (Phase 3–5)**: All depend on Foundational phase completion
  - US1 (desktop journey) has no dependency on US2/US3
  - US2 (mobile fallback) shares the `matchMedia` scaffold from Phase 2 but does not depend on US1's timeline code (T021–T025)
  - US3 (accessibility) depends on the CTA button existing (T019, from US1) to add focus styling to, and reuses US2's non-pin stacked-flow path (T027) for the reduced-motion branch — implement US1 and US2 before US3 for this reason
- **Polish (Phase 6)**: Depends on all three user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependency on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — independently testable, but T030 (US3) reuses its non-pin path, so keep US2 ahead of US3
- **User Story 3 (P3)**: Can start after Foundational (Phase 2), but practically depends on US1's CTA markup (T019) and US2's non-pin fallback (T027) already existing

### Within Each User Story

- Content markup tasks (T014–T019) before styling (T020) before timeline/behavior scripting (T021–T025)
- Story complete before moving to the next priority for a solo implementer; independent stories may be split across contributors after Phase 2

### Parallel Opportunities

- T002 and T003 (Setup) can run in parallel — different files, no shared dependency
- T004–T008 (Foundational image sourcing) can run in parallel — 5 independent searches/downloads into different destination filenames
- T032 and T033 (Polish) can run in parallel — independent verification passes
- Within US1, T015–T018 (four place-section content fills) touch the same `index.html` file sequentially in practice, but are logically independent of each other and could be split across contributors working on the same file with care around merge conflicts

---

## Parallel Example: Foundational Image Sourcing

```bash
# Launch all 5 image searches/downloads together:
Task: "Search, verify, and download the Hero landscape photo into assets/images/"
Task: "Search, verify, and download the Seoraksan photo into assets/images/"
Task: "Search, verify, and download the Jeju photo into assets/images/"
Task: "Search, verify, and download the Suncheon Bay photo into assets/images/"
Task: "Search, verify, and download the Boseong tea fields photo into assets/images/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — real, credited images required before proceeding)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run quickstart.md §1 against the desktop journey
5. Deploy/demo if ready — this alone is a legitimate, content-complete single-page site, just without the mobile/reduced-motion fallbacks

### Incremental Delivery

1. Complete Setup + Foundational → real assets and scaffolding ready
2. Add User Story 1 → validate via quickstart.md §1 → deploy/demo (MVP!)
3. Add User Story 2 → validate via quickstart.md §2 → deploy/demo
4. Add User Story 3 → validate via quickstart.md §3 → deploy/demo
5. Finish with Phase 6 Polish (resize + subpath + performance + full quickstart re-run) before calling the feature done

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No automated tests exist for this feature; every "test" reference points to a manual `quickstart.md` scenario
- Do not mark Phase 2 (image sourcing) complete with a placeholder, solid-color box, or hotlinked URL under any circumstance — FR-017 makes this a hard blocker, not a fallback
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
