/* ============================================================
   CLOUD ENGINE — the shared e-ink point-cloud language.
   One ink, one shader, one way of moving. Every Asterlogos
   perception (the field, the atlas, the plates) speaks through
   this file so "the field look" has a single source of truth.

   The treatment, in three roles:
     dust    ~0.7        context — sea, ground, drift
     body    ~0.9–1.3    structure — many small points tracing
                         edges and surfaces, never fat fills
     accent  ~2.2–2.6    punctuation — an eye, a tie, an
                         arrowhead; full ink, and rare

   mark ids: 1 disc · 2 stipple · 3 dblring · 4 cross · 5 ring ·
             6 blot · 7 bar · 8 square · 9 routedot · 0 pinprick
   ============================================================ */
(function(){
  'use strict';

  /* ---------- ink ---------- */
  const INK_FULL=[0.105,0.098,0.086];   // #1b1916
  const INK_SOFT=[0.224,0.208,0.180];   // #39352e
  const INK_MID =[0.36,0.34,0.30];
  const GHOST   =[0.604,0.584,0.541];   // #9a958a
  const FAINT   =[0.70,0.68,0.63];
  const PAPER   =[0.906,0.894,0.859];   // #e7e4db
  const IFK=INK_FULL;                    // shorthand for signature details

  /* ---------- chance ---------- */
  const R=()=>Math.random();
  const gj=s=>((R()+R()+R()+R())-2)/2*(s||1);   // gaussian-ish jitter

  /* ---------- samplers: points ON forms, not inside them ---------- */
  function sdir(){ const t=R()*6.2831, z=R()*2-1, s=Math.sqrt(1-z*z); return [s*Math.cos(t),z,s*Math.sin(t)]; }
  function pRing(rad,j,y){ const t=R()*6.2831, rr=rad+gj(j||0.03); return [Math.cos(t)*rr, y||0, Math.sin(t)*rr]; }
  function pDisc(rad,y){ const rr=Math.sqrt(R())*rad, t=R()*6.2831; return [Math.cos(t)*rr, y||0, Math.sin(t)*rr]; }
  function pCol(rad,h,j){ const t=R()*6.2831, rr=rad+gj(j||0.02); return [Math.cos(t)*rr, R()*h, Math.sin(t)*rr]; }
  const pWall=pCol;
  // legacy cone (uniform in height — top-heavy per area); kept for compatibility
  function pCone(rb,h,j){ const f=R(), y=f*h, rad=rb*(1-f); const t=R()*6.2831;
    return [Math.cos(t)*(rad+gj(j||0.02)), y, Math.sin(t)*(rad+gj(j||0.02))]; }
  // area-correct cone SHELL — density even across the slope, base-heavy
  function pConeShell(rb,h,j){ const f=1-Math.sqrt(R()), y=f*h, rad=rb*(1-f); const t=R()*6.2831;
    return [Math.cos(t)*(rad+gj(j||0.02)), y, Math.sin(t)*(rad+gj(j||0.02))]; }
  // surface of revolution from a [f,radius] profile (uniform in height)
  function pProfile(profile,h,j){ const f=R(); return _profAt(profile,f,h,j); }
  // area-correct profile SHELL — wide latitudes get their share of points
  function pProfileShell(profile,h,j){
    let maxR=0; profile.forEach(p=>{ if(p[1]>maxR) maxR=p[1]; });
    let f=R(), guard=0;
    while(guard++<24){ f=R(); if(R() < _profRad(profile,f)/maxR) break; }
    return _profAt(profile,f,h,j);
  }
  function _profRad(profile,f){ let rad=profile[profile.length-1][1];
    for(let i=0;i<profile.length-1;i++){ const a=profile[i],b=profile[i+1];
      if(f>=a[0]&&f<=b[0]){ const lt=(f-a[0])/(b[0]-a[0]); rad=a[1]+(b[1]-a[1])*lt; break; } }
    return rad; }
  function _profAt(profile,f,h,j){ const rad=_profRad(profile,f);
    const t=R()*6.2831, rr=rad+gj(j||0.015); return [Math.cos(t)*rr, f*h, Math.sin(t)*rr]; }

  /* ---------- strokes: drawn ink lines in 3D ---------- */
  function pEll(e,cx,cy,cz,rx,ry,rz,n,size,mark,col){
    for(let i=0;i<n;i++){ const d=sdir(); e(cx+d[0]*rx+gj(0.012),cy+d[1]*ry+gj(0.012),cz+d[2]*rz+gj(0.012),size,mark,col); } }
  function stroke(e,fn,n,size,mark,col,j){ j=(j==null)?0.012:j;
    for(let i=0;i<=n;i++){ const p=fn(i/n); e(p[0]+gj(j),p[1]+gj(j),p[2]+gj(j),size,mark,col); } }
  function seg(e,a,b,n,size,mark,col,j){ stroke(e,f=>[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f],n,size,mark,col,j); }
  // auto-densified stroke: the rule "gap smaller than the dot" made code.
  // spacing is the inter-point distance in local units (~0.014 for body ink).
  function strokeD(e,fn,spacing,size,mark,col,j){
    let len=0, prev=fn(0);
    for(let i=1;i<=32;i++){ const p=fn(i/32);
      len+=Math.hypot(p[0]-prev[0],p[1]-prev[1],p[2]-prev[2]); prev=p; }
    stroke(e,fn,Math.max(6,Math.ceil(len/(spacing||0.016))),size,mark,col,j);
  }
  function segD(e,a,b,spacing,size,mark,col,j){
    strokeD(e,f=>[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f],spacing,size,mark,col,j); }

  /* ---------- the shader pair ----------
     Lens emphasis (uLens = aspect id, -1 off) darkens the matched
     aspect and lifts the rest toward paper. vPx carries the rendered
     size so signature marks can gracefully collapse to plain dots
     when they are too small to resolve — resolution over ornament. */
  const PT_VERT=`
    attribute vec3 aColor; attribute float aSize; attribute float aAspect; attribute float aMark;
    uniform float uTime,uLens,uLensStrength,uSizeScale;
    varying vec3 vCol; varying float vMark; varying float vFade; varying float vPx;
    void main(){
      float match=step(abs(aAspect-uLens),0.5);
      float lensActive=step(0.0,uLens);
      float k=uLensStrength*lensActive;
      float emph=mix(1.0, mix(1.6,1.0,match), k);   // unmatched lift toward paper
      float szf=mix(1.0, mix(0.7,1.25,match), k);
      vMark=aMark;
      vFade=mix(1.0, mix(0.32,1.0,match), k);
      vCol=aColor*emph;
      vec4 mv=modelViewMatrix*vec4(position,1.0);
      gl_PointSize=aSize*szf*uSizeScale*(16.0/-mv.z);
      vPx=gl_PointSize;
      gl_Position=projectionMatrix*mv;
    }`;
  const PT_FRAG=`
    precision highp float;
    varying vec3 vCol; varying float vMark; varying float vFade; varying float vPx;
    uniform vec3 uPaper; uniform float uAlpha;
    void main(){
      vec2 c=(gl_PointCoord-0.5)*2.0; float r=length(c);
      float ink=0.0; int m=int(vMark+0.5);
      if(m==1){ ink=1.0-smoothstep(0.72,0.92,r); }                       // filled disc
      else if(m==5){ ink=1.0-smoothstep(0.10,0.20,abs(r-0.62)); }        // hollow ring
      else if(m==3){ float a1=1.0-smoothstep(0.07,0.15,abs(r-0.34));     // double ring
        float a2=1.0-smoothstep(0.07,0.15,abs(r-0.74)); ink=max(a1,a2); }
      else if(m==4){ float bx=1.0-smoothstep(0.14,0.26,abs(c.x));        // cross
        float by=1.0-smoothstep(0.14,0.26,abs(c.y));
        float arm=1.0-smoothstep(0.86,1.02,r); ink=max(bx,by)*arm; }
      else if(m==8){ float sq=max(abs(c.x),abs(c.y));                    // open square
        ink=1.0-smoothstep(0.09,0.18,abs(sq-0.66)); }
      else if(m==7){ float bar=1.0-smoothstep(0.18,0.30,abs(c.y));       // short bar
        float len=1.0-smoothstep(0.78,0.96,abs(c.x)); ink=bar*len; }
      else if(m==6){ float wob=0.78+0.10*sin(atan(c.y,c.x)*5.0);         // heavy blot
        ink=1.0-smoothstep(wob-0.18,wob,r); }
      else if(m==2){ ink=(1.0-smoothstep(0.30,0.66,r))*0.85; }           // fine stipple
      else if(m==9){ ink=1.0-smoothstep(0.45,0.78,r); }                  // route dot
      else { ink=1.0-smoothstep(0.22,0.5,r); }                           // pinprick
      // mark LOD: below ~8 rendered px the signatures smudge — become a dot
      if(m==3||m==4||m==5||m==6||m==8){
        float lod=smoothstep(5.5,9.0,vPx);
        float dt=1.0-smoothstep(0.40,0.72,r);
        ink=mix(dt,ink,lod);
      }
      if(ink<=0.003) discard;
      vec3 col=mix(uPaper,vCol,clamp(vFade,0.0,1.0));
      float a=ink*uAlpha*(0.55+0.45*clamp(vFade,0.0,1.0));
      gl_FragColor=vec4(col,a);
    }`;

  function makePointMaterial(THREE,opts){
    opts=opts||{};
    return new THREE.ShaderMaterial({
      vertexShader:PT_VERT, fragmentShader:PT_FRAG,
      uniforms:{
        uTime:{value:0}, uLens:{value:-1}, uLensStrength:{value:0},
        uSizeScale:{value:Math.min(window.devicePixelRatio||1,2)},
        uPaper:{value:new THREE.Vector3(PAPER[0],PAPER[1],PAPER[2])},
        uAlpha:{value:(opts.alpha==null)?1.0:opts.alpha}
      },
      transparent:true, depthWrite:false, depthTest:true,
      blending:THREE.NormalBlending, fog:false
    });
  }

  /* ---------- coalescence: the gravitational settle ----------
     Every point starts flung outward and eases home, each on its
     own small delay, so the form condenses like dust into a body
     rather than crossfading. Call update(dt) each frame; it
     returns false once settled (and stops touching the buffer).
       makeCoalescence(geo,{spread, stagger, duration, center})
       · spread   how far points are flung (world units)
       · stagger  0..0.9 — fraction of the run spent staggering starts
       · center   [x,y,z] — radial burst origin (a plate condensing);
                  omitted = loose spherical scatter (the field intro) */
  function makeCoalescence(geo,opts){
    opts=opts||{};
    const spread=(opts.spread==null)?6:opts.spread;
    const stagger=(opts.stagger==null)?0.45:opts.stagger;
    const dur=(opts.duration==null)?1.6:opts.duration;
    const center=opts.center||null;
    const pos=geo.attributes.position, n=pos.count;
    const target=pos.array.slice();
    const scatter=new Float32Array(target.length);
    const delay=new Float32Array(n);
    for(let i=0;i<n;i++){
      const ix=i*3; let dx,dy,dz;
      if(center){
        dx=target[ix]-center[0]; dy=target[ix+1]-center[1]; dz=target[ix+2]-center[2];
        const L=Math.hypot(dx,dy,dz)||1, m=spread*(0.35+R()*0.65)/L;
        dx*=m; dy*=m; dz*=m;
      } else {
        const t=R()*6.2831, ph=Math.acos(R()*2-1), rr=spread*(0.5+R()*0.5);
        dx=Math.sin(ph)*Math.cos(t)*rr*0.4; dy=Math.cos(ph)*rr*0.3; dz=Math.sin(ph)*Math.sin(t)*rr*0.4;
      }
      scatter[ix]=target[ix]+dx; scatter[ix+1]=target[ix+1]+dy; scatter[ix+2]=target[ix+2]+dz;
      delay[i]=R()*stagger;
    }
    pos.array.set(scatter); pos.needsUpdate=true;
    let e=0, done=false;
    const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
    return {
      update(dt){
        if(done) return false;
        e+=dt/dur;
        if(e>=1){ pos.array.set(target); pos.needsUpdate=true; done=true; return false; }
        const arr=pos.array, span=1-stagger;
        for(let i=0;i<n;i++){
          const k=ease(Math.min(1,Math.max(0,(e-delay[i])/span)));
          const ix=i*3;
          arr[ix]  =scatter[ix]  +(target[ix]  -scatter[ix])*k;
          arr[ix+1]=scatter[ix+1]+(target[ix+1]-scatter[ix+1])*k;
          arr[ix+2]=scatter[ix+2]+(target[ix+2]-scatter[ix+2])*k;
        }
        pos.needsUpdate=true; return true;
      },
      progress(){ return done?1:Math.min(1,e); },
      finish(){ pos.array.set(target); pos.needsUpdate=true; done=true; }
    };
  }

  window.CloudEngine={
    INK_FULL,INK_SOFT,INK_MID,GHOST,FAINT,PAPER,IFK,
    R,gj,sdir,pRing,pDisc,pCol,pWall,pCone,pConeShell,pProfile,pProfileShell,
    pEll,stroke,strokeD,seg,segD,
    PT_VERT,PT_FRAG,makePointMaterial,makeCoalescence
  };
})();
