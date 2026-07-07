// =========================================================================
// pointcloud.js — the cover's volumetric point-cloud previews.
//
// The canonical Asterlogos illustrations are the full-screen folio
// experiences (projects/asterlogos/experience/…): dark "cosmos" point
// clouds, scroll-driven through a sequence of camera stations. This module
// renders small, non-interactive PREVIEWS of those same topologies for the
// library cards on the project cover — little lit windows into each book's
// cosmos.
//
//   import { mountPointCloud } from '/assets/pointcloud.js';
//   mountPointCloud(canvasEl, 'mill');
//
// Each preview is generated from the same geometry idea as its canonical
// folio (the Mill's spindle + wobble + strata + knots; the Odyssey's sea,
// islands and route), only sparser. They render on a near-black card (see
// .vol-diagram in styles.css) with the same glow, twinkle and sparkle
// treatment as the folios, so the cover and the experience read as one work.
//
// Books without a canonical folio yet (Liturgies of the Wild, La Commedia)
// are drawn in the same cosmos language as placeholders.
// =========================================================================
// uses the global THREE (r128 UMD), the same build the folios render with
const THREE = window.THREE;

// the cosmos palette, shared with the canonical folios (linear-ish rgb)
const GOLD  = [0.83, 0.64, 0.31];
const SALT  = [0.80, 0.81, 0.77];
const SAND  = [0.42, 0.37, 0.28];
const IVORY = [0.92, 0.89, 0.80];
const OXIDE = [0.72, 0.33, 0.29];
const CYAN  = [0.42, 0.78, 0.96];
const HOME  = [0.95, 0.80, 0.42];

const j = (a) => (Math.random() * 2 - 1) * a;
const rnd = () => (Math.random() + Math.random() + Math.random()) / 3;   // soft bell
const lerp3 = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];

// ——— the cloud accumulator ———
// add(x,y,z, colour, size?, literal?) appends one point. `literal` marks
// authored colour gradients (the route, the strata, the flames) that the
// cosmos recolor pass must leave untouched; everything else is fair game for
// sparkles and saturation.
function cloud() {
  const P = [], C = [], S = [], PH = [], L = [];
  return {
    add(x, y, z, c, size = 1, literal = 0) {
      P.push(x, y, z); C.push(c[0], c[1], c[2]); S.push(size);
      PH.push(Math.random() * 6.28); L.push(literal);
    },
    done() {
      return {
        pos: new Float32Array(P), col: new Float32Array(C),
        siz: new Float32Array(S), pha: new Float32Array(PH), lit: new Float32Array(L),
      };
    },
  };
}

// the ages of the world, read off the height: gold at the top (golden age),
// salt in the middle, sand at the bottom — the Mill's vertical gradient
function strata(t) {
  if (t > 0.6) return lerp3(SALT, GOLD, (t - 0.6) / 0.4);
  if (t > 0.34) return lerp3(SAND, SALT, (t - 0.34) / 0.26);
  return SAND;
}

// ——— Hamlet's Mill — the precessing wheel (preview) ———
// A vertical machine: a faint spindle, the bright precession spiral climbing
// it, a body stratified gold→salt→sand, and a few glowing mythic knots.
function genMill() {
  const cl = cloud(), H = 1.0;
  // the spindle — a dim column on the world-axis
  for (let i = 0; i < 70; i++) { const y = -H - 0.1 + (2 * H + 0.3) * (i / 70); cl.add(j(0.02), y, j(0.02), [0.62, 0.74, 0.86], 0.8); }
  // the body — the argument cloud, certainty fading from a dense bright core
  for (let i = 0; i < 280; i++) {
    const r = 0.12 + 0.72 * Math.pow(Math.random(), 1.4), th = Math.random() * 6.2831, y = (rnd() * 2 - 1) * H;
    const cert = 0.6 + 0.4 * (1 - r / 0.84) * Math.random();
    cl.add(Math.cos(th) * r, y, Math.sin(th) * r, strata((y + H) / (2 * H)).map((v) => v * (0.78 + cert * 0.3)), 1.3 + Math.random() * 1.3);
  }
  // the wobble — the precession spiral, the brightest thread (the signature gesture)
  for (let i = 0; i < 150; i++) { const u = i / 150, y = -H + 2 * H * u, th = u * 5 * 6.2831, r = 0.17 + 0.05 * Math.sin(u * 40); cl.add(Math.cos(th) * r, y, Math.sin(th) * r, [0.98, 0.95, 0.85], 1.9 + Math.random() * 1.1); }
  // the cast — glowing knots pinned around the wheel
  const knots = [[0, 0.7], [0.3, 0.95], [1.6, 0.45], [2.6, 0.1], [4.2, -0.45], [5.3, -0.75]];
  knots.forEach(([lobe, y]) => { const r = 0.82; const cx = Math.cos(lobe) * r, cz = Math.sin(lobe) * r;
    for (let k = 0; k < 16; k++) { const g = () => j(0.12); const yy = y + g(); cl.add(cx + g(), yy, cz + g(), strata((yy + H) / (2 * H)).map((v) => Math.min(1, v * 1.4)), 1.8 + Math.random() * 1.3); } });
  // the speculative margin — a dim oxide haze at the edge
  for (let i = 0; i < 80; i++) { const r = 0.95 + Math.abs(rnd() * 2 - 1) * 0.45, th = Math.random() * 6.2831, y = (Math.random() * 2 - 1) * H; cl.add(Math.cos(th) * r, y, Math.sin(th) * r, OXIDE.map((v) => v * 0.85), 0.9 + Math.random()); }
  return cl.done();
}

// ——— The Odyssey — the archipelago (preview) ———
// DEPRECATED SOURCE OF TRUTH: the knot coordinates + route below duplicate the
// canonical topology now extracted to prototypes/_shared/odyssey-topology.js.
// This preview should be migrated to consume that module; do not edit the
// coordinates here — change them in the shared module or they will drift.
//
// The same topology as the canonical folio: a map, not a machine. The knots
// carry real Mediterranean lon/lat, projected to a horizontal plane and
// normalized to the card; the voyage is the Catmull-Rom route (with the
// bag-of-winds loop baked in), the Nekuia drops once below the surface, and
// faint embedded-tale threads run back from Scheria. Aspect colours match the
// folio's commonplace "heads".
function genOdyssey() {
  const cl = cloud();
  const ivory = [0.92, 0.89, 0.80], oxide = [0.72, 0.33, 0.29], gold = [0.86, 0.70, 0.36],
        seafoam = [0.55, 0.74, 0.78], lethe = [0.62, 0.40, 0.78], home = [0.95, 0.80, 0.42];
  const aspectColor = (a) => [ivory, gold, lethe, home, [0.95, 0.85, 0.62], seafoam, oxide, [0.80, 0.78, 0.70]][a] || ivory;

  // [id, lon, lat, aspect, kind] — the canonical knots
  const K = [
    ['troy', 26.24, 39.96, 7, 'port'], ['ismarus', 25.52, 40.87, 0, 'raid'], ['malea', 23.19, 36.43, 3, 'pivot'],
    ['lotus', 10.85, 33.80, 2, 'isle'], ['cyclops', 15.16, 37.56, 1, 'isle'], ['aeolia', 15.21, 38.79, 0, 'isle'],
    ['laistry', 9.16, 41.39, 6, 'isle'], ['circe', 13.09, 41.24, 2, 'isle'], ['nekuia', 14.07, 40.84, 5, 'underworld'],
    ['sirens', 14.43, 40.58, 6, 'reef'], ['scylla', 15.63, 38.25, 6, 'strait'], ['thrina', 14.27, 37.08, 0, 'isle'],
    ['ogygia', 14.24, 36.05, 2, 'isle'], ['scheria', 19.92, 39.62, 5, 'court'], ['ithaca', 20.72, 38.36, 3, 'home'],
  ];
  const lons = K.map((k) => k[1]), lats = K.map((k) => k[2]);
  const lon0 = (Math.min(...lons) + Math.max(...lons)) / 2, lat0 = (Math.min(...lats) + Math.max(...lats)) / 2;
  const latRad = lat0 * Math.PI / 180, SCALE = 0.62;
  const proj = (lon, lat) => [(lon - lon0) * Math.cos(latRad) * SCALE, -(lat - lat0) * SCALE]; // north = -z
  const P = {}; let maxAbs = 0;
  K.forEach((k) => { const p = proj(k[1], k[2]); P[k[0]] = { x: p[0], z: p[1], aspect: k[3], kind: k[4] }; maxAbs = Math.max(maxAbs, Math.abs(p[0]), Math.abs(p[1])); });
  const NORM = maxAbs / 0.95;
  for (const id in P) { P[id].x /= NORM; P[id].z /= NORM; }
  const DEPTH = -2.7 / NORM;   // the single drop to the dead, normalized
  const half = 1.12;

  // the wine-dark sea — a broad faint disc, brightening toward the centre
  for (let i = 0; i < 200; i++) { const r = Math.sqrt(Math.random()) * half, th = Math.random() * 6.2831, d = 1 - Math.min(1, r / half); cl.add(Math.cos(th) * r, j(0.012), Math.sin(th) * r, [0.11 + 0.10 * d, 0.14 + 0.11 * d, 0.28 + 0.14 * d], 0.8); }
  // a faint coastline ring around the inhabited centre
  for (let i = 0; i < 60; i++) { const r = half * (0.6 + Math.random() * 0.42), th = Math.random() * 6.2831; cl.add(Math.cos(th) * r, j(0.01), Math.sin(th) * r, [0.22, 0.20, 0.16], 0.8); }
  // the knots — each landfall a glowing cluster, coloured by aspect; Ithaca
  // home-gold, the Nekuia sunk below the plane
  Object.values(P).forEach((k) => {
    const baseY = (k.kind === 'underworld') ? DEPTH : 0, col = aspectColor(k.aspect);
    const n = (k.kind === 'home' || k.kind === 'port') ? 18 : (k.kind === 'underworld' ? 20 : 12);
    const spread = (k.kind === 'underworld') ? 0.06 : 0.05;
    const g = () => ((Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2) * spread;
    for (let i = 0; i < n; i++) { const yy = baseY + g() * (k.kind === 'underworld' ? 2.4 : 0.9); cl.add(k.x + g(), yy, k.z + g(), col, 1.4 + Math.random() * 1.0); }
    for (let i = 0; i < 5; i++) cl.add(k.x + j(0.02), baseY + j(0.02), k.z + j(0.02), col.map((v) => Math.min(1, v * 1.3)), 1.8 + Math.random()); // bright core
  });
  // the descent shaft — the one vertical move, linking the plane to the dead
  { const nk = P.nekuia, steps = 22; for (let i = 0; i < steps; i++) { const f = i / steps, jit = 0.03 * (1 - 0.4 * f); cl.add(nk.x + j(jit), DEPTH * f, nk.z + j(jit), lerp3([0.30, 0.22, 0.42], [0.42, 0.30, 0.50], f), 0.9, 1); } }
  // the voyage — the beaded Catmull-Rom route, bag-of-winds loop included,
  // warm gold at the knots cooling to seafoam mid-leg
  const ROUTE = ['troy', 'ismarus', 'malea', 'lotus', 'cyclops', 'aeolia', 'aeolia', 'laistry', 'circe', 'nekuia', 'circe', 'sirens', 'scylla', 'thrina', 'ogygia', 'scheria', 'ithaca'];
  const ptOf = (id) => { const k = P[id]; return [k.x, (k.kind === 'underworld') ? DEPTH : 0, k.z]; };
  const rp = ROUTE.map(ptOf);
  const sample = (p0, p1, p2, p3, t) => { const t2 = t * t, t3 = t2 * t, o = [0, 0, 0]; for (let d = 0; d < 3; d++) o[d] = 0.5 * ((2 * p1[d]) + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3); return o; };
  const SEG = 12;
  for (let i = 0; i < rp.length - 1; i++) { const p0 = rp[Math.max(0, i - 1)], p1 = rp[i], p2 = rp[i + 1], p3 = rp[Math.min(rp.length - 1, i + 2)];
    for (let s = 0; s < SEG; s++) { const t = s / SEG, p = sample(p0, p1, p2, p3, t), m = Math.sin(t * Math.PI); cl.add(p[0] + j(0.012), p[1] + m * 0.03 + j(0.01), p[2] + j(0.012), lerp3(gold, seafoam, m), 1.2, 1); } }
  // the embedded-tale threads — faint strands running back from Scheria to the
  // knots Odysseus narrates (the teller inside the telling)
  const told = ['cyclops', 'circe', 'nekuia', 'scylla', 'ogygia'], sc = P.scheria;
  told.forEach((id) => { const k = P[id], y = (k.kind === 'underworld') ? DEPTH : 0, n = 8;
    for (let s = 0; s < n; s++) { const f = s / n; cl.add(sc.x + (k.x - sc.x) * f + j(0.01), y * f + Math.sin(f * Math.PI) * 0.12, sc.z + (k.z - sc.z) * f + j(0.01), seafoam, 0.8, 1); } });
  return cl.done();
}

// ——— Liturgies of the Wild — the vigil (preview, no canonical folio yet) ———
// A ring of watchfires on a clearing, a taller central fire, sparks drifting up.
function genVigil() {
  const cl = cloud(), R = 0.72, FIRES = 7;
  const flame = (bx, bz, height, fullness) => { const n = Math.round(22 * fullness);
    for (let k = 0; k < n; k++) { const t = Math.pow(Math.random(), 0.7), fr = 0.05 * fullness * (1 - t) + 0.01, a = Math.random() * 6.2831;
      const col = t < 0.35 ? GOLD : (t < 0.7 ? OXIDE : [0.30, 0.26, 0.30]); cl.add(bx + Math.cos(a) * fr, -0.35 + t * height, bz + Math.sin(a) * fr, col, 1.1, 1); } };
  // the clearing — a faint ring on the ground
  for (let i = 0; i < 80; i++) { const a = (i / 80) * 6.2831; cl.add(Math.cos(a) * R + j(0.012), -0.4 + j(0.01), Math.sin(a) * R + j(0.012), [0.40, 0.42, 0.50], 0.85); }
  // the ring of fires, and the taller central fire
  for (let s = 0; s < FIRES; s++) { const a = (s / FIRES) * 6.2831; flame(Math.cos(a) * R, Math.sin(a) * R, 0.5, 1.0); }
  flame(0, 0, 0.8, 1.6);
  // sparks lifting into the dark
  for (let i = 0; i < 70; i++) { const s = Math.floor(Math.random() * FIRES), a = (s / FIRES) * 6.2831, t = Math.random(), centre = Math.random() < 0.35;
    const bx = centre ? 0 : Math.cos(a) * R, bz = centre ? 0 : Math.sin(a) * R; cl.add(bx + j(0.06 + t * 0.14), -0.1 + t * 0.7, bz + j(0.06 + t * 0.14), t < 0.5 ? OXIDE : [0.45, 0.55, 0.70], 0.9); }
  return cl.done();
}

// ——— La Commedia — the ascent (preview, no canonical folio yet) ———
// A terraced spiral winding up a narrowing cone toward the light, the funnel
// of the descent faintly suggested below.
function genAscent() {
  const cl = cloud(), TURNS = 4, BASE = -0.7, RISE = 1.5;
  const coneR = (t) => 0.55 * (1 - t) + 0.03;
  // the ascending path — ink cooling, warming to gold near the summit
  for (let i = 0; i < 220; i++) { const t = i / 220, ang = t * 6.2831 * TURNS + j(0.12), r = coneR(t) + j(0.02); cl.add(Math.cos(ang) * r, BASE + t * RISE, Math.sin(ang) * r, lerp3([0.55, 0.60, 0.72], GOLD, Math.pow(t, 1.6)), 1.1 + Math.random() * 0.9); }
  // the body of the mountain — a faint haze on the cone
  for (let i = 0; i < 110; i++) { const t = Math.random(), ang = Math.random() * 6.2831, r = coneR(t) * (0.8 + Math.random() * 0.25); cl.add(Math.cos(ang) * r, BASE + t * RISE, Math.sin(ang) * r, [0.35, 0.38, 0.48], 0.85); }
  // the light at the summit — the brightest cluster
  for (let k = 0; k < 30; k++) { const r = Math.pow(Math.random(), 0.6) * 0.08, a = Math.random() * 6.2831, p = Math.random() * Math.PI; cl.add(Math.sin(p) * Math.cos(a) * r, BASE + RISE + 0.06 + Math.cos(p) * r, Math.sin(p) * Math.sin(a) * r, lerp3(HOME, [1, 1, 1], 0.3), 1.5 + Math.random()); }
  // the descent — a faint funnel narrowing below the threshold
  for (let i = 0; i < 70; i++) { const t = i / 70, ang = -t * 6.2831 * 2.2 + j(0.1), r = 0.36 * (1 - t) + 0.02; cl.add(Math.cos(ang) * r, BASE - t * 0.4, Math.sin(ang) * r, [0.40, 0.30, 0.34], 0.85); }
  return cl.done();
}

// per-figure resting tilt about X (so vertical forms are seen from a little
// above) and a slow spin axis. The Odyssey sits back so we look across its sea.
const FIGURES = {
  mill:    { gen: genMill,    tilt: -0.32, scale: 0.92 },
  odyssey: { gen: genOdyssey, tilt: -1.0, scale: 1.0 },
  vigil:   { gen: genVigil,   tilt: -0.55, scale: 1.05 },
  ascent:  { gen: genAscent,  tilt: -0.18, scale: 0.92 },
};

// Cosmos treatment: scatter white / cyan / magenta sparkles and push the base
// palette toward saturated, glowing colour — skipping the authored gradients.
function cosmosify(THREE, colors, lit) {
  const c = new THREE.Color(), hsl = { h: 0, s: 0, l: 0 };
  for (let i = 0, p = 0; i < colors.length; i += 3, p++) {
    if (lit[p]) continue;
    const r = Math.random();
    if (r < 0.05) { colors[i] = 1; colors[i + 1] = 1; colors[i + 2] = 1; continue; }                                  // white sparkle
    if (r < 0.11) { c.setHSL(0.49 + Math.random() * 0.05, 0.92, 0.7); colors[i] = c.r; colors[i + 1] = c.g; colors[i + 2] = c.b; continue; }  // cyan glint
    if (r < 0.15) { c.setHSL(0.91 + Math.random() * 0.07, 0.9, 0.62); colors[i] = c.r; colors[i + 1] = c.g; colors[i + 2] = c.b; continue; }  // magenta fleck
    c.setRGB(colors[i], colors[i + 1], colors[i + 2]); c.getHSL(hsl);
    c.setHSL(hsl.h, Math.min(1, hsl.s * 1.7 + 0.28), Math.min(0.84, hsl.l * 1.34 + 0.18));
    colors[i] = c.r; colors[i + 1] = c.g; colors[i + 2] = c.b;
  }
}

const VERT = `
  attribute vec3 aColor; attribute float aSize; attribute float aPhase;
  uniform float uSize; uniform float uDpr; uniform float uTime;
  varying vec3 vCol;
  void main(){
    float tw = 0.80 + 0.20 * sin(uTime * 0.6 + aPhase);
    vCol = aColor * tw;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aSize * uDpr * (1.0 / max(0.001, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;
// soft radial glow, normal-blended so colours stay vivid on the dark card
const FRAG = `
  precision mediump float; varying vec3 vCol;
  void main(){
    vec2 d = gl_PointCoord - 0.5; float rr = length(d) * 2.0;
    if (rr > 1.0) discard;
    float a = smoothstep(1.0, 0.0, rr); a = pow(a, 1.35);
    gl_FragColor = vec4(vCol, a * 0.95);
  }
`;

function mountPointCloud(canvas, name) {
  const cfg = FIGURES[name];
  if (!cfg) return null;
  const fig = cfg.gen();

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); }
  catch (e) { return null; }
  renderer.setClearColor(0x000000, 0);   // transparent; the card supplies the dark ground
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  cam.position.set(0, 0, 3.2);

  cosmosify(THREE, fig.col, fig.lit);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(fig.pos, 3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(fig.col, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(fig.siz, 1));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(fig.pha, 1));

  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthTest: false, depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: { uSize: { value: 7.6 }, uDpr: { value: dpr }, uTime: { value: 0 } },
  });

  const group = new THREE.Group();
  group.add(new THREE.Points(geo, mat));
  group.scale.setScalar(cfg.scale);
  const baseTiltX = cfg.tilt || 0;
  group.rotation.x = baseTiltX;
  scene.add(group);

  function resize() { const w = canvas.clientWidth || 140, h = canvas.clientHeight || 140; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  resize();
  window.addEventListener('resize', resize);
  // re-size if the screen lays out after mount (e.g. inside the detail iframe)
  if (window.ResizeObserver) new ResizeObserver(() => resize()).observe(canvas);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let tx = 0, ty = 0, baseY = 0, raf = null, running = false, hovering = false;
  const clock = new THREE.Clock();
  canvas.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); tx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2); ty = (e.clientY - (r.top + r.height / 2)) / (r.height / 2); });
  // the constellation rests still and spins only while its card is hovered
  const hoverEl = canvas.closest('.bookcard') || canvas;
  hoverEl.addEventListener('pointerenter', () => { hovering = true; });
  hoverEl.addEventListener('pointerleave', () => { hovering = false; tx = 0; ty = 0; });

  function frame() {
    raf = requestAnimationFrame(frame);
    mat.uniforms.uTime.value = clock.getElapsedTime();
    if (!reduce && hovering) baseY += 0.011;   // rotate only on hover
    // spin about the figure's own vertical, then hold the resting tilt plus any pointer lean
    group.rotation.y += (baseY + tx * 0.55 - group.rotation.y) * 0.08;
    group.rotation.x += (baseTiltX + ty * 0.4 - group.rotation.x) * 0.08;
    renderer.render(scene, cam);
  }
  function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop() { if (running) { running = false; cancelAnimationFrame(raf); } }
  if ('IntersectionObserver' in window) { new IntersectionObserver((es) => { es[0].isIntersecting ? start() : stop(); }, { rootMargin: '200px' }).observe(canvas); }
  else start();

  return { start, stop };
}

window.mountPointCloud = mountPointCloud;
