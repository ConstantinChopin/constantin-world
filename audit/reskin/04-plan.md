# Re-skin audit 04 — Phased execution plan

> **Status 2026-07-24** — D1 answered: world is the *dark register* of the studio
> language. Executed: Phase 0 (dead Asterlogos-era CSS + orphaned pointcloud.js
> removed; warm-whites tokenized as `--bright`), Phase 1 (dark glass contract,
> `--surface`, paper-register re-declarations on `body.essay`, always-dark plate
> scope for `.skill-fig`/`.sample-page`), and the home surface: prose-woven
> index with `.lnk` pill links (ledger shelves folded into prose; `.shelf`/`.row`
> CSS retained but unused), glass viewport shell (46px squircle) with floating
> lead + actions capsules, pixelwave background (dark tones), reveal cascade.
> Verified at desktop/mobile on all five surfaces. Remaining: case/essay/skills
> polish passes (Phase 3 items 1–3), WebGL retint (D4), include extraction (D6).

Phases 0–1 are register-agnostic and can start before D1 is answered. Each phase ends
with the site building clean (`npx @11ty/eleventy --serve`) and a browser-pane check of
every surface at desktop + mobile + reduced-motion + `.embedded`.

> Build hygiene reminder: never `rm -rf _site && eleventy` under a running `--serve`
> preview; curl the served port to confirm what's actually live.

## Phase 0 — Hygiene & de-risking (no visual change)

1. Delete dead code: constellation hero block (`styles.css:766–821`), `src/assets/pointcloud.js`.
2. Tokenize every hardcoded color (full list in 02-surface-map.md): warm-white
   `rgba(247,244,236,…)` ×8 → `var(--ink)` or new `--bright`; `::selection`;
   world:498–501 paper restatements; `rgba(255,255,255,0.0x)` frame lines; `.node-fig`
   fills; `.skill-fig` gradient (comment-linked to the JS palette).
3. Screenshot baseline of all five surfaces (both registers) for before/after diffing.
   **Exit test: pixel-identical rendering.** This phase makes the register swappable at all.

## Phase 1 — Token layer back-port

1. Port studio-added tokens into `:root`: `--surface`, `--mid`, `--detail-max`, the glass
   contract (`--glass-*`), plus scoped `--canvas-pad`/`--content-max`/`--band-gap` where
   their components land.
2. Per D1: either swap the base register to studio's light values (a), or derive
   dark-register values for `--surface` and the glass contract (b) and re-declare the
   light set under `body.essay` as today.
3. Keep world-only tokens: `--reading-text`.
4. Align motion vocabulary: shared `.reveal` (0.95s, blur-8, cubic-bezier(0.22,1,0.36,1),
   `--d` stagger) and `.rise` (0.8s `--ease`) — replace the case study's inline observer
   with one shared script.

## Phase 2 — Component back-port (studio → world, in dependency order)

1. `.label` / row anatomy / shelf heads (typographic discipline pass).
2. `.lnk` pill-materializing link + `.pill` chip + inline `code` chip.
3. Glass capsules: `.viewport-title` breadcrumb, `.viewport-actions` pager,
   `.viewport-back`, "View site" (34px, 999px, glass tokens, no-backdrop-filter fallback).
4. Floating detail viewport: 46px squircle window + 9px inner, fullscreen strip.
5. Media anatomy: `.plate` (+ ring hairline), `.rail-item` (16px squircle, decode fade,
   hover scale), `.shot` figures, `.case-fig .frame`, marginalia fact grid.
6. Lightbox (z-60, scrim, focus-return, Escape-capture so it doesn't close the panel).
7. Motion: plate cascade (65ms stagger), breadcrumb crossfade, split-open pane blur,
   press states. Reduced-motion guard on every one.

## Phase 3 — Surface-by-surface application

Order: **case study → essays → skills → home** (lowest coupling first; home's inline
controller last, when the component kit is proven).

1. **Case study**: block rhythm, eyebrow/display/pull values, frame treatment, duotone
   plate recolor, `.project-bar`.
2. **Essays**: title/standfirst/colophon alignment, prose link + hr parity, marginalia
   restyle + `concept.js` gutter re-test at 210px thresholds.
3. **Skills**: card/code/swatch restyle, `.node-fig` token fills, WebGL retint (D4).
4. **Home**: rows, glass chrome, viewport window, mobile slide-in, prose-woven intro
   (`.lnk`), pixelwave (D3), accent mechanism (D8). Controller class names preserved or
   updated in the same commit; `postMessage` bridge regression-tested (D2).
5. Opportunistic include extraction (D6) as each page's chrome is touched.

## Phase 4 — Verification & ship

1. Full sweep per surface: desktop / 63.999rem mobile / 40rem phone / reduced-motion /
   `.embedded` framed mode / keyboard (Esc, focus-return) / hash routing deep-links.
2. Cross-register sweep (catalogue ↔ paper flip on every shared component).
3. Lighthouse / render check (glass `backdrop-filter` cost on low-end, canvas FPS).
4. OG/meta unchanged; `_redirects` untouched; deploy via existing Cloudflare Pages flow;
   post-deploy curl + spot-check on the live domain.

## Effort shape

Phase 0 is a day-scale cleanup; Phase 1–2 are the core (the studio stylesheet is the
reference implementation — most values transplant verbatim); Phase 3 is page-by-page and
parallelizable; the only genuinely fiddly items are the dark-register glass derivation
(if D1=b), the home controller preservation, and the JS-side WebGL retint.
