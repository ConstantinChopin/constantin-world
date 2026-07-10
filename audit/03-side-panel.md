# 03 · Side-panel UX evaluation

*Subject: the right-hand notes / commonplace column and its writing twin in `surface/index.html`. All line refs are that file unless noted. Evaluated against `01`, esp. P6 (corners have fixed jobs, centre is reading) and P8 (calm, physical motion).*

---

## 1. The current interaction model, precisely

There are really **two** right-side panels that share one head, plus two cousins. The "side panel" the brief is about is the **notes column**.

| Panel | Markup | Head | Trigger |
|---|---|---|---|
| **Notes column** (the commonplace) | `#leavesPanel` `126–131` | `#notesHead` `123–125` (a `.panel-head`) | `#leavesBtn` stacked-paper button, BR corner (`330`) → `setLeavesOpen(true)` `764` |
| **Write column** | `#writeCol` `199–208` | same `#notesHead`, re-skinned (`renderWriteHead` `803`) | `#newNote` `+` (`334`) → `openWrite()` `569` |
| Trace popover (cousin) | `#tracePanel` `180`, BL | own `.panel-head` | `#traceBtn` toggles `.open` `1037` |
| Instrument plate (cousin) | `#plate` in `odyssey:93`/`iliad:83` | `#pgEyebrow` | opening a node inside the book iframe |

**Geometry.** The notes column is a **fixed, floating column pinned to the right** — *not* a full-height drawer:
`position:fixed; top:78px; right:var(--edge-x); bottom:96px; width:min(480px,40vw); z-index:42` (`126`). Its head rides the top chrome line separately at `top:26px` (`123`). Scrollbar is deliberately hidden: `scrollbar-width:none` + `::-webkit-scrollbar{display:none}` (`127–128`).

**Open/close.**
- Open: `setLeavesOpen(true)` adds `body.leavesopen` (`765`); `display:none→flex` on the panel (`129`). **There is no enter transition on the panel itself** — it pops into existence. Only the *shelf behind it* animates.
- Close: three routes — the ✕ in the head (`renderNotesHead` close, `871–874`), `Escape` (layered, `1116–1125`), or clicking `#leavesBtn` again (`777–780`). **There is no click-outside-to-dismiss and no backdrop/scrim** — the panel floats over live, undimmed content.

**What happens to the reading surface — and here is the crux: the model changes by altitude.**
- **On the shelf**, opening the column **pushes** the content: `body.leavesopen #shelfWrap{padding-right:min(500px,42vw)}` with `transition:padding .45s var(--ease)` (`68–69`). The 2×2 shelf genuinely reflows into the remaining width. This is the good, calm case.
- **Inside a book** (the stage is a THREE.js `#frame` iframe), CSS can't reflow the iframe's contents, so the shell instead **overlays** the column and sends the instrument a cross-frame message `tellFrame({type:'ast:shift',on:…})` (`507, 768`), and the 3D figure animates itself leftward. Reading position is preserved, but by a bespoke postMessage handshake, not by layout.
- **In the field** (another iframe), same overlay-plus-message.

So: **one trigger, one visual result the user expects (content makes room), but two different mechanisms underneath** — reflow on the shelf, overlay+IPC in a book. That split is the root of the panel's UX debt.

**Full-screen.** `body.notesfull` (`137–141`) re-centres the column (`left:50%; width:min(680px,92vw)`) and fades the figure, masthead and stage to nothing — a clean, focused reading-of-notes view with a proper measure. This part is genuinely good.

**Modes.** The column has `stack` (grouped list, `.ltxt` clamped to 3 lines, `174`) and `slide` (one note at a time with ‹ › nav, `renderPanelSlide` `928`). Arrow keys drive slide mode (`1126–1132`).

---

## 2. Task walkthroughs — friction, flagged

### (a) Consult your commonplace while keeping your place in the book
1. You're reading a node in *The Odyssey* (the plate, inside the iframe).
2. Click **Notes** (BR). The column overlays the right 40vw; the shell messages the instrument, whose figure slides left.
- **F1 — Two spatial languages.** On the shelf the same action *reflowed* the page; here it *overlays* and asks the iframe to move. The user can't build one mental model of "what opening Notes does to my space." *(69 vs 507/768.)*
- **F2 — Occlusion is on trust.** The column sits *over* the iframe. If the instrument honours `ast:shift`, fine; if any right-edge instrument chrome doesn't move (e.g. `#registers`/`#cartouche` on the odyssey right edge), the panel covers it. Nothing in CSS guarantees non-occlusion (P6 wants the centre protected; here it's protected only by cooperation).
- **F3 — No backdrop, no attachment.** The floating column has no scrim and no shared edge with the page, so it reads as *detached* rather than as a second page pinned beside the first. For "consult while reading," it should feel like an open book's facing page.

### (b) Open, skim, dismiss quickly
1. Click **Notes** → 2. eyes down the list → 3. dismiss.
- **F4 — It pops, it doesn't arrive.** The panel has no enter transition (`display:none→flex`, `129`); only the shelf padding eases. Against P8 ("calm, physical motion") the notes appear abruptly. The one loved motion — the slip *flying* into the stack on commit (`flyToStack` `671`) — proves the system knows how to do this; the panel open doesn't use it.
- **F5 — No click-away.** To dismiss you must hit the ✕ or press Esc; clicking back onto the book does nothing. For a quick skim, that's an extra targeted click. (Esc is great once you know it; it isn't discoverable.)
- **F6 — Hidden scrollbar.** `scrollbar-width:none` (`127`) means a long list gives *no* affordance that there's more below. Fine for a designed reading page; risky for a scannable working list.

### (c) Work in the panel for a sustained stretch
1. Open Notes, switch to full-screen, edit several notes, place a few.
- **Strengths:** full-screen gives a real measure (`min(680px,92vw)`); in-panel editing (`.lvEdit`, `renderPanelEdit` `883`) is tidy and keyboarded (⌘/Ctrl+Enter, Esc); slide mode is a nice focus tool.
- **F7 — No focus management.** Opening the notes list doesn't move focus into the panel, `#leavesPanel` isn't a labelled region/dialog (only `#writeCol` has `role="dialog"`, `352`), there's no focus trap and no `aria-modal`. A keyboard/AT user opening Notes is left with focus back on the page. *(P9 cares about this.)*
- **F8 — Width is fixed and slightly self-inconsistent.** No resize/drag. And the panel is `min(480px,40vw)` while the space reserved for it on the shelf is `min(500px,42vw)` (`69`) — the reservation is ~20px/2vw wider than the panel, so the docked column and the gutter it creates don't line up to the same edge.

---

## 3. Against known-good patterns for auxiliary panels beside sustained reading

| Pattern | Good practice | Asterlogos today |
|---|---|---|
| **Push vs overlay** | Pick one; reflow the primary text so nothing is hidden. | **Split-brained** — reflow on shelf, overlay+IPC in book. |
| **Pinned split** | Persistent facing-column that the reader can leave open. | Transient float; no persistent split; reads as detached (F3). |
| **Dismissal** | ✕ + Esc + click-scrim, all present. | ✕ + Esc only; no scrim, no click-away (F5). |
| **Motion** | Panel slides in from its edge, matching page easing. | Pops (F4) while the *background* animates — backwards. |
| **Focus/keyboard** | Focus enters panel, Esc returns, region labelled, focus trapped in full-screen. | Esc layering excellent; focus & labelling absent (F7). |
| **Occlusion** | Layout guarantees the reading measure is never covered. | Guaranteed only by cross-frame cooperation (F2). |
| **Scroll affordance** | Visible on scroll/hover. | Hidden always (F6). |

**Net:** the *information architecture* is thoughtful (one head for notes/write/edit, full-screen, two modes, beautiful commit motion). The *spatial + a11y model* is where it's thin: inconsistent push/overlay, no attachment, pop-not-slide, no focus handling.

---

## 4. Recommended model — one push-aside rail, at every altitude

**Principle:** make the panel behave the same way everywhere — a **right reading-rail that squeezes the stage, never covers it** — so P6 (centre is always reading) holds by *layout*, not by cooperation. Keep everything that's already good (the shared head, full-screen, slide mode, the fly-to-stack commit).

### Spec

- **Mechanism — reflow the stage, kill the overlay.** Give the stage a right margin equal to the rail instead of floating the rail over it. Because the "stage" in a book is an iframe, drive its width from the shell:
  ```
  :root{ --rail:0px; }
  body.leavesopen{ --rail:clamp(340px, 34vw, 460px); }
  #frame,#fieldFrame{ right:var(--rail); width:auto; transition:right .40s var(--ease); }  /* was inset:0 */
  #shelfWrap{ padding-right:calc(var(--rail) + var(--edge-x)); }                            /* one source of truth */
  #leavesPanel,#writeCol{ width:var(--rail); }                                              /* panel == reserved space (fixes F8) */
  ```
  The instrument then reflows for real; the `ast:shift` postMessage becomes optional polish (re-centre the 3D figure within its new width) rather than the thing that prevents occlusion.
- **One width token** `--rail` used by the reservation *and* the panel, so they can never disagree (fixes F8). `clamp(340px,34vw,460px)` keeps a sane reading measure on wide screens.
- **Enter/exit motion** (fixes F4): rail slides in from the right edge, matching the stage squeeze, both on `--ease`:
  ```
  #leavesPanel{ transform:translateX(12px); opacity:0; transition:transform .4s var(--ease),opacity .3s var(--ease); }
  body.leavesopen #leavesPanel{ transform:none; opacity:1; }
  ```
- **Attachment** (fixes F3): a single hairline seam so the rail reads as paper pinned to the page, not a floating card: `border-left:1px solid var(--rule)` on the rail; no drop-shadow, no scrim (a scrim would fight P1/P7 — the point is *facing pages*, not a modal).
- **Dismissal:** keep ✕ + Esc (already good); add nothing modal. Because the rail no longer covers the reading, click-away is unnecessary — the reading stays live beside it (this is the win of push over overlay).
- **Scroll affordance** (fixes F6): show a thin ink scrollbar on hover/scroll instead of hiding it — `scrollbar-width:thin` with `--rule` thumb; keep it invisible at rest.
- **Focus & a11y** (fixes F7): `#leavesPanel` gets `role="complementary" aria-label="Your notes"`; on open, move focus to the head; keep Esc→return-focus. In **full-screen only** (it fully occludes), promote to `role="dialog" aria-modal="true"` and trap focus.
- **Breakpoint** (`<720px`): 34vw is too narrow — the rail becomes a **bottom sheet** (or reuses full-screen). Reserve-and-squeeze is a desktop behavior; on mobile the reading and the notes take turns.
  ```
  @media (max-width:720px){
    body.leavesopen{ --rail:0px; }
    #leavesPanel{ left:0; right:0; top:auto; height:min(70vh,560px); border-left:0; border-top:1px solid var(--rule); }
  }
  ```
- **Keep as-is:** the shared `#notesHead`, full-screen (`notesfull`), stack/slide modes, `flyToStack`, the whole write/edit-head grammar.

### Before / after

```
BEFORE — inside a book (overlay + cross-frame message)

┌───────────────────────────────────────────────┐
│ ‹ Shelf   The Odyssey            [Notes · 4] ✕ │   head rides chrome
│                                                │
│        the 3D figure  ·······>  ┌────────────┐ │   panel FLOATS over
│        (asked to shift          │ Loose    2 │ │   the iframe; figure
│         left by postMessage)    │ · a note…  │ │   moves only if the
│                                 │ Placed   2 │ │   instrument obeys.
│      reading plate  (may be     │ · a note…  │ │   No seam, no scrim,
│       partly under the panel) ──┤ · a note…  │ │   pops in, hidden
│                                 └────────────┘ │   scrollbar.
└───────────────────────────────────────────────┘
        ↑ occlusion prevented only by cooperation (F2)


AFTER — one rail, every altitude (stage squeezes; rail is attached)

┌──────────────────────────────────┬─────────────┐
│ ‹ Shelf  The Odyssey             │ Notes · 4 ▤ ✕│  head spans, acts right
│                                  │             │
│      the 3D figure, re-centred   │ Loose     2 │  stage width = calc(
│      inside its OWN width        │ · a note…   │  100% − --rail): real
│      (never under the rail)      │             │  reflow, not overlay
│                                  │ Placed    2 │
│      reading plate, fully        │ · a note…   │  ← 1px --rule seam:
│      visible beside the rail  →  │ · a note…   │    facing pages, no
│                                  │ · a note…   │    scrim. slides in
│                                  │             │    on --ease. thin
│                                  │             │    scrollbar on hover.
└──────────────────────────────────┴─────────────┘
   centre stays reading, by LAYOUT (P6) — same behavior on shelf,
   book, and field; --rail is the single source of width (F8 gone).
```

**One-line summary:** the notes column is well-built as *content* but behaves as an overlay in books and a push on the shelf; unify it into a single right rail that reserves its space and lets the stage reflow, add the slide-in it already knows how to do, and give it a seam, a scrollbar, and focus handling. Nothing else about it needs to change.
