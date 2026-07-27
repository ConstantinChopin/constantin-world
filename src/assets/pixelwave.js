/* PixelClouds — rounded volumetric greyscale clouds in non-overlapping lanes.
 * Rules honoured: (1) no two clouds overlap — each lane reserves a slot wider than
 * its widest possible cloud, so per-cloud size spread and horizontal jitter (bounded
 * to under half the gap) can never close a gap; lanes stay vertically separated;
 * (2) no flat edges and (3) no flat bottom — every silhouette is an all-circle rounded
 * blob (top, bottom, and ends). Clouds are shaded (light top, dark under-belly) and
 * breathe as they drift. Distribution is organic: sizes vary (skewed small), positions
 * jitter within their slot, some slots stay empty, and each cloud scatters within its
 * lane band — so no two neighbours read as the same stamp. Self-contained, no deps.
 *
 * Usage:
 *   1. <canvas id="pixel-wave" aria-hidden="true"></canvas> as the first element in <body>.
 *   2. CSS: #pixel-wave{ position:fixed; inset:0; z-index:0; pointer-events:none; }
 *           (content above it: .site-content{ position:relative; z-index:2; })
 *   3. <script src="pixelwave.js" defer></script>
 *
 * Tune via CONFIG.lanes. Per lane: yc (centre, fraction of H), thickness (vertical
 * room, fraction of H — keep lanes' yc±thickness/2 from touching to preserve rule 1),
 * width (base cloud width css px), gap (min clear space between clouds css px),
 * speed (drift px/s), maxTone (0..2 darkness cap). Global: evolve = billow rate.
 * React note: run the IIFE body inside useEffect; on cleanup cancelAnimationFrame
 * and remove the resize listener so hot-reload doesn't stack loops.
 */
(function () {
  const canvas = document.getElementById('pixel-wave');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // ————— LOCKED SETTINGS —————
  const CONFIG = {
    /* the dark-register derivation: the clouds lift off the catalogue's
       near-black green rather than shading a white sky. the spread is kept
       tight so the belly never reads as underlit — depth, not glow. */
    tones: ['30, 35, 29', '40, 46, 39', '52, 58, 51'], // soft · mid · deep lift
    lanes: [ // centres tile the full height (~0.08 → ~0.88); bands stay vertically separated
      { yc: 0.08, thickness: 0.15, width: 280, gap: 100, speed: 4,  maxTone: 1 }, // highest, softest, slowest
      { yc: 0.28, thickness: 0.16, width: 340, gap: 118, speed: 7,  maxTone: 1 },
      { yc: 0.48, thickness: 0.16, width: 400, gap: 132, speed: 10, maxTone: 2 }, // mid
      { yc: 0.68, thickness: 0.17, width: 470, gap: 150, speed: 13, maxTone: 2 },
      { yc: 0.88, thickness: 0.17, width: 540, gap: 170, speed: 16, maxTone: 2 }  // lowest, biggest, darkest, fastest
    ],
    pixelSize: 6,     // css px per cell — minimal, fine grain
    intensity: 0.30,  // 0..1 opacity of the tones — keep low behind text
    speed:     1,     // global drift multiplier (0 = frozen sky)
    evolve:    1,     // billow rate of the cloud forms (0 = static shapes)
    gap:       1,     // css px gap between cells
    fadeLeft:  460,   // px: dissolve clouds over the leftmost N px (protect the reading column)
    refCell:   22,    // interior noise sampled against this fixed grid
    maxCells:  28000, // grid-resolution cap; auto-coarsens past this on very large screens
    fps:       30
  };
  // ———————————————————————————

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let DPR = Math.min(window.devicePixelRatio || 1, 1.5) || 1;
  let W = 0, H = 0;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5) || 1;
    W = canvas.width  = Math.max(1, Math.round((window.innerWidth  || 1) * DPR));
    H = canvas.height = Math.max(1, Math.round((window.innerHeight || 1) * DPR));
    canvas.style.width  = (window.innerWidth  || 1) + 'px';
    canvas.style.height = (window.innerHeight || 1) + 'px';
  }
  window.addEventListener('resize', resize);
  resize();

  function hash(ix, iy) { let n = ix * 127.1 + iy * 311.7; n = Math.sin(n) * 43758.5453; return n - Math.floor(n); }
  function noise(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  }
  function fbm(x, y) { let v = 0, a = 0.5; for (let i = 0; i < 4; i++) { v += a * noise(x, y); x *= 2.03; y *= 2.03; a *= 0.5; } return v / 0.9375; }

  let phase = 0, last = performance.now(), lastDraw = 0;

  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) { last = now; return; }
    if (now - lastDraw < 1000 / CONFIG.fps) return;
    lastDraw = now;
    if (!reduceMotion) phase += (now - last) * 0.001 * CONFIG.speed;
    last = now;
    draw(phase);
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    let cell = Math.max(2, CONFIG.pixelSize * DPR);
    while ((W / cell) * (H / cell) > CONFIG.maxCells) cell *= 1.25;

    const pad   = CONFIG.gap * DPR;
    const k     = CONFIG.intensity;
    const fade  = CONFIG.fadeLeft * DPR;
    const LANES = CONFIG.lanes;
    const TONES = CONFIG.tones;
    const REF   = CONFIG.refCell * DPR;
    const tv    = t * CONFIG.evolve;
    const maxGX = Math.ceil(W / cell), maxGY = Math.ceil(H / cell);

    // cloud archetypes — each cloud picks one, so the sky reads as a mix.
    // wMul<=1.15 keeps every type inside the lane's spacing envelope (no-overlap holds).
    const TYPES = [
      { wMul: 1.12, hMul: 0.72, main: 8,  round: 0.52, tower: 0.28, top: 4, bot: 3 }, // low broad — cohesive, flatter
      { wMul: 0.92, hMul: 1.00, main: 8,  round: 0.58, tower: 0.52, top: 4, bot: 3 }, // round — medium & full
      { wMul: 1.00, hMul: 1.00, main: 9,  round: 0.52, tower: 0.62, top: 5, bot: 3 }, // tower — tall
      { wMul: 1.12, hMul: 0.90, main: 11, round: 0.46, tower: 0.35, top: 6, bot: 3 }  // bank — wide & lumpy
    ];

    // per-cloud size spread — big and small clouds share a lane, so no two
    // neighbours read as the same stamp. skew<1 biases toward smaller clouds.
    const SIZE_MIN = 0.60, SIZE_MAX = 1.18, SIZE_SKEW = 1.35;

    for (let li = 0; li < LANES.length; li++) {
      const ln  = LANES[li];
      const off = t * ln.speed * DPR;
      const cwBase = ln.width * DPR;
      const cwMax  = cwBase * 1.12 * SIZE_MAX;   // widest archetype × widest size = the true maximum
      const gapPx  = ln.gap * DPR;
      const per    = cwMax + gapPx;              // spacing accounts for the widest cloud -> no same-lane overlap
      const jMax   = gapPx * 0.42;               // horizontal jitter; 2·jMax < gap so a gap can never close
      const chhCap = ln.thickness * H * 0.30;    // keep cloud inside its lane band
      const vScat  = ln.thickness * H * 0.18;    // vertical scatter within the band (bands stay separated)
      const i0 = Math.floor((off - cwMax - jMax) / per), i1 = Math.ceil((off + W + jMax) / per);

      for (let i = i0; i <= i1; i++) {
        // leave some slots empty so the sky clumps and clears rather than marching
        if (hash(i * 1.93 + 5.1, li * 6.7 + 2.3) < 0.12) continue;
        const r1 = hash(i * 7.3,        li * 13.1 + 1.7);
        const r3 = hash(i * 11.3 + 9.1, li * 5.3  + 3.9);
        const T = TYPES[Math.min(TYPES.length - 1, Math.floor(hash(i * 2.13 + 0.7, li * 3.9 + 0.3) * TYPES.length))];
        const size = SIZE_MIN + (SIZE_MAX - SIZE_MIN) * Math.pow(r1, SIZE_SKEW); // more small, few large
        const cw  = cwBase * T.wMul * size;            // <= cwMax
        const chh = Math.min(cw * 0.34, chhCap) * T.hMul;
        const jx  = (hash(i * 3.7 + 0.2, li * 8.3 + 1.1) - 0.5) * 2 * jMax; // break the regular spacing
        const x0  = i * per - off + jx;
        if (x0 > W || x0 + cw < 0) continue;
        const cy  = ln.yc * H + (r3 - 0.5) * vScat;

        // all-circle silhouette centred on cy: rounded top AND bottom, rounded ends.
        // Shape driven by the chosen archetype T.
        const puffs = [];
        for (let j = 0; j < T.main; j++) {             // body row
          const u = j / (T.main - 1);
          const bell = Math.sin(Math.PI * u);
          const breathe = 0.90 + 0.16 * Math.sin(tv * 0.15 + i * 2.7 + j * 1.7);
          const rad = chh * (0.40 + T.round * bell) *   // higher floor -> puffs merge, no beading
                      (0.90 + 0.18 * hash(i * 17.7 + j * 3.1, li * 7.9 + j)) * breathe; // smoother body
          puffs.push([x0 + cw * (0.06 + 0.88 * u), cy, rad * rad]);
        }
        if (T.tower > 0) {                             // central tower -> height/volume
          const breathe = 0.90 + 0.16 * Math.sin(tv * 0.14 + i * 1.3 + 2.0);
          const rad = chh * T.tower * breathe;
          puffs.push([x0 + cw * (0.40 + 0.20 * hash(i * 4.9, li * 6.7)), cy - chh * 0.70, rad * rad]);
        }
        for (let j = 0; j < T.top; j++) {              // cauliflower lumps on top
          const hu = hash(i * 5.1 + j * 9.3, li * 4.7 + j);
          const breathe = 0.85 + 0.24 * Math.sin(tv * 0.12 + i * 1.5 + j * 2.1 + 3.0);
          const rad = chh * (0.24 + 0.26 * hash(i * 13.7 + j * 2.9, li * 6.1 + j)) * breathe;
          puffs.push([x0 + cw * (0.14 + 0.72 * hu), cy - chh * 0.58 - rad * 0.2, rad * rad]);
        }
        for (let j = 0; j < T.bot; j++) {              // bottom rounding bumps (no flat base)
          const hu = hash(i * 6.7 + j * 4.3, li * 8.1 + j + 2);
          const breathe = 0.85 + 0.20 * Math.sin(tv * 0.11 + i * 1.2 + j * 2.6 + 1.5);
          const rad = chh * (0.20 + 0.16 * hash(i * 9.3 + j * 3.7, li * 5.9 + j)) * breathe;
          puffs.push([x0 + cw * (0.22 + 0.56 * hu), cy + chh * 0.40 + rad * 0.1, rad * rad]);
        }

        // rasterise with relief: depth into shape + vertical light + evolving churn
        const top = cy - chh * 1.75, bot = cy + chh * 1.25;  // taller top, same bottom
        const gx0 = Math.max(0, Math.floor(x0 / cell)), gx1 = Math.min(Math.ceil((x0 + cw) / cell), maxGX);
        const gy0 = Math.max(0, Math.floor(top / cell)), gy1 = Math.min(Math.ceil(bot / cell), maxGY);
        const invH = 1 / Math.max(1, bot - top);
        for (let gy = gy0; gy < gy1; gy++) {
          const py = gy * cell + cell / 2;
          // exponent > 1 pushes the tonal break downward: light grey fills the taller
          // upper body while dark grey stays confined to the same low band
          const vf = Math.pow(Math.min(1, Math.max(0, (py - top) * invH)), 1.7); // 0 top → 1 bottom
          for (let gx = gx0; gx < gx1; gx++) {
            const px = gx * cell + cell / 2;
            let d = 0;
            for (let c = 0; c < puffs.length; c++) {
              const dx = px - puffs[c][0], dy = py - puffs[c][1];
              const q = 1 - (dx * dx + dy * dy) / puffs[c][2];
              if (q > d) d = q;
            }
            if (d <= 0) continue;
            const n = fbm(px / REF * 0.5 + tv * 0.06 + i * 3.1, py / REF * 0.5 - tv * 0.04 + li * 7.7) - 0.5;
            const darkness = 0.28 * d + 0.52 * vf + 0.26 * n;
            let ti = darkness < 0.34 ? 0 : darkness < 0.60 ? 1 : 2;
            if (ti > ln.maxTone) ti = ln.maxTone;    // high clouds stay soft
            let alpha = k;
            const x = gx * cell;
            if (fade > 0 && x < fade) alpha *= (x / fade);
            if (alpha <= 0) continue;
            ctx.fillStyle = `rgba(${TONES[ti]}, ${alpha})`;
            ctx.fillRect(x + pad, gy * cell + pad, cell - pad * 2, cell - pad * 2);
          }
        }
      }
    }
  }

  requestAnimationFrame(frame);
})();
