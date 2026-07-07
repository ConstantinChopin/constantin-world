/* =========================================================================
   Marginalia — click a glossed term and a thin leader line draws from the
   column's edge out to a note in the right margin; click the term again (or
   click away / press Escape) to dismiss it. Where there is no room for a
   margin (narrow screens), the note flows inline, continuing the line right
   after the word, like a gloss opening in place.

   Progressive enhancement: with JS off, terms are plain buttons and the
   notes sit (hidden) at the foot of the article.

   Authoring, in any essay:

     <button type="button" class="concept" data-note="monomyth">monomyth</button>

   then, once, near the end of <article>:

     <aside class="concept-notes" hidden>
       <div id="note-monomyth"><p>Joseph Campbell's term for…</p></div>
     </aside>

   The id is always "note-" + the data-note value.
   ========================================================================= */
(function () {
  var concepts = Array.prototype.slice.call(
    document.querySelectorAll('.concept')
  );
  if (!concepts.length) return;

  var body = document.body;
  var MIN_GUTTER = 210; // px of right margin needed before we go inline
  var MAX_NOTE = 212;   // px — a comfortable measure for a margin note
  var NOTE_GAP = 64;    // px — fixed space from the column edge to the note

  // reusable margin pieces (only ever one open at a time)
  var line = document.createElement('div');
  line.className = 'gloss-line';
  var note = document.createElement('div');
  note.className = 'gloss-note';
  body.appendChild(line);
  body.appendChild(note);

  var active = null;     // the open .concept, or null
  var pinned = false;    // click pins it open past mouseout
  var mode = null;       // 'margin' | 'inline'
  var inlineEl = null;   // the inserted inline note, when mode === 'inline'
  var closeTimer = null;

  function noteHTML(trigger) {
    var key = trigger.getAttribute('data-note');
    var src = key && document.getElementById('note-' + key);
    return (
      '<span class="gloss-term">' +
      trigger.textContent.trim() +
      '</span>' +
      (src ? src.innerHTML : '')
    );
  }

  // the note's text as inline html — paragraphs flattened, emphasis kept —
  // for the flow-after-the-word fallback
  function noteFlow(trigger) {
    var key = trigger.getAttribute('data-note');
    var src = key && document.getElementById('note-' + key);
    if (!src) return '';
    var ps = src.querySelectorAll('p');
    var parts = ps.length
      ? Array.prototype.map.call(ps, function (p) { return p.innerHTML.trim(); })
      : [src.innerHTML.trim()];
    return parts.join(' ');
  }

  function placeMargin(trigger) {
    var b = body.getBoundingClientRect();
    var reading = trigger.closest('.reading') || document.querySelector('.reading');
    var rr = reading.getBoundingClientRect();
    var tr = trigger.getBoundingClientRect();

    var padRight = parseFloat(getComputedStyle(body).paddingRight) || 0;
    var colRight = rr.right - b.left;
    var gutterRight = (window.innerWidth - padRight) - b.left;

    // the note sits a fixed distance from the column rather than pinned to
    // the screen edge; any spare width spills to the right margin
    var noteLeft = colRight + NOTE_GAP;
    var noteW = Math.min(MAX_NOTE, gutterRight - noteLeft);
    var lineStart = colRight + 10;
    var lineEnd = noteLeft - 12;
    var top = tr.top - b.top;
    var lineY = top + tr.height / 2;

    note.style.width = noteW + 'px';
    note.style.left = noteLeft + 'px';
    note.style.top = (top - 1) + 'px';

    line.style.left = lineStart + 'px';
    line.style.top = Math.round(lineY) + 'px';
    line.style.width = Math.max(0, lineEnd - lineStart) + 'px';
  }

  function open(trigger, pin) {
    if (active && active !== trigger) close(true);
    cancelClose();

    active = trigger;
    pinned = !!pin;
    trigger.setAttribute('aria-expanded', 'true');

    // choose presentation by how much margin we have
    var b = body.getBoundingClientRect();
    var reading = trigger.closest('.reading') || document.querySelector('.reading');
    var rr = reading.getBoundingClientRect();
    var padRight = parseFloat(getComputedStyle(body).paddingRight) || 0;
    var available = (window.innerWidth - padRight) - rr.right;

    if (available >= MIN_GUTTER) {
      mode = 'margin';
      note.innerHTML = noteHTML(trigger);
      placeMargin(trigger);
      // next frame so the from-state is painted before transitioning
      requestAnimationFrame(function () {
        line.classList.add('is-open');
        note.classList.add('is-open');
      });
    } else {
      mode = 'inline';
      // drop any note still collapsing from a previous hover so two never stack
      var stale = document.getElementsByClassName('gloss-flow');
      while (stale.length) stale[0].remove();
      inlineEl = document.createElement('span');
      inlineEl.className = 'gloss-flow';
      inlineEl.innerHTML =
        '<span class="gloss-flow-inner"><span class="gloss-flow-pad"> ' +
        noteFlow(trigger) +
        '</span></span>';
      // insert it collapsed (font-size 0), then grow it open. the note's own
      // width animates from nothing to full, so the rest of the sentence and
      // the blocks below reflow continuously with it — no snap at either end.
      trigger.parentNode.insertBefore(inlineEl, trigger.nextSibling);
      // commit the collapsed from-state before opening, or the browser
      // coalesces insertion + class and the enter transition is skipped
      void inlineEl.offsetWidth;
      inlineEl.classList.add('is-open');
    }
  }

  function close(immediate) {
    cancelClose();
    if (!active) return;
    active.setAttribute('aria-expanded', 'false');
    active = null;
    pinned = false;

    line.classList.remove('is-open');
    note.classList.remove('is-open');

    if (inlineEl) {
      var el = inlineEl;
      inlineEl = null;
      if (immediate) {
        el.remove();
      } else {
        // shrink the note back into the line, then drop the empty node once the
        // collapse has run — the sentence closes over it smoothly as it goes.
        el.classList.remove('is-open');
        var done = function (e) {
          if (e.target !== el || e.propertyName !== 'font-size') return;
          el.removeEventListener('transitionend', done);
          el.remove();
        };
        el.addEventListener('transitionend', done);
        // fallback if the transition never fires (e.g. reduced motion); must
        // outlast the font-size collapse's delay + duration
        setTimeout(function () {
          el.removeEventListener('transitionend', done);
          if (el.parentNode) el.remove();
        }, 1000);
      }
    }
    mode = null;
  }

  function cancelClose() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
  }

  // click to open, click the same term again to collapse — no hover
  concepts.forEach(function (c) {
    c.setAttribute('aria-expanded', 'false');

    c.addEventListener('click', function (e) {
      e.preventDefault();
      if (active === c) close(false);
      else open(c, true);
    });
  });

  // an open note dismisses on an outside click or Escape
  document.addEventListener('click', function (e) {
    if (!pinned || !active) return;
    if (active.contains(e.target) || note.contains(e.target)) return;
    if (inlineEl && inlineEl.contains(e.target)) return;
    close(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && active) { close(false); active && active.focus(); }
  });

  // geometry shifts on resize — simplest correct thing is to close
  window.addEventListener('resize', function () { if (active) close(true); });
})();
