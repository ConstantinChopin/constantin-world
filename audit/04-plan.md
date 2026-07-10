# 04 · Consolidation plan

*Sequenced by leverage: fix the token layer first (it silently corrects the most sites), then the canonical button, then merge orphans, then rework the panel. Effort: **S** ≈ <1h · **M** ≈ half-day · **L** ≈ 1–2 days. Every item cites the finding in `01`/`02`/`03` that motivates it. Target system stays small — ~12 canonical components, ≤2 variants each.*

Do the work **in `_shared/asterlogos.css` first** wherever possible: because pages link it, one edit there fixes every consumer at once. Only touch page files for markup swaps and to delete now-dead local CSS.

---

## Stage 0 — Token corrections (do first; highest leverage, lowest risk)

| # | Change | Files / selectors | Effort | Motivated by |
|---|---|---|---|---|
| 0.1 | **Unify radius on `--control-r:3px`.** Replace `border-radius:2px` with `var(--control-r)` in the shared atoms, then in pages. | `asterlogos.css:108,117,126,143,146`; `surface:145,211,233,242`; `odyssey/iliad:55,62,126` | S | `01` token set; `02 §3` (12 sites); "buttons feel off" verdict `02 §4` |
| 0.2 | **Add `--ink-deep:#000`** and point every "deepest press" at it. | `asterlogos.css:98` (`.btn--ink:hover`); `surface:118`; `odyssey:153`/`iliad:143` | S | `01` token set (raw `#000` in ≥4 places) |
| 0.3 | **Kill the 4th shadow.** Replace `5px 6px 0 rgba(27,25,22,0.14)` with `var(--shadow)`. | `odyssey:44`, `iliad:44` (folds into 0.5/`#legend`) | S | `01` elevation (P3); `02 D6` |
| 0.4 | **Decide the error colour.** Either delete `#7a2318` and render errors as `--ink` on `--paper`, or add one documented `--alert` token. Recommended: on-palette. | `odyssey:90`, `iliad:80`, `field:71`, `manifesto:75` | S | P1; `02 D7` |
| 0.5 | **Re-tokenise the instrument type.** Swap fractional/off-scale font sizes for `--text-*` roles (esp. the iliad titlecard/hints that break the system's own ≥9px floor). | `iliad:35,50,51,74,75,101,168`; matching odyssey inline sizes | S–M | P2, P9; `01` type scale; `02 §3` |

*After Stage 0, re-run the hardcoded-value grep from `02 §3` as a regression check — raw-radius sites should drop to ~0 and the palette to 8 greys + gild.*

---

## Stage 1 — The canonical button

| # | Change | Files / selectors | Effort | Motivated by |
|---|---|---|---|---|
| 1.1 | **Add `:disabled` skin to `.btn`** (`opacity:.4; pointer-events:none`). Removes the need for inline fake-disable. | `asterlogos.css` (`.btn`); replaces inline logic at `surface:1058` | S | `02 §4` (P4 gap) |
| 1.2 | **Collapse to ≤2 skins + square.** Keep `.btn--ink` (commit) and `.btn--sheet` (quiet); fold `.btn--line`/`.btn--soft` into `.btn--sheet` unless a genuine secondary-inline commit is needed (then keep `.btn--soft` only). | `asterlogos.css:99–102` | S | `01` P4; `02 §4` spec |
| 1.3 | **Migrate the 10 legacy call-sites** off `.mono-btn`/`.btn-ink` to `.btn--*`, then **delete the aliases**. | `surface:367,376,377,810,831,909`; `odyssey:827,883`; `iliad:1021,1077`; delete `asterlogos.css:107–122` | M | `02 D4` |
| 1.4 | **Replace the three hand-built square buttons** with `.btn.btn--ink.btn--square`; delete their inline CSS. | `surface #newNote:115–119`; `odyssey #plateNote:148–153`; `iliad #plateNote:143` | M | `02 D1`; P4/P10 |
| 1.5 | **Replace `#compareBtn`/`#backBtn`** with `.btn.btn--line`/`.btn.btn--sheet`; delete their CSS. | `odyssey:54–60`, `iliad:54–60` | S (twice, or once after Stage 3.1) | `02 §1`; P10 |
| 1.6 | **Replace `#ideaClose`** with `.icon-act`. | `field:55–57` | S | `02 §1`; P10 |

---

## Stage 2 — Component merges (retire orphans into atoms)

| # | Change | Files / selectors | Effort | Motivated by |
|---|---|---|---|---|
| 2.1 | **`#ctxChip` → `.chip`** (add a `.chip--ctx` modifier for the leading glyph if needed); drop `.ctxDemo` from the styleguide too. | `surface:233–238`; `styleguide:97` | S | `02 D3`; P10 |
| 2.2 | **One small stepper atom.** Promote the 28px ‹ › button to a single shared `.stepper` (or a sized-down `.icon-act`); replace all three copies. | new atom in `asterlogos.css`; `surface .lvNav:145`; `odyssey/iliad #pgNav:134/126` | M | `02 D2`; P4 |
| 2.3 | **`#legend`/`#cartouche` → `.sheet`/`.sheet-sm`** (+ layout-only positioning). | `odyssey/iliad:39,178/167` | S | `02 D6`; P3 |
| 2.4 | **`#noteBox` → `.lvEdit`.** Instruments reuse the shared in-panel editor instead of a bespoke textarea. | `odyssey:62–66`, `iliad:62–65` | S | `02 §1`; P10 |
| 2.5 | **One shared `#err` → `.toast`** rendered in ink-on-paper; single definition, four consumers. | new in `asterlogos.css`; the 4 `#err` sites | S | `02 D7`; P1 |
| 2.6 | **Link the system from the marketing pages** and delete redundant local token/atom blocks. Leave `wireframe` as a marked intentional greybox. | `pitch:14–55`, `threepager:16–149`; (`wireframe` = exception) | M | `02 D8`; P10 |

---

## Stage 3 — Structural de-duplication (the biggest single win)

| # | Change | Files / selectors | Effort | Motivated by |
|---|---|---|---|---|
| 3.1 | **Extract the shared book-instrument shell.** `odyssey-sculptural` and `iliad-sculptural` are the same file with swapped topology data (`02 D5`); pull the common chrome/CSS/JS into `_shared/instrument.*` and have each book supply only its data + sculpture. This subsumes 1.4, 1.5, 2.3, 2.4 for both files at once and stops future drift (the twins have *already* diverged — see the iliad titlecard). | `odyssey-sculptural/*`, `iliad-sculptural/*` → `_shared/instrument.*` | **L** | `02 D5`; P10 |

*Sequencing note: if 3.1 is on the roadmap, do the Stage 1–2 instrument fixes **inside** the extraction rather than twice in two files. If 3.1 is deferred, apply them to both files now — they're cheap.*

---

## Stage 4 — Side-panel rework

*From `03 §4`. Keep the shared head, full-screen, slide mode, and the fly-to-stack commit — change only the spatial + a11y model.*

| # | Change | Files / selectors | Effort | Motivated by |
|---|---|---|---|---|
| 4.1 | **Introduce `--rail`** as the single width source; reserve-and-squeeze the stage (`#frame`/`#fieldFrame` get `right:var(--rail)`), `#shelfWrap` padding and panel width both read `--rail`. Retires the overlay-in-book model. | `surface:63–69,106,126–131,199` | M | `03 §4`; P6; fixes F1/F2/F8 |
| 4.2 | **Add the slide-in transition** (translateX + opacity on `--ease`) so the rail arrives instead of popping. | `surface #leavesPanel/#writeCol` | S | `03` F4; P8 |
| 4.3 | **Attach it:** `border-left:1px solid var(--rule)`; no scrim (facing-pages, not modal). | `surface:126` | S | `03` F3; P1/P7 |
| 4.4 | **Restore scroll affordance** (`scrollbar-width:thin`, `--rule` thumb, hidden at rest). | `surface:127–128` | S | `03` F6 |
| 4.5 | **Focus & roles:** `role="complementary" aria-label` on the docked rail; move focus to head on open; in full-screen promote to `role="dialog" aria-modal` + focus trap; Esc returns focus (Esc layering already exists). | `surface:352` (extend), `#leavesPanel`, `setLeavesOpen`/`setNotesFull` | M | `03` F7; P9 |
| 4.6 | **Mobile breakpoint:** below 720px the rail becomes a bottom sheet (34vw is too narrow). | `surface` `@media(max-width:720px)` | S | `03 §4` |

---

## Suggested order & rationale

1. **Stage 0** — one file, an afternoon, and the "buttons feel off" complaint (radius) largely disappears everywhere at once. Lowest risk, highest visible payoff.
2. **Stage 1** — locks the button spec and deletes the legacy aliases so nothing new lands on them.
3. **Stage 2** — mechanical orphan→atom swaps; each is small and independently shippable.
4. **Stage 3** — the structural refactor; schedule deliberately, fold Stage 1–2 instrument work into it.
5. **Stage 4** — the one genuine design change (not just consolidation); do it last, on a clean token/atom base, so the rail is built from settled parts.

**Resulting canonical set (~12, small by design):** `.btn` (2 skins + square), `.icon-act`, `.stepper`, `.seg`, `.act`, `.chip`, `.sheet`/`.sheet-sm`, `.toast`, `.panel-head`, `.leaf`, `.lvEdit`, and the two justified organisms (`#leavesBtn` notes-stack, the notes **rail**). No atomic-taxonomy sprawl — just the reading surface's real vocabulary, stated once.
