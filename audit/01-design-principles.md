# 01 · The Asterlogos design language, reverse-engineered

*Read-only audit. Source of truth for the aesthetic is the reading surface — `_shared/asterlogos.css`, the styleguide, and the notes/write column in `surface/index.html`. Where the interface contradicts itself, the reading surface wins.*

The good news first: this project already ships a genuine design system — `asterlogos/prototypes/_shared/asterlogos.css` (236 lines) — with tokens, atoms, molecules, and a self-documenting styleguide at `asterlogos/prototypes/styleguide/index.html`. It is thoughtful and mostly coherent. The audit is therefore **not** "invent a language"; it is "the language exists and is good — measure where the pages have drifted off it." The principles below are the rubric. Everything in `02`–`04` is scored against them.

---

## The principles (as implemented in the strongest parts)

### P1 — One paper, one ink. Colour is forbidden except as a single ceremonial gild.
The whole surface is built from eight warm-grey values and nothing else. Paper `--paper:#e7e4db`, three ink weights `--ink:#1b1916` / `--ink-soft:#39352e` / `--ink-mid:#5c564c`, a ghost `--ghost:#9a958a`, a hairline `--rule:#c2bcae`. Exactly one hue is admitted — `--gild:#9a8038` — and the system's own comment fences it: *"USE ONLY FOR: the voyage/route line and 'live' catalogue marks. Never for text, controls, or decoration."*
*Derived from:* `asterlogos.css:17–27`; enforced background `body{background:var(--paper)}` in `surface:34`, `styleguide:25`.

### P2 — Hierarchy is carried by type and weight, never by boxes or bars.
Three families, seven roles, one scale, weights floor at 300. The serif (`Newsreader`) carries reading; the display serif (`Cormorant Garamond`, always italic for the wordmark and titles) carries identity; the mono (`JetBrains Mono`, uppercase, wide tracking) carries *only* labels and metadata. There is no bold sans, no coloured heading, no filled title bar. Emphasis is a weight change and italics, not a background.
*Derived from:* `--text-display … --text-meta`, `asterlogos.css:42–48`; `.masthead-word{font:var(--text-title);font-style:italic}` `asterlogos.css:173`; type specimens `styleguide:125–152`.

### P3 — Elevation is a hard letterpress offset, never a blur.
Every shadow in the system is a solid, un-blurred, down-right ink offset — paper physically lifted off paper. `--shadow-sm:3px 4px 0 rgba(27,25,22,0.12)`, `--shadow:5px 6px 0 rgba(27,25,22,0.13)`, `--lift:6px 8px 0 rgba(27,25,22,0.16)`. The comment is explicit: *"hard letterpress offsets, never blur."* There is not a single `blur()` in any core file (grep-confirmed: 0). This is the strongest, most distinctive signature of the whole aesthetic.
*Derived from:* `asterlogos.css:29–32`; elevation specimens `styleguide:159–165`. **Contrast:** the embedded cosmic-mill experience (`src/projects/asterlogos/experience/`) is a *different* dark-glass aesthetic with `backdrop-filter:blur(3px)` — deliberately not this system, and out of scope.

### P4 — One control height. Every button in the chrome is exactly 36px, and variants change skin, never geometry.
`--control-h:36px` is declared canonical — *"the Perception control is the canon all buttons follow."* `.btn` is one atom (36px tall, `gap:8px`, uppercase mono label at `.16em`) with five skins: `--sheet` (paper slab + letterpress), `--ink` (the committing act), `--line`, `--soft`, `--square`. The press feedback is uniform: `:active{transform:scale(0.96)}`.
*Derived from:* `--control-h` `asterlogos.css:63`; `.btn` + variants `asterlogos.css:86–104`; `styleguide:180–200`.

### P5 — Affordance is signalled by a hairline that inks in on hover, not by fill.
At rest, most controls are bare or hairline-ruled on paper. Interaction is a hairline gaining ink: `.chip:hover{border-color:var(--ink)}`, `.leaf.is-note:hover{border-left-color:var(--ink)}`, `.icon-act:hover{color:var(--ink)}`, `.btn--sheet:hover{background:var(--ink);color:var(--paper)}` (the emphatic inversion). Quiet things declare themselves quiet: `--ghost` is reserved for placeholders and disabled states only.
*Derived from:* `.chip:hover` `asterlogos.css:155`; `.leaf.is-note:hover` `asterlogos.css:195`; `.icon-act:hover` `asterlogos.css:130`; ghost policy `asterlogos.css:37–38`.

### P6 — The four corners have fixed jobs; the centre is reading, always.
The chrome is anchored to four corners around a single shared margin (`--edge-x:30px`, `--edge-top:26px`, `--edge-bottom:28px`): TL identity/breadcrumb, TR perception, BL the trace, BR what you make. The middle is never chrome. Panels retreat to the corners and the reading surface is never permanently occluded.
*Derived from:* corner layout comment `surface:20–31`; `#masthead`/`#libPerc`/`#trace`/`#makeWrap` pinned to the four corners `surface:46,53,178,113`; `--edge-*` `asterlogos.css:57–60`.

### P7 — Texture is a whisper: paper tooth, a faint vignette, no gradients-as-decoration.
Depth comes from a 3px radial-dot "tooth" at 34% opacity and an inset vignette — barely-there paper grain, not visual noise. `#tooth{…opacity:.34;background-image:radial-gradient(var(--rule) 0.5px,transparent 0.5px)}`, `#vig{box-shadow:inset 0 0 130px rgba(70,64,54,0.14)}`. Selection is a 12%-ink wash, never a system blue.
*Derived from:* `surface:40–42`, `styleguide:27–28`; `::selection{background:rgba(27,25,22,0.12)}` `surface:38`.

### P8 — Motion is calm and physical: one ease for chrome, one spring for the tactile.
Two curves do all the work. `--ease:cubic-bezier(0.2,0,0,1)` for openings and fades; `--spring:cubic-bezier(0.34,1.3,0.5,1)` for things that should feel handled (cards lifting, slips flying to the stack). Durations sit in the 0.12–0.6s band and reduced-motion is honoured globally.
*Derived from:* `asterlogos.css:53–55`; `.bk{transition:transform .28s var(--spring)}` `surface:93`; `@media (prefers-reduced-motion:reduce)` `surface:282`.

### P9 — Accessibility has a declared floor, and meaning never rides on ghost-grey.
The system states its own contrast contract: labels ≥10px, metadata ≥9px, and meaningful text uses `--ink-mid` (5.7:1 on paper — passes AA). `--ghost` (2.35:1) is *decorative only*. A single ink focus ring is defined once, globally: `:focus-visible{outline:1px solid var(--ink);outline-offset:2px}`.
*Derived from:* accessibility note `asterlogos.css:34–38`, `styleguide:153–155`; focus ring `asterlogos.css:235`.

### P10 — Pages lay out; they do not restyle. Atoms live in one file.
The system's constitutional rule, stated in its own header: *"Every prototype links this file; page CSS may only lay things out, never restyle an atom."* The strongest pages (styleguide, and the layout-only sections of surface) obey it — their `<style>` blocks position system atoms and add nothing new. **This is the single principle most often violated in practice, and most of `02`–`04` is about restoring it.**
*Derived from:* `asterlogos.css:2–4`; obeyed exemplar `styleguide:20–22` (*"this file only lays the specimens out"*).

---

## Proposed canonical token set (extracted from real values)

These are the values already in the code, deduplicated. Where near-duplicates exist, the **Canonical** column is the value to keep and the **Merge** column lists the strays found in the wild (full citations in `02`).

### Colour — ink & paper
| Token | Canonical | Merge these strays into it |
|---|---|---|
| `--paper` | `#e7e4db` | raw `#e7e4db` in `#err` panels (`odyssey:90`, `iliad:80`, `field:71`, `manifesto:75`), `rgba(231,228,219,·)` (`manifesto:63`) |
| `--paper-deep` | `#ded9cd` | — (used correctly) |
| `--paper-hi` | `#efece4` | — |
| `--ink` | `#1b1916` | raw `#1b1916` in SVG fills, `0x1b1916`/`color:0x39352e` in Three.js material colours (`iliad:~1219`, JS) |
| `--ink-soft` | `#39352e` | `rgba(57,53,46,·)` (`iliad .cap:35`, `field:31`) |
| `--ink-mid` | `#5c564c` | — |
| `--ghost` | `#9a958a` | `rgba(154,149,138,·)` (`field:35`) |
| `--rule` | `#c2bcae` | raw `#c2bcae` (`field:40`) |
| `--gild` | `#9a8038` | raw `#9a8038` in SVG strokes (`pitch:63,~260`, `threepager:~260`) |
| **`--ink-deep` (NEW)** | `#000` | the hover-deepest ink used by `.btn--ink:hover`, `#newNote:hover`, `#plateNote:hover` — currently a raw `#000` in ≥4 places. Tokenise it so the "deepest press" is one value. |
| **`--warm-shadow` (NEW, optional)** | `rgba(70,64,54,0.14)` | the vignette/plate-cluster tint (`surface #vig:42`, `field:26`, `manifesto:45`) — a warm brown that is *not* ink; give it a name or route it through `--ink` at opacity. |
| ~~error red~~ | **delete `#7a2318`** | Off-palette crimson in `#err` panels across 4 files. It violates P1. Either make it a real, documented `--alert` token or render errors in `--ink` on `--paper` like everything else (recommended). |

### Type scale (keep the seven roles; kill the fractional one-offs)
| Role | Canonical | Off-scale strays to fold in |
|---|---|---|
| `--text-display` | `500 30px/1.05` | inline `500 30px` legend titles |
| `--text-title` | `500 21px/1.1` | `22px` titlecard (`iliad:74`) → 21px |
| `--text-reading` | `300 18px/1.72` | — |
| `--text-body` | `300 16px/1.6` | — |
| `--text-caption` | `300 13px/1.5` | `12px` caption (`iliad .cap:35`) → 13px |
| `--text-label` | `400 10px mono` | `9.5px` hints (`iliad:71,50`) → 10px |
| `--text-meta` | `400 9px mono` | `8.5px`/`8px`/`7.5px` labels (`iliad:51,75,101,168`) → 9px (these currently break the system's *own* ≥9px floor, P9) |

### Geometry, elevation, motion
| Token | Canonical | Note |
|---|---|---|
| `--control-h` | `36px` | one height; bespoke `28px` nav buttons should become `--control-h` or a documented `--control-h-sm` |
| `--control-r` | **`3px`** | **The biggest inconsistency.** `.btn` uses `3px`; but `.icon-act`, `.seg`, `.mono-btn`, `.btn-ink` inside the *same shared file* use `2px` (`asterlogos.css:108,117,126,143,146`), and pages hardcode `2px` for chips/menus/nav (`surface:145,211,233,242`; `odyssey/iliad:55,62,126`). Pick **3px**, replace every `2px` and every bare `border-radius` with `var(--control-r)`. |
| `--edge-x / -top / -bottom` | `30 / 26 / 28px` | used well; keep |
| `--shadow-sm` | `3px 4px 0 rgba(27,25,22,0.12)` | — |
| `--shadow` | `5px 6px 0 rgba(27,25,22,0.13)` | fold in the stray `5px 6px 0 rgba(…,0.14)` used by `#legend` (`odyssey/iliad:44`) — it's a 4th shadow that shouldn't exist |
| `--lift` | `6px 8px 0 rgba(27,25,22,0.16)` | — |
| `--ease` | `cubic-bezier(0.2,0,0,1)` | — |
| `--spring` | `cubic-bezier(0.34,1.3,0.5,1)` | fold in the inline copy in `pulseLeaves()` (`surface:783`) |

**Systematization baseline:** the palette and type intent are tight; the drift is concentrated in **(a) radius `2px`↔`3px`**, **(b) the `#7a2318` error red**, **(c) fractional font sizes in the two instrument legends**, and **(d) inline re-typing of values that tokens already name**. All four are mechanical to fix. Counts per file are in `02`.
