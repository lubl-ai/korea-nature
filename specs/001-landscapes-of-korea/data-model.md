# Data Model: 한국의 결 (Landscapes of Korea)

This is a static content site with no runtime database, API, or persisted state. "Entities" here
describe the content structure that `index.html` must express semantically, and (where relevant)
the small in-memory config `script.js` uses to drive the single GSAP timeline. There are no state
transitions, no persistence, and no identity/uniqueness rules beyond "each place appears exactly
once, in the fixed order given by the spec."

## Entity: HeroContent

Represents the page's entry section (spec §Hero).

| Field | Type | Notes |
|---|---|---|
| title | string | "한국의 결" — rendered as the page's main `<h1>` |
| englishLabel | string | "LANDSCAPES OF KOREA" — secondary label, e.g. `<p class="eyebrow">` |
| lead | string | Full lead paragraph text, rendered in full (FR-002, FR-004) |
| image | ImageAsset ref | The Hero representative photo |

## Entity: PlaceSection

Represents one of the four required places (설악산, 제주, 순천만, 보성 녹차밭). Exactly four
instances exist, rendered in the fixed order: Seoraksan → Jeju → Suncheon Bay → Boseong Tea
Fields (FR-001).

| Field | Type | Notes |
|---|---|---|
| id | string (slug) | `seoraksan` \| `jeju` \| `suncheon-bay` \| `boseong-tea-fields` — used as the `ScrollTrigger`/timeline label and as the image filename stem |
| nameKo | string | Korean place name (e.g. "설악산") |
| nameEn | string | English place name (e.g. "SEORAKSAN") |
| tagline | string | The "한 줄 제목" — one-line character statement of the landscape |
| bodyParagraph1 | string | First body paragraph, full text, never truncated (FR-003, FR-004) |
| bodyParagraph2 | string | Second body paragraph, different length than paragraph 1 (FR-003) |
| keywords | string[2..3] | Short landscape keywords/info (FR-003) |
| image | ImageAsset ref | The place's near-fullscreen representative photo |
| layoutVariant | enum | One of `image-left` \| `image-right` \| `panel-overlay` (or similar) — controls left/right position, margin, and alignment so consecutive sections don't repeat the same rhythm (FR-007). No two adjacent `PlaceSection`s may share the same `layoutVariant`. |

**Validation rules** (enforced by content authoring, not runtime code):
- `bodyParagraph1.length !== bodyParagraph2.length` in a materially different way — the spec's
  supplied copy already satisfies this; do not shorten either paragraph to force parity.
- `keywords.length` is 2 or 3.
- Exactly 4 `PlaceSection` instances, ordered exactly as listed above.
- No two consecutive sections (including Hero→first place and last place→Outro, conceptually)
  use an identical `layoutVariant`.

## Entity: OutroContent

Represents the final CTA/footer section (spec §마지막 CTA).

| Field | Type | Notes |
|---|---|---|
| title | string | "오래 보고 싶은 풍경은 천천히 남습니다" |
| body | string | The CTA's full sentence, not shortened |
| ctaLabel | string | "처음 풍경부터 다시 보기" |
| ctaAction | enum | `scroll-to-hero` — the only defined action; activating the button scrolls/jumps the page back to the Hero section top |
| footerText | string | Simple footer content (e.g. credits pointer, copyright line) |

## Entity: ImageAsset

Represents one downloaded, license-verified photograph used on the page. Also mirrors the
per-file record kept in `CREDITS.md` (FR-015–FR-017, FR-019).

| Field | Type | Notes |
|---|---|---|
| filePath | string | Relative path, e.g. `./assets/images/seoraksan.webp` |
| altText | string | Concrete Korean description of the landscape shown (FR-016) |
| width / height | number | Intrinsic pixel dimensions, set as HTML attributes or CSS `aspect-ratio` to prevent layout shift |
| sizeBytes | number | Must be ≤ ~300–500KB after optimization (FR-019, SC-008) |
| sourcePage | string (URL) | Original detail page URL (Wikimedia Commons / Unsplash / Pexels), recorded in `CREDITS.md` |
| author | string | Photographer or issuing organization, recorded in `CREDITS.md` |
| license | string | License/usage terms, recorded in `CREDITS.md` |
| verifiedDate | date | Date the license/source was checked, recorded in `CREDITS.md` |

**Validation rules**:
- No `ImageAsset` may reference an external URL as its `filePath` (must be a local relative path
  under `assets/images/`) — enforces FR-015's no-hotlink rule.
- Every `ImageAsset` used in the page must have a corresponding row in `CREDITS.md` with all
  fields above populated (SC-006).
- If a place's `ImageAsset` cannot be sourced and verified, that `PlaceSection` MUST NOT render a
  placeholder/solid-color box in its place — implementation is not "done" until a real asset
  exists (FR-017).

## Relationships

```
HeroContent 1 ── 1 ImageAsset
PlaceSection (×4) 1 ── 1 ImageAsset
OutroContent (no image required)
```

No entity references another content entity (each section is independent content); the only
cross-cutting relationship is the fixed rendering order defined at the page level:
`HeroContent → PlaceSection[seoraksan] → PlaceSection[jeju] → PlaceSection[suncheon-bay] →
PlaceSection[boseong-tea-fields] → OutroContent`.

## Runtime timeline config (script.js, not persisted)

To drive the single master GSAP timeline (see `research.md` §2–3), `script.js` holds a small
in-memory array mirroring `PlaceSection.id` order, each entry carrying the DOM selector for its
`.scene` element and its relative timeline-duration weight. This is a rendering/animation
configuration, not a data entity — it has no independent identity, validation, or lifecycle
beyond "matches the DOM order of `PlaceSection`s in `index.html`."
