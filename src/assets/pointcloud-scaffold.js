// =========================================================================
// pointcloud-scaffold.js — a reusable volumetric point-cloud figure.
//
// A self-contained recipe for a glowing, twinkling WebGL point cloud that
// renders on any background, animates only while on-screen, spins gently on
// hover, and respects reduced-motion. Copy this in and replace ONE thing:
// the generator function (see genExample). Everything else is reusable.
//
//   import { mountPointCloud } from './pointcloud-scaffold.js';
//   mountPointCloud(canvasEl, genExample);          // or a named generator
//
// Assumes a global THREE (r128 UMD is a safe baseline for this shader style).
// Using a bundler? Swap `const THREE = window.THREE` for an import; the
// geometry, shaders, and loop are unchanged.
// =========================================================================
const THREE = window.THREE;

// ——— small helpers ———
const j   = (a) => (Math.random() * 2 - 1) * a;                 // uniform jitter ±a
const rnd = () => (Math.random() + Math.random() + Math.random()) / 3; // soft bell, clusters to centre
const lerp3 = (a, b, f) => [a[0]+(b[0]-a[0])*f, a[1]+(b[1]-a[1])*f, a[2]+(b[2]-a[2])*f];

// ——— the cloud accumulator ———
// add(x,y,z, colour[, size, literal]) appends one point.
//   size   : ~0.8 substrate · 1.2–2.0 accents
//   literal: 1 marks an AUTHORED colour the treatment pass must leave alone
//            (a path, a heat ramp); 0 (default) is fair game for sparkles.
function cloud() {
  const P = [], C = [], S = [], PH = [], L = [];
  return {
    add(x, y, z, c, size = 1, literal = 0) {
      P.push(x, y, z); C.push(c[0], c[1], c[2]); S.push(size);
      PH.push(Math.random() * 6.28); L.push(literal);
    },
    done: () => ({
      pos: new Float32Array(P), col: new Float32Array(C),
      siz: new Float32Array(S), pha: new Float32Array(PH), lit: new Float32Array(L),
    }),
  };
}

// ——— EXAMPLE GENERATOR — replace this with your own form ———
// A layered sphere: faint substrate haze, a dense bright core, a scatter of
// glowing accents, and a dim edge halo. The four-pass structure (substrate /
// core / accents / halo) generalizes to almost any figure.
function genExample() {
  const cl = cloud();
  const COOL = [0.42, 0.60, 0.86], WARM = [0.90, 0.78, 0.42], HOT = [1.0, 0.96, 0.86];
  // substrate — a soft diffuse cloud filling the volume
  for (let i = 0; i < 500; i++) {
    const r = 0.9 * Math.cbrt(Math.random()), th = Math.random() * 6.2831, ph = Math.acos(2 * Math.random() - 1);
    cl.add(r*Math.sin(ph)*Math.cos(th), r*Math.cos(ph), r*Math.sin(ph)*Math.sin(th),
           lerp3(COOL, WARM, rnd()), 0.9 + Math.random() * 0.5);
  }
  // core — a dense bright centre carrying the main mass
  for (let i = 0; i < 160; i++) {
    const r = 0.35 * Math.pow(Math.random(), 1.6), th = Math.random() * 6.2831, ph = Math.acos(2*Math.random()-1);
    cl.add(r*Math.sin(ph)*Math.cos(th), r*Math.cos(ph), r*Math.sin(ph)*Math.sin(th), HOT, 1.4 + Math.random());
  }
  // accents — a handful of glowing knots on the shell
  for (let k = 0; k < 14; k++) {
    const th = Math.random() * 6.2831, ph = Math.acos(2*Math.random()-1), r = 0.85;
    const cx = r*Math.sin(ph)*Math.cos(th), cy = r*Math.cos(ph), cz = r*Math.sin(ph)*Math.sin(th);
    for (let n = 0; n < 12; n++) cl.add(cx+j(0.06), cy+j(0.06), cz+j(0.06), WARM, 1.6 + Math.random());
  }
  // halo — a dim edge haze so the form doesn't end abruptly
  for (let i = 0; i < 120; i++) {
    const r = 1.0 + Math.abs(rnd()*2-1)*0.4, th = Math.random()*6.2831, ph = Math.acos(2*Math.random()-1);
    cl.add(r*Math.sin(ph)*Math.cos(th), r*Math.cos(ph), r*Math.sin(ph)*Math.sin(th), COOL.map(v=>v*0.7), 0.8);
  }
  return cl.done();
}

// ——— treatment: turn data into a cosmos ———
// Scatter white / accent-hue sparkles, then push base colours toward saturated
// glow in HSL (saturate AND lift — raw RGB brightening greys out). Skips
// literal-flagged authored gradients.
function treat(colors, lit) {
  const c = new THREE.Color(), hsl = { h: 0, s: 0, l: 0 };
  for (let i = 0, p = 0; i < colors.length; i += 3, p++) {
    if (lit[p]) continue;
    const r = Math.random();
    if (r < 0.05) { colors[i] = colors[i+1] = colors[i+2] = 1; continue; }                 // white sparkle
    if (r < 0.11) { c.setHSL(0.55, 0.9, 0.7); colors[i]=c.r; colors[i+1]=c.g; colors[i+2]=c.b; continue; } // accent glint
    c.setRGB(colors[i], colors[i+1], colors[i+2]); c.getHSL(hsl);
    c.setHSL(hsl.h, Math.min(1, hsl.s * 1.7 + 0.28), Math.min(0.84, hsl.l * 1.34 + 0.18));
    colors[i] = c.r; colors[i+1] = c.g; colors[i+2] = c.b;
  }
}

// ——— shaders ———
// Vertex: per-point twinkle + depth-attenuated size (the depth parallax is most
// of the "volume" read).
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
  }`;
// Fragment: soft radial glow with a tight hot core; discard outside the disc.
const FRAG = `
  precision mediump float; varying vec3 vCol;
  void main(){
    vec2 d = gl_PointCoord - 0.5; float rr = length(d) * 2.0;
    if (rr > 1.0) discard;
    float a = smoothstep(1.0, 0.0, rr); a = pow(a, 1.35);
    gl_FragColor = vec4(vCol, a * 0.95);
  }`;

// ——— mount ———
// generator: a function returning {pos,col,siz,pha,lit}. opts.tilt / opts.scale
// set the resting pose; opts.hoverSelector picks the element whose hover drives
// the spin (defaults to the canvas).
function mountPointCloud(canvas, generator, opts = {}) {
  const fig = generator();

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); }
  catch (e) { return null; }
  renderer.setClearColor(0x000000, 0);                          // transparent; page supplies the ground
  const dpr = Math.min(window.devicePixelRatio || 1, 2);        // cap DPR at 2
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(34, 1, 0.1, 100);     // modest FOV keeps depth honest
  cam.position.set(0, 0, 3.2);

  treat(fig.col, fig.lit);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(fig.pos, 3));
  geo.setAttribute('aColor',   new THREE.BufferAttribute(fig.col, 3));
  geo.setAttribute('aSize',    new THREE.BufferAttribute(fig.siz, 1));
  geo.setAttribute('aPhase',   new THREE.BufferAttribute(fig.pha, 1));

  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG,
    transparent: true, depthTest: false, depthWrite: false,     // glow: no self-occlusion
    blending: THREE.NormalBlending,                             // swap to AdditiveBlending for a hotter look
    uniforms: { uSize: { value: 7.6 }, uDpr: { value: dpr }, uTime: { value: 0 } },
  });

  const group = new THREE.Group();
  group.add(new THREE.Points(geo, mat));
  group.scale.setScalar(opts.scale || 1);
  const baseTiltX = opts.tilt || 0;
  group.rotation.x = baseTiltX;
  scene.add(group);

  function resize() {
    const w = canvas.clientWidth || 140, h = canvas.clientHeight || 140;
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
  if (window.ResizeObserver) new ResizeObserver(() => resize()).observe(canvas); // re-fit on late layout

  renderer.render(scene, cam);   // paint one static frame now, so there's no empty-canvas
                                 // flash before the loop starts (or if it never does, e.g.
                                 // reduced-motion, or a browser that throttles rAF offscreen)

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let tx = 0, ty = 0, spin = 0, raf = null, running = false, hovering = false;
  const clock = new THREE.Clock();
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    tx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    ty = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
  });
  const hoverEl = (opts.hoverSelector && canvas.closest(opts.hoverSelector)) || canvas;
  hoverEl.addEventListener('pointerenter', () => { hovering = true; });
  hoverEl.addEventListener('pointerleave', () => { hovering = false; tx = 0; ty = 0; });

  function frame() {
    raf = requestAnimationFrame(frame);
    mat.uniforms.uTime.value = clock.getElapsedTime();
    if (!reduce && hovering) spin += 0.011;                     // rest still; spin on hover
    group.rotation.y += (spin + tx * 0.55 - group.rotation.y) * 0.08;
    group.rotation.x += (baseTiltX + ty * 0.4 - group.rotation.x) * 0.08;
    renderer.render(scene, cam);
  }
  function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop()  { if (running)  { running = false; cancelAnimationFrame(raf); } }
  // gate on viewport — never animate an offscreen canvas
  if ('IntersectionObserver' in window)
    new IntersectionObserver((es) => { es[0].isIntersecting ? start() : stop(); }, { rootMargin: '200px' }).observe(canvas);
  else start();

  return { start, stop };
}

export { mountPointCloud, cloud, genExample, j, rnd, lerp3 };
if (typeof window !== 'undefined') window.mountPointCloud = mountPointCloud;
