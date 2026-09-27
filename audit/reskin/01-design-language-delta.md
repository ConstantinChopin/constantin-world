# Re-skin audit 01 — Design-language delta

**Goal:** re-skin constantin.world to follow the UI and UX paradigms of constantin.studio.
**Source of truth:** `constantin.studio.site/src/styles.css` (2,220 lines).
**Target:** `Frontend/src/styles.css` (~1,655 lines).

## 0. The load-bearing fact

The studio site is a **fork of this site** — its own header comment says it is a light
inversion of constantin.world. Both share:

- The same Eleventy scaffold (`htmlTemplateEngine:false`, one `base.njk`, `_data` driven home).
- The same two families: Newsreader (all prose/headings) + IBM Plex Mono (all notation).
- The same token names: `--paper/--ink/--muted/--faint/--rule/--mark`.
- The same gold accent `rgb(143, 119, 54)` — deliberately identical in both registers.
- The same ease token `--ease: cubic-bezier(0.2, 0, 0, 1)`.
- The same layout measures: `--reading: 39rem`, `--frame: 64rem`, `--index-w: 31rem`,
  `--frame-pad`, `--index-gutter`, `--glyph-gap`, `--glyph-title-drop`.
- The same master–detail split home and the same case block system.

**Consequence:** this project is a *back-port of the studio's evolution*, not a redesign.
The delta is enumerable and small enough to do exhaustively.

## 1. Token delta (world `:root` at styles.css:11–53 vs studio `:root` at styles.css:17–87)

### 1a. Registers (colors)

| Token | world (dark catalogue) | world (`body.essay` paper) | studio (light-only) |
|---|---|---|---|
| `--paper` | `#090d09` | `#f6f2e9` | `#ffffff` |
| `--ink` | `rgba(255,255,255,0.78)` | `rgba(26,22,15,0.92)` | `rgba(17,15,15,0.82)` |
| `--muted` | `rgba(255,255,255,0.64)` | `rgba(26,22,15,0.66)` | `rgba(17,15,15,0.60)` |
| `--faint` | `rgba(255,255,255,0.28)` | `rgba(26,22,15,0.40)` | `rgba(17,15,15,0.38)` |
| `--rule` | `rgba(255,255,255,0.10)` | `rgba(26,22,15,0.14)` | `rgba(17,15,15,0.12)` |
| `--mark` | `rgb(143,119,54)` | (unchanged, by design) | `rgb(143,119,54)` |
| `--surface` | **missing** | **missing** | `rgba(17,15,15,0.05)` |

Note the studio ink base is `17,15,15` (`#110F0F` warm near-black) vs world's paper-register
ink base `26,22,15`. If Decision D1 (see 03-decisions.md) lands on a light flip, adopt the
studio triplet everywhere; if the dark catalogue stays, `--surface` still needs a dark
equivalent (suggest `rgba(255,255,255,0.06)`).

### 1b. Tokens the studio ADDED (all absent from world)

**Glass material contract** (studio styles.css:38–49) — "content is paper, chrome is glass":

```css
--glass-blur: 18px;
--glass-filter: blur(var(--glass-blur)) saturate(1.8) brightness(1.04);
--glass-tint: color-mix(in srgb, #ffffff 46%, color-mix(in srgb, var(--paper) 62%, transparent));
--glass-tint-fallback: color-mix(in srgb, #ffffff 55%, color-mix(in srgb, var(--paper) 90%, transparent));
--glass-edge: inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.35),
              inset 0 0 0 0.5px rgba(255,255,255,0.35), 0 0 0 0.5px rgba(17,15,15,0.1);
--glass-shadow: 0 2px 8px rgba(24,18,12,0.06), 0 10px 28px rgba(24,18,12,0.07);
```

A dark-register variant must be derived if the catalogue stays dark (the `#ffffff` mixes
and white inset rims are light-specific). No-`backdrop-filter` fallback at studio
styles.css:915–922.

**Type-size tokens:** `--mid: 1.22rem`, `--detail-max: 50rem`. (World already has `--text`,
`--display`, `--small`, `--lede`, `--case-title`, `--display-xl`; world additionally has
`--reading-text: 1.1875rem` for essay prose, which the studio dropped — KEEP it, the larger
essay measure is part of world's reading room.)

**Scoped layout vars:** `--canvas-pad` (1.7rem / 1.25rem mobile), `--content-max: 46.5rem`,
`--band-gap: clamp(1.7rem, 3.4vh, 2.6rem)` — these arrive with the detail-panel canvas
components (see 02-surface-map.md §Home).

### 1c. Radii, shadows, z-index (studio uses literals — adopt as-is or tokenize on the way in)

- Panel window 46px + `corner-shape: squircle`; inner window 9px (concentric); rail tiles
  16px squircle; plates 10px; pills/capsules 999px; chips 7px; `.lnk` 6px; inline code 4px;
  case frame `clamp(10px, 1.4vw, 18px)`.
- Case figure frame shadow: `0 26px 64px -32px rgba(43,32,24,0.35)` + 1px ink outline.
- Plate hairline ring: `box-shadow: 0 0 0 0.5px #e8e8e8` (light-specific; needs dark variant).
- Z ladder: background canvas 0 → split 2 → panes 1/2 → sticky bars 3/5 → mobile detail 50 → lightbox 60.

### 1d. Motion values (studio)

- Primary ease `--ease` (shared already).
- Load reveal: `reveal-rise` 0.95s `cubic-bezier(0.22,1,0.36,1)` — opacity + blur(8px) + 12px rise, per-element `--d` delay. World has a simpler `.reveal` (styles.css:104–126); align.
- Scroll reveal `.rise`: 0.8s `--ease`, 16px + blur(6px). World's case study has an inline
  equivalent — unify.
- Split open/close: 0.6s grid-column morph + pane blur crossfade + `index-shift` 3px mid-blur.
- Plate cascade: children stagger at 65ms steps, in 0.5s / out 0.15s; breadcrumb crossfade 0.2s.
- Hovers: `.lnk` pill 0.22s, row underline 0.25s, buttons 0.2s, press scale(0.96) 0.12s.
- Mobile detail slide 0.28s. Image decode fade 0.45s, hover scale(1.04).
- Reduced-motion off-switches on every animation (~15 guards in studio, world already has some).

## 2. Typography delta

Identical families, identical loading (Google Fonts `@import`, `display=swap`). The delta is
in **role discipline**, not fonts:

- Studio codifies the mono "apparatus voice" harder: `.label` mono 0.6875rem/0.1em/uppercase;
  row meta mono 0.65rem/0.08em/tabular; margin eyebrows 0.63rem/0.11em; captions 0.68–0.72rem.
- Italic serif as the "quiet/secondary" signal: shelf heads (0.9375rem italic), standfirst,
  pull quotes, prose h3 — world already does most of this; adopt studio's exact values.
- Display tracking tightens with size: −0.015em (titles) → −0.022em (`--display-xl`).
- `.prose strong` = weight 500 + full `--ink` (lift phrases out of muted prose).

## 3. What the studio has that world lacks (component level — detail in 02-surface-map.md)

1. **Glass chrome capsules** — breadcrumb, pager, back, "View site" (34px, 999px radius).
2. **`.lnk` prose link** — hairline underline that materializes into a `--surface` pill on
   hover with zero glyph movement; `.is-active` holds a per-entry accent color.
3. **Floating detail viewport** — 46px squircle glass window replacing flat pane chrome.
4. **Static canvas-sets** — pre-rendered plate/rail panels per entry, replacing live iframes
   (studio DEV-PLAN Goal 2). See Decision D2 — this is the biggest UX divergence.
5. **Rail tiles + plates + shot figures + marginalia grid** — the whole media-plate anatomy.
6. **Lightbox** (z-60, `rgba(17,15,15,0.88)` scrim, focus-return, Escape via capture).
7. **Pixelwave background** — fixed canvas of drifting greyscale value-noise clouds, 30fps,
   460px left fade protecting the reading column, tab-visibility paused. Decision D3.
8. **Prose-woven navigation** — home nav as inline links inside sentences, no chrome header.
9. **Per-entry accent colors** on active links (Replika `#2b45e0`, Parable `#7a2e56`, …) —
   world would define its own set per shelf entry.

## 4. What world has that the studio lacks (must survive the re-skin)

1. **The register flip** — `body.essay` re-declares the color tokens (world styles.css:480–501).
   The studio is light-only. Whatever D1 decides, the *mechanism* (token re-declaration on a
   body class) is the correct pattern and stays.
2. **`--reading-text` 1.1875rem** essay prose size (studio reads at 1.0625rem).
3. **Marginalia gloss system** (`concept.js` + styles.css:1235–1390) — leader-line margin
   notes. Studio has nothing equivalent. Keep; restyle only.
4. **Live iframe preview + postMessage breadcrumb bridge** (`source:'cw-preview'`) — world's
   entries are *readable pages*, not portfolio plates; see D2.
5. **Skills page live WebGL point cloud** (three.js) + node-fig topology SVG.
6. **Footnote/notes system** (styles.css:692–719) and verse/attr/enum/hierarchy prose blocks.
