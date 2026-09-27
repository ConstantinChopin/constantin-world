# Re-skin audit 03 — Open decisions

These gate execution. D1 gates almost everything; the rest can default to the
recommendation if unanswered.

## D1 — Register strategy (THE decision)

The studio is **light-only** (white paper, ink at 82%). World's identity is the **dark
catalogue** with the `body.essay` flip into a warm-paper reading room — a standing design
decision on record. "Follow the studio's UI/UX paradigms" has three readings:

- **(a) Full light flip.** World becomes white paper everywhere, adopting the studio's
  exact `:root`. Cleanest parity; but the dark catalogue dies and the register flip — the
  site's signature move — collapses (catalogue and reading room would both be light).
  The two sites also become visually near-identical, weakening the world/studio
  distinction (world mints credibility, studio sells it — they arguably *should* look
  related but not identical).
- **(b) Paradigm port, dark catalogue kept.** Adopt the studio's UX paradigms — glass
  chrome, `.lnk` pills, row anatomy, plates, motion, lightbox, mobile slide-in — but
  parameterized over world's existing dark/paper registers. Requires deriving a
  dark-register glass contract and `--surface`. The register flip survives and gets
  *stronger* (the same components render in both registers).
- **(c) Register swap.** Adopt the studio's light `:root` as world's new base register and
  keep a dark register for a designated surface (or drop to (a) if nothing earns it).

**Recommendation: (b).** It honors both the new directive (studio UI/UX paradigms) and the
standing "dark catalogue stays" decision, and the token architecture (register =
re-declared tokens on a body class) was built for exactly this. If the intent was "make
world look like studio, full stop," answer (a) and Phase 1 swaps the `:root` wholesale.

## D2 — Detail preview: live iframe vs static canvas-sets

Studio DEV-PLAN Goal 2 replaced live iframe previews with pre-rendered static plate/rail
panels. But world's entries are different in kind: they're **readable pages** (essays,
skills), not portfolio artifacts, and the two project entries are **external links**
(Asterlogos, Sanctuaire). A static plate panel of an essay is a screenshot of text.

**Recommendation:** keep the iframe preview for world's internal reading surfaces (the
preview *is* the content), but adopt the studio's glass viewport chrome around it and the
mobile full-page slide-in. Revisit only if world gains portfolio-style entries. This keeps
the `postMessage` breadcrumb bridge alive — note it in the controller when restyling.

## D3 — Pixelwave background canvas

Studio runs a fixed greyscale drifting-cloud canvas behind everything (30fps, 460px left
fade, visibility-paused, reduced-motion frozen). Porting to a dark register means
re-deriving the three grey tones against `#090d09`.

**Recommendation:** port it, retinted for the dark catalogue and disabled under
`body.essay` (the paper room should stay still and quiet). Small, self-contained file;
easy to drop if it fights the catalogue's austerity.

## D4 — WebGL point-cloud retint

Skills-page galaxy colors live in JS (see 02, Surface 4). Under D1(b) the dark backdrop
survives and the retint is optional polish; under D1(a) it is **mandatory** (the current
palette is tuned for dark ground).

**Recommendation:** defer to the end of Phase 3; treat as its own small task.

## D5 — Dead-code removal

Constellation hero CSS block + orphaned `pointcloud.js`.
**Recommendation: remove in Phase 0.** Zero-risk; shrinks the audit surface.

## D6 — Centralize header/footer includes

Both sites hand-author page chrome per page. The re-skin touches every header/footer
anyway — the cheapest moment to extract `_includes/site-head.njk` / `colophon.njk`.
**Recommendation: yes, opportunistically during Phase 3, without changing markup output.**

## D7 — Font loading

Both sites use render-blocking Google Fonts `@import`. Paradigm parity says leave it;
performance says self-host woff2 + preload.
**Recommendation: leave as-is** (parity, and it's one line to change later). Not a
re-skin concern.

## D8 — Per-entry accent colors

Studio gives each project an accent hue on active links. World's entries (essays,
resources, external projects) could each carry one in `library.json`.
**Recommendation:** adopt the *mechanism* (a `data-accent`/token per entry) but start with
gold-only; choose hues editorially later. Avoids inventing brand colors for essays now.
