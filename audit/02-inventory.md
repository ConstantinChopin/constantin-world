# 02 · Interface inventory

*Scored against `01`. Every finding cites file + selector/line. Files in scope: the reading prototype (`surface`, `odyssey-sculptural`, `iliad-sculptural`, `field`) and the marketing set (`manifesto`, `pitch`, `threepager`, `wireframe`). The shared system is `_shared/asterlogos.css`; the styleguide is its showcase.*

---

## 1. Component census

Legend: **✔ atom** = uses the system atom as intended · **↺ legacy** = uses a still-defined legacy alias (`.mono-btn`/`.btn-ink`) · **✖ orphan** = bespoke reimplementation of something the system already provides · **＋ novel** = a genuinely new component with no system home.

### Buttons & controls

| Component | Where | Classes / selector | Verdict | States (● present ○ missing) |
|---|---|---|---|---|
| Canonical control | `asterlogos.css:86–104` | `.btn` + `--sheet/--ink/--line/--soft/--square` | **the standard** | ●hover ●active ●focus(global) ○disabled (no `.btn:disabled` skin) |
| Back-to-shelf | `surface:298` | `.btn.btn--sheet` | ✔ atom | ●hover ●active |
| Perception button | `surface:314` | `.btn.btn--sheet` | ✔ atom | ●hover ●active |
| Trace toggle | `surface:342` | `.btn.btn--sheet.btn--square` | ✔ atom | ●hover ●active |
| Plate back (instrument) | `odyssey:223`, `iliad:204` | `.btn.btn--sheet` | ✔ atom | ●hover ●active |
| **Write button** (`+`) | `surface:115–119` | `#newNote` (inline) | ✖ orphan | ●hover ●active — **reimplements `.btn--ink.btn--square` by hand** (36px inverted square, `#000` hover, letterpress) instead of using the atom the styleguide demos at `styleguide:189`. |
| **Context chip** | `surface:233–238` | `#ctxChip` (inline) | ✖ orphan | ●hover ●active ○focus — reimplements `.chip` (`asterlogos.css:151`) with `border-radius:2px` and its own hover. Also duplicated as `.ctxDemo` in `styleguide:97`. |
| **Ctx menu items** | `surface:242–244` | `#ctxMenu button` | ✖ orphan | ●hover ○active ○focus — a bespoke popover-list button that recurs (see `#ctxMenu` pattern) with no system home. |
| **Slide-nav arrows** | `surface:145–149` | `.lvNav button` | ✖ orphan | ●hover ●disabled ○active — 28px, `border-radius:2px`. Not `--control-h`, not a `.btn`. |
| **Quote mark toggle** | `surface:210–216` | `#qMark` | ✖ orphan | ●hover ●active — bespoke toggle, `border-radius:2px`. |
| **Notes stack button** | `surface:155–170` | `#leavesBtn .slip/.face` | ＋ novel (justified) | ●hover ●active — the stacked-paper "your notes" affordance; genuinely bespoke and worth keeping as a named organism. |
| Quote-offer button | `surface:367` | `.mono-btn.soft` | ↺ legacy | ●hover |
| Sow place / cancel | `surface:376–377` | `.mono-btn`, `.mono-btn.soft` | ↺ legacy | ●hover |
| Write-head Save | `surface:810, 909` | `.btn-ink` (JS) | ↺ legacy | ●hover |
| Leaf "Place" | `surface:831`; `odyssey:827`; `iliad:1021` | `.mono-btn` (JS) | ↺ legacy | ●hover |
| Editor Save | `odyssey:883`; `iliad:1077` | `.btn-ink` (JS) | ↺ legacy | ●hover |
| **Compare / Back** (instrument) | `odyssey:54–60`, `iliad:54–60` | `#compareBtn`, `#backBtn` | ✖ orphan | ●hover ○active ○focus — hand-rolled buttons; `#backBtn` literally reproduces `.btn--soft` (`asterlogos.css:101`) by hand, `#compareBtn` reproduces `.btn--line`. `border-radius:2px`, `padding:8px 14px`, no `--control-h`. |
| **Plate prev/next** | `odyssey:134`, `iliad:126` | `#pgNav button` | ✖ orphan | ●hover ●disabled ○active — twin of `surface .lvNav button`; 28px, `2px`. Two files invent the *same* small-nav button separately. |
| **Plate write** (`+`) | `odyssey:148–153`, `iliad:143` | `#plateNote` | ✖ orphan | ●hover ●active — twin of `surface #newNote`; reimplements `.btn--ink.btn--square` a *third* time. |
| Idea-panel close | `field:55–57` | `#ideaClose` | ✖ orphan | ●hover — bespoke 28px close; the system has `.icon-act` (`asterlogos.css:126`) for exactly this. |
| Marketing CTA | `pitch:49–55` | `.btn`/`.btn-ink`/`.btn-soft` (local) | ✖ orphan | ●hover — **redefines `.btn` locally** with `padding:10px 16px`, `border-radius:2px`; collides in name with the system atom but is a different thing. |
| Marketing buttons | `threepager:138–149` | `.mono-btn`, `.btn-ink` (local redef) | ↺ legacy (re-declared) | ●hover — copies the legacy atoms into the page instead of linking the system. |
| Greybox buttons | `wireframe:12–14` | bare `button`, `button.on` | ＋ novel (intentional lo-fi) | ●on — deliberately un-systemed wireframe; mark as intentional exception. |

### Icon acts, segmented, text acts, chips
| Component | Where | Verdict |
|---|---|---|
| `.icon-act` (mode toggles, close ✕) | defined `asterlogos.css:126`; used `surface:862,871`, instrument heads | ✔ atom — used well and consistently. `border-radius:2px` (see radius note). |
| `.seg` Perception switch | `asterlogos.css:142`; `surface:307` | ✔ atom |
| `.act` text verbs (edit/discard/plate) | `asterlogos.css:135`; `surface:835,840,844,878` | ✔ atom — the most consistently-used interactive atom in the system. |
| `.chip` (trace/kindred) | `asterlogos.css:151` | ✔ atom — but see `#ctxChip` orphan that should be it. |

### Panels, heads, list items, inputs, overlays
| Component | Where | Verdict / note |
|---|---|---|
| `.panel-head` (label · acts · ✕) | `asterlogos.css:180`; used `surface:327, 1013`; instrument `#pgEyebrow` | ✔ atom — the canonical masthead, reused for notes/write/trace/plate. Strong. |
| `.leaf` note card | `asterlogos.css:192`; `surface:817` | ✔ atom |
| `.lvEdit` in-panel editor | `asterlogos.css:224`; `surface:887` | ✔ atom — **but** the instruments ignore it: `#noteBox` (`odyssey:62`, `iliad:62`) is a bespoke textarea doing the same job. |
| Notes column (right panel) | `surface #leavesPanel:126`, `#notesHead:123` | ＋ organism — see `03`. |
| Write column | `surface #writeCol:199` | ＋ organism — shares `#notesHead`; good reuse. |
| Trace popover | `surface #tracePanel:180` | ✔ composed (`.sheet` + `.panel-head`) |
| Plate (full-page reading overlay) | `odyssey #plate:93`, `iliad:83` | ＋ organism (twinned) — see `03` + §2. |
| Locator card | `odyssey/iliad #legend:39` | ✖ orphan — a card that should be `.sheet`; instead hand-rolls shadow/padding + a 4th shadow value. |
| Cartouche card | `odyssey/iliad #cartouche:178/167` | ✖ orphan — should be `.sheet-sm`. |
| Error toast | `#err` in `odyssey:90`, `iliad:80`, `field:71`, `manifesto:75` | ✖ orphan × off-palette — bespoke crimson panel, four copies. |
| Idea panel | `field #ideaPanel:50` | ＋ novel |
| Field legend/key | `field #keying:38` | ＋ novel |

---

## 2. Duplication map

For each group: the **canonical** instance to keep, and the orphans to merge into it.

**D1 · The inverted-square "write" button — 3 hand-built copies.**
`surface #newNote` (`115–119`), `odyssey #plateNote` (`148–153`), `iliad #plateNote` (`143`) each rebuild a 36px ink square with `#000` hover and letterpress by hand.
→ **Canonical:** `.btn.btn--ink.btn--square` (`asterlogos.css:97,103`), exactly as the styleguide already demos (`styleguide:189`). Merge all three; delete the inline CSS. *Chosen because the atom exists, is demoed, and gives free `:active`/focus.*

**D2 · The small nav arrow (‹ ›) — 3 copies, two selectors.**
`surface .lvNav button` (`145–149`), `odyssey #pgNav button` (`134`), `iliad #pgNav button` (`126`) — all 28px, `border-radius:2px`, hairline-inks-on-hover, `:disabled` at low opacity.
→ **Canonical:** promote to one atom `.btn--quiet-sm` (or `.stepper`) in the shared file, or reuse `.icon-act` sized down. *Chosen: they're identical in intent; three files should not each define it. Violates P4/P10.*

**D3 · The context chip — surface vs styleguide.**
`surface #ctxChip` (`233–238`) and `styleguide .ctxDemo` (`97`) both reimplement a hairline chip with a leading glyph.
→ **Canonical:** `.chip` (`asterlogos.css:151`). Add a `.chip--ctx` modifier if the leading-glyph + uppercase-label variant is needed. *Chosen: `.chip` is the atom; two reimplementations is exactly the drift P10 forbids.*

**D4 · The legacy button aliases — `.mono-btn` / `.btn-ink` (10 live call-sites).**
`surface:367,376,377,810,831,909`; `odyssey:827,883`; `iliad:1021,1077`. These are old markup pointing at aliases the system still keeps alive at `asterlogos.css:107–122`.
→ **Canonical:** `.btn.btn--line` / `.btn.btn--soft` / `.btn.btn--ink`. Migrate the 10 sites, then delete the aliases from the shared file. *Chosen: the aliases are documented as "legacy" in the file itself (`asterlogos.css:106`); they exist only to be retired.*

**D5 · The two book instruments are the same file. — the largest duplication in the project.**
`odyssey-sculptural/index.html` (1389 lines) and `iliad-sculptural/index.html` (1574 lines) are a copy-paste pair: `#legend`, `#compareBtn/#backBtn`, `#noteBox`, `#plate…`, the `@media(max-width:680px)` block, the `#err` panel and the `#plateNote:hover{background:#000}` are byte-identical; only the topology data, a title card, and one legend diverge. The divergences are themselves drift (`iliad` titlecard `22px`/`8px` vs `odyssey` tokenised — see §3).
→ **Canonical:** extract a shared instrument shell (`_shared/instrument.css` + a JS module) that both books configure with data. *Chosen: two files re-declaring the same orphan buttons/cards guarantees they drift — and they already have.*

**D6 · Bespoke card surfaces vs `.sheet`.**
`#legend` and `#cartouche` (both instruments) roll their own border+shadow+radius.
→ **Canonical:** `.sheet` / `.sheet-sm` (`asterlogos.css:72–73`). *Chosen: identical intent, and it removes the stray `0.14` shadow.*

**D7 · The `#err` toast — 4 off-palette copies.**
`odyssey:90`, `iliad:80`, `field:71`, `manifesto:75`, all `#7a2318` crimson.
→ **Canonical:** one shared `.toast` rendered in `--ink` on `--paper` (P1), or a single documented `--alert` token if a warning colour is genuinely wanted. *Chosen: four copies of an off-palette colour is the clearest P1 breach in the codebase.*

**D8 · Marketing pages re-declare tokens/atoms locally.**
`pitch`, `threepager`, `wireframe` do **not** link `asterlogos.css`; they redeclare `:root` tokens and buttons in-page (`pitch:14–55`, `threepager:16–149`). `manifesto` and `field` *do* link it.
→ **Canonical:** link the shared file; keep only layout-local CSS. `wireframe` may stay unsystemed as an intentional greybox (mark it). *Chosen: P10 — and local token copies are already drifting (`pitch` radius `2px`).*

---

## 3. Hardcoded-value audit (systematization baseline)

Counts are raw hex/`rgba` colours + raw `px` font-sizes + raw `px` radii that appear **outside** `:root` token definitions and outside `var()`. Grep-verified where marked ✓.

| File | Links system? | Raw hex ✓ | `rgba()` ✓ | radius `2px` ✓ | radius `3px`/`var` ✓ | Off-scale font-px | Verdict |
|---|---|---|---|---|---|---|---|
| `_shared/asterlogos.css` | — (is the system) | 11 | 3 | **4** (`.mono-btn`, `.btn-ink`, `.icon-act`, `.seg`) | 4 | 0 | **Internally inconsistent on radius** — the system itself mixes 2px and 3px. Fix here first. |
| `surface/index.html` | ✔ | 1 | 2 | 4 | 5 | ~2 | Cleanest page; drift is radius + 6 legacy call-sites. |
| `odyssey-sculptural` | ✔ | 6 | 14 | 4 | 3 | ~6 | Orphan buttons/cards + `#err` red. |
| `iliad-sculptural` | ✔ | 7 | 12 | 4 | 3 | **~8** | Worst offender: twin of odyssey **plus** de-tokenised titlecard/hints (`8px`,`8.5px`,`9.5px`,`22px`,`12px`). |
| `field/index.html` | ✔ | 3 | 6 | 3 | 1 | few | `#ideaClose` orphan, `#err` red, raw `#c2bcae`/`#e7e4db`. |
| `manifesto` | ✔ | ~2 | 4 | 0 | — | 0 | Clean (canvas piece); only `#err` red + a paper-rgba. |
| `pitch` | ✖ local | ~10 (mostly SVG) | — | yes | — | some | Local `.btn` redef at `2px`; raw `--gild` in SVG. |
| `threepager` | ✖ local | ~8 (mostly SVG) | — | 0 (uses 3px) | yes | — | Redeclares legacy aliases locally. |
| `wireframe` | ✖ (intentional) | 20+ | — | — | — | — | Greybox — **intentional exception**, do not systematize. |

**Headline numbers.** In the reading prototype (the four in-scope surfaces), the shared file plus pages carry **12 distinct `border-radius:2px` sites** that should be `var(--control-r)`, **~16 off-scale font-px** concentrated almost entirely in the two instruments, and **the single off-palette colour `#7a2318` in 4 files**. The colour palette and type *roles* are otherwise honoured — meaning the systematization work is narrow and mechanical, not a rebuild.

---

## 4. Button-specific verdict

**Which `01` principles the current buttons violate:**

- **P4 (one control height, variants change skin not geometry)** — broken by every orphan button: `#newNote`/`#plateNote` rebuild the square, `#compareBtn`/`#backBtn` set `padding:8px 14px` and omit `--control-h`, `.lvNav`/`#pgNav` are 28px. Same *look*, re-authored geometry.
- **P10 (pages lay out, don't restyle)** — broken by all ✖-orphan rows in §1 and by `pitch`/`threepager` redeclaring atoms.
- **`--control-r` consistency (Token set)** — broken pervasively: buttons render at `2px` in pages while `.btn` renders at `3px`, so on the same screen a `.btn--sheet` and a `#ctxChip` have visibly different corners.
- **P5 (hairline inks in on hover)** — *honoured* almost everywhere, even by the orphans; this is why the buttons still "feel Asterlogos" despite the drift. The problem is geometry and provenance, not the hover language.
- **Legacy debt** — 10 call-sites still on `.mono-btn`/`.btn-ink` (D4), and `.btn--ink` has **no `:disabled` skin** (`sowPlace` fakes disabled with inline `opacity`/`pointer-events`, `surface:1058`).

**The user's instinct — "buttons feel off relative to the e-reader feel" — is correct and locatable:** it is the **radius mismatch (2px vs 3px) reading as slightly sharper/cheaper corners**, plus three differently-built "square" buttons that don't share the atom's press physics.

### Canonical button spec (adopt verbatim)

```
.btn — the one control
  height:        var(--control-h)   /* 36px, never overridden */
  padding:       0 14px             /* 0 for --square */
  border-radius: var(--control-r)   /* 3px — the fix */
  font:          var(--text-label)  /* 400 10px mono */, letter-spacing:.16em, UPPERCASE
  gap:           8px
  transition:    background/color/border/box-shadow .18s var(--ease), transform .12s var(--ease)
  :active        transform:scale(0.96)
  :focus-visible 1px solid var(--ink), offset 2px   (global)
  :disabled      opacity:.4; pointer-events:none    ← ADD to the atom (P4/D4)
```

**Two variants only (plus the square modifier):**

| Variant | Use | Skin |
|---|---|---|
| **`.btn--ink`** (primary / commit) | "Set it down", the write `+` | `background:var(--ink)`; `:hover background:var(--ink-deep /*#000*/)`; letterpress on the square form. |
| **`.btn--sheet`** (quiet / default chrome) | back-to-shelf, perception, trace, compare, place, cancel | `background:var(--paper)`; `border:1px solid var(--ink)`; `--shadow-sm`; `:hover` inverts to ink. |
| `+ .btn--square` (modifier) | icon-only 36px acts (`+`, trace) | `width:var(--control-h); padding:0`. |

Retire `.btn--line` and `.btn--soft` into `.btn--sheet` (they differ only by border weight, which the hover already resolves) **or** keep `.btn--soft` if a truly secondary inline commit is needed — but pick ≤2 named skins and delete the rest. Migrate the 10 legacy call-sites (D4) and the orphan buttons (D1, D2, `#compareBtn`/`#backBtn`, `#ideaClose`) onto this spec.

*See `census.html` for a side-by-side render of the canonical spec against every orphan, so the drift is visible at a glance.*
