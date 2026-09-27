# Re-skin audit 02 — Surface map & coupling risks

Every built surface, what changes on it, and what will break if handled carelessly.
Line refs: `world:` = `Frontend/src/styles.css`, `studio:` = `constantin.studio.site/src/styles.css`.

## Scope fence

| In scope | Out of scope |
|---|---|
| Everything under `Frontend/src/` | `sanctuaire/` (separate Next.js app, deployed at sanctuaire.so) |
| | `cv/` (standalone static HTML, own self-contained design system) |
| | `audit/` (analysis docs for the retired Asterlogos prototype) |
| | `.agents/` (empty scaffolding) |

## Surface 1 — Home `/` (`src/index.njk`, bodyClass `home`)

World already has the master–detail split (`.split`, world:128–330) that the studio mirrored,
so the *structure* stands. The re-skin items:

- **Rows** (world:360–474): adopt studio row anatomy — flush-left ledger, hairline→ink
  underline hover (0.25s), `.row-desc` gloss at 0.9375rem/1.4, mono `.row-meta`
  0.65rem/0.08em/uppercase/tabular, `.is-active` / `.is-static` states (studio:1116–1176).
- **Shelf heads**: serif italic 0.9375rem with glyph dimmed to opacity 0.42 (studio:1086).
- **Detail pane chrome**: replace flat `.viewport-bar` with the glass contract — floating
  capsules (back / breadcrumb / pager / "View site"), pass-through middle
  (`pointer-events:none` bar, `auto` children), 46px squircle window with 9px inner radius
  (studio:244–330, 904–947).
- **Prose-woven intro/nav** with `.lnk` pill-materializing links (studio:1039–1063) if D1/D2
  adopt the studio home voice; per-entry accent colors on `.lnk.is-active`.
- **Preview mechanism**: iframe vs static canvas-sets — **gated on Decision D2**.
- **Background**: pixelwave canvas port — **gated on Decision D3**.
- **Mobile**: below 64rem studio slides a fixed full-page detail in from the right
  (translateX(100%)→none, 0.28s, z-50) (studio:2076–2096); world currently navigates away.
  Adopt.

**Coupling risk (HIGH):** the inline home controller (`index.njk:80–223`) is bound to
`.index a.row`, `.shelf`, `.glyph`, `data-id`, `data-preview`, and body classes
`detail-open` / `viewport-fs` / `is-active`. Keep every one of these names during the
re-skin, or update the controller in the same commit. The `postMessage` bridge
(`source:'cw-preview'`) dies only if D2 kills the iframe.

## Surface 2 — Essays `/writing/formscapes/`, `/writing/narrative-motifs-in-the-iliad/` (bodyClass `essay`)

- The paper reading room already matches the studio's reading register in spirit. Delta:
  align `.essay-title` (−0.015em, 1.15), standfirst italic values, `.prose` link treatment,
  `hr` rubric diamond (both sites already share the 6px rotated gold diamond — verify exact
  match), colophon treatment (studio:1320).
- **Keep** `--reading-text` 1.1875rem / lh 1.7 / 39rem measure — world's essay measure is a
  deliberate upgrade over studio's 1.0625rem.
- **Keep** notes/footnotes (world:692–719), verse/attr/enum/hierarchy blocks.
- **Marginalia** (`concept.js` + world:1235–1390): restyle notes to studio caption voice
  (mono 0.68–0.72rem). **Coupling risk (MEDIUM):** `concept.js` reads
  `getComputedStyle(body).paddingRight` and hardcodes 210/212/64px gutter thresholds
  (concept.js:31–33). Any change to `body.essay` padding or the reading measure must be
  re-tested against gloss placement at narrow/wide widths.
- **Coupling risk (MEDIUM):** paper-register restatements at world:498–501 use literal
  `rgba(26,22,15,…)` — retire these literals during tokenization (Phase 0).

## Surface 3 — Case study `/projects/case-study/` (Vellum, bodyClass `project`)

- World's case block system (world:1392–1556) is the same skeleton the studio refined
  (studio:1407–1567). Back-port: `.eyebrow` gold serif 0.2em uppercase, display tracking
  (−0.022em), `.case-fig .frame` (clamp radius + warm shadow + ink outline), `.case-pull`
  italic clamp scale, `.case-meta .k` values, block rhythm `clamp(3.2rem, 9vh, 7rem)`,
  `.rise` unification (replace the page's inline IntersectionObserver with the shared one).
- **Coupling risk (MEDIUM):** the de-facto un-tokenized "warm white" `rgba(247,244,236,…)`
  is repeated across case type roles (world:820, 1422, 1429, 1437, 1525, 1569, 1648, 1654).
  Tokenize to `var(--ink)`/a new `--bright` before any register change, or a light flip will
  produce white-on-white text. **This is the single most dangerous re-skin trap in the file.**
- Duotone demo plates carry per-instance inline `--duo-d`/`--duo-m` hex values in
  `case-study/index.html` (6 figures) — recolor by hand to the new register.
- `.project-bar` → studio project bar values (46px, glyph + name + return, hairline bottom).

## Surface 4 — Skills `/resources/skills/` (bodyClass `essay` + WebGL)

- Reading-room restyle inherits from Surface 2 automatically (token-driven).
- Skill cards, code blocks, type ladder, swatches (world:1565–1655): restyle to studio
  plate/caption anatomy.
- **Coupling risk (HIGH — colors live in JS):** the point cloud palettes are RGB float
  arrays in `skills/index.html:159` (CORE/MID/ARM) and `assets/pointcloud-scaffold.js`
  (COOL/WARM/HOT + `treat()` sparkle `setHSL(0.55, 0.9, 0.7)` at lines 78–89). CSS tokens
  cannot restyle the galaxy; budget a JS retint pass, and hand-match the `.skill-fig`
  gradient backdrop (world:1625, `#14160f`/`#0a0c07`) to it.
- `.node-fig` topology hardcodes node fills `#d8c489`/`#f2da9f` (world:1635–1636) → change
  to `var(--mark)`-derived values.
- three.js r128 loads from CDN via front-matter `headExtra` — unchanged by the re-skin.

## Surface 5 — Shared shell (`src/_includes/base.njk`, `_data/*`)

- `base.njk` is the only layout; both sites' shells are near-identical. Delta: add the
  pixelwave canvas + script hook (if D3), keep `.embedded` iframe detection (studio has the
  same at base.njk:22), keep `colorScheme` front-matter gating (`dark` default; studio is
  hardcoded light).
- Header/nav/footer are **hand-authored per page** (no shared include) on both sites — an
  inherited weakness. Optional centralization: Decision D6.
- `_data/library.json` may need per-entry fields the studio's `studio.json` carries
  (accent color; `rail`/`railReady` only if D2 adopts static panels).
- Inline SVG (monogram, glyphs, chrome icons) is `currentColor`-driven — recolors free.

## Dead code to remove (Phase 0, zero risk)

| Item | Where | Why dead |
|---|---|---|
| Asterlogos constellation hero | world:766–821 (`.hero`, `.constellation`, `.plate*`) | No page uses it; Asterlogos moved to asterlogos.com (see `src/_redirects`) |
| `pointcloud.js` | `src/assets/pointcloud.js` (passthrough-copied) | References `.vol-diagram`, a selector that no longer exists; no page imports it |

## Un-tokenized colors — full fix list (Phase 0)

1. `rgba(247,244,236,…)` warm-white case/resources type roles — 8 sites (see Surface 3).
2. `::selection` gold hardcoded at world:81 → studio value `rgba(143,119,54,0.24)` via token or literal parity.
3. Paper-register restatements world:498–501 → derive from tokens.
4. `rgba(255,255,255,0.0x)` frame outlines/backgrounds in CASE/RESOURCES → `var(--rule)` or a new `--frame-line`.
5. `.node-fig` node fills world:1635–1636 → `var(--mark)` family.
6. `.skill-fig` gradient world:1625 → tokens or explicit "matched-to-JS" comment.
7. Duotone `--duo-d`/`--duo-m` inline hexes in `case-study/index.html` → re-derive per register.
