/* ============================================================
   CARD SCULPTURES — volumetric point sculptures for the shelf.
   One per book: a visual metaphor in the cloud-engine treatment
   (many small ink points tracing edges, surfaces, and the fog
   inside them; accents rare), rendered on a plain 2D canvas
   with a slow idle turn. No THREE dependency: the shelf must
   stay light.

     CardSculptures.mount(canvas,
         'trireme' | 'spear' | 'wheel' | 'rosary' | 'front',
         opts?) -> { destroy(), morph(on) }

   Two treatments share one projector:

   FIGURE (no opts.title — the styleguide, plates): the sculpture
   alone, turning.

   CONDENSATION (opts.title): the card idles as its title set in
   the same ink-points, over a faint field of paper grain. Every
   point holds two homes — a place in the letterforms (or the
   grain) and a place in the figure — and morph(true) sends it
   travelling. The mapping honours ink weight: letter contours
   become the figure's strong lines, letter interiors its
   surfaces, the grain its atmosphere. Nothing appears from
   nowhere and nothing vanishes.

   Figures are built as bodies, not drawings: hollow shells with
   beam, ribbed cross-sections, and a sparse interior fog that
   lets the volume read through itself — a scan, not a sketch.

   Points live in a unit-ish local space, y up, origin at the
   figure's foot. The projector orbits azimuthally, elevation
   fixed, orthographic — the same "object on paper" feel as the
   plates, at a fraction of the cost.
   ============================================================ */
(function(){
  'use strict';

  var R=Math.random, TAU=6.2831853;
  function gj(s){ return ((R()+R()+R()+R())-2)/2*(s||1); }   // gaussian-ish jitter
  function clamp(x,a,b){ return x<a?a:(x>b?b:x); }

  /* ---------- samplers (2D-canvas twins of the cloud engine's) ---------- */
  function stroke(P,fn,n,size,a){ for(var i=0;i<=n;i++){ var p=fn(i/n);
    P.push({x:p[0]+gj(0.006),y:p[1]+gj(0.006),z:p[2]+gj(0.006),s:size,a:a}); } }
  function seg(P,A,B,n,size,a){ stroke(P,function(f){
    return [A[0]+(B[0]-A[0])*f, A[1]+(B[1]-A[1])*f, A[2]+(B[2]-A[2])*f]; },n,size,a); }
  function ring(P,r,y,n,size,a,j){ for(var i=0;i<n;i++){ var t=R()*TAU, rr=r+gj(j||0.02);
    P.push({x:Math.cos(t)*rr,y:y+gj(0.012),z:Math.sin(t)*rr,s:size,a:a}); } }
  function disc(P,r,y,n,size,a){ for(var i=0;i<n;i++){ var rr=Math.sqrt(R())*r, t=R()*TAU;
    P.push({x:Math.cos(t)*rr,y:y+gj(0.01),z:Math.sin(t)*rr,s:size,a:a}); } }
  function blob(P,cx,cy,cz,rx,ry,rz,n,size,a){ for(var i=0;i<n;i++){   // sphere SHELL
    var t=R()*TAU, z=R()*2-1, s2=Math.sqrt(1-z*z);
    P.push({x:cx+s2*Math.cos(t)*rx+gj(0.006), y:cy+z*ry+gj(0.006), z:cz+s2*Math.sin(t)*rz+gj(0.006), s:size, a:a}); } }
  function fog(P,cx,cy,cz,rx,ry,rz,n,size,a){ for(var i=0;i<n;i++){    // sphere INTERIOR — the held air
    var t=R()*TAU, z=R()*2-1, s2=Math.sqrt(1-z*z), rr=Math.pow(R(),1/3);
    P.push({x:cx+s2*Math.cos(t)*rx*rr, y:cy+z*ry*rr, z:cz+s2*Math.sin(t)*rz*rr, s:size, a:a}); } }

  /* ---------- the five figures ---------- */
  var FORMS={

    // THE ODYSSEY — the trireme as a body: a hollow hull with real
    // beam (shell, twin gunwales, keel, six ribs), fog in the hold,
    // a doubled sail with firm leeches, both banks of oars, the sea.
    trireme:function(){
      var P=[], i, f, v, y, z;
      function yTop(f){ return 0.16+0.10*Math.pow(Math.abs(f-0.5)*2,1.8); }   // sheer line
      function yBot(f){ return 0.02+0.03*Math.pow(Math.abs(f-0.5)*2,2); }     // keel line
      function hw(f){ return 0.115*Math.pow(Math.sin(Math.PI*clamp(f,0,1)),0.55); }  // half-beam
      // the hull shell: planking scattered over both sides, keel to gunwale
      for(i=0;i<720;i++){ f=R(); v=Math.pow(R(),0.75);
        y=yBot(f)+(yTop(f)-yBot(f))*v;
        z=hw(f)*Math.pow(v,0.45)*(R()<0.5?1:-1);
        P.push({x:-0.62+f*1.24+gj(0.006),y:y+gj(0.006),z:z+gj(0.006),s:0.8,a:0.45}); }
      // twin gunwales — port and starboard, the drawn edges
      [1,-1].forEach(function(side){
        stroke(P,function(f){ return [-0.62+f*1.24, yTop(f), side*hw(f)]; },95,1.15,0.9); });
      // the keel
      stroke(P,function(f){ return [-0.62+f*1.24, yBot(f), 0]; },80,1.1,0.85);
      // six ribs: cross-sections that let the eye find the volume
      [0.16,0.32,0.48,0.64,0.8,0.92].forEach(function(fs){
        for(var t=0;t<=13;t++){ var vv=t/13;
          var yy=yBot(fs)+(yTop(fs)-yBot(fs))*vv, zz=hw(fs)*Math.pow(vv,0.45);
          P.push({x:-0.62+fs*1.24+gj(0.004),y:yy+gj(0.004),z:zz+gj(0.004),s:0.85,a:0.55});
          P.push({x:-0.62+fs*1.24+gj(0.004),y:yy+gj(0.004),z:-zz+gj(0.004),s:0.85,a:0.55}); } });
      // the deck, faint
      for(i=0;i<70;i++){ f=0.06+R()*0.88;
        P.push({x:-0.62+f*1.24,y:yTop(f)-0.006,z:(R()*2-1)*hw(f)*0.85,s:0.75,a:0.3}); }
      // fog in the hold: the volume reads through itself
      for(i=0;i<130;i++){ f=0.08+R()*0.84; v=R()*0.85;
        y=yBot(f)+(yTop(f)-yBot(f))*v;
        P.push({x:-0.62+f*1.24,y:y,z:(R()*2-1)*hw(f)*Math.pow(v,0.45)*0.75,s:0.7,a:0.15+R()*0.08}); }
      // stern post curling up and back
      stroke(P,function(f){ var a=-0.4+f*1.9;
        return [0.62+Math.sin(a)*0.11-0.02, 0.24+f*0.26, 0]; },30,1.1,0.9);
      // stem + the ram, forward and low — one accent
      stroke(P,function(f){ return [-0.62-f*0.13, 0.16-f*0.10, 0]; },16,1.2,0.95);
      P.push({x:-0.76,y:0.05,z:0,s:2.6,a:1});                                 // the ram's eye
      // mast and yard
      seg(P,[0,0.2,0],[0,0.86,0],50,1.1,0.9);
      seg(P,[-0.3,0.82,0],[0.3,0.82,0],34,1.05,0.9);
      // the sail: two stipple layers a hair apart — a membrane, not a sheet
      [1,-1].forEach(function(layer){
        for(var s=0;s<160;s++){ var fx=R(), fy=R();
          var belly=Math.sin(fx*Math.PI)*0.055*(0.3+fy*0.7);
          P.push({x:-0.28+fx*0.56, y:0.80-fy*0.42, z:belly+layer*0.011+gj(0.006), s:0.85, a:0.5}); } });
      // firm leeches and foot
      [-0.28,0.28].forEach(function(lx){
        stroke(P,function(f){ var belly=Math.sin((lx+0.28)/0.56*Math.PI)*0.055*(0.3+f*0.7);
          return [lx, 0.80-f*0.42, belly]; },22,1.0,0.8); });
      stroke(P,function(f){ var belly=Math.sin(f*Math.PI)*0.055;
        return [-0.28+f*0.56, 0.38, belly]; },26,1.0,0.75);
      // both banks of oars, raked aft, a blade at each tip
      [1,-1].forEach(function(side){
        for(var o=0;o<7;o++){ var ox=-0.42+o*0.13;
          seg(P,[ox,0.10,side*0.1],[ox+0.07,-0.12,side*0.2],11,0.9,0.6);
          P.push({x:ox+0.07,y:-0.13,z:side*0.21,s:1.3,a:0.65}); } });
      // the sea: a broad dotted plane, unevenly lit
      for(i=0;i<170;i++){
        P.push({x:(R()-0.5)*1.6,y:-0.16+gj(0.012),z:(R()-0.5)*0.8,s:0.8,a:0.14+R()*0.14}); }
      return P;
    },

    // THE ILIAD — the Pelian ash spear stood upright: the shaft a
    // slim sleeve of dust around its own line, the leaf-blade a
    // two-faced surface with drawn edges, the point its accent.
    spear:function(){
      var P=[], i, f;
      // the shaft: centreline + a cylindrical sleeve
      seg(P,[0,0.05,0],[0,0.86,0],120,1.0,0.85);
      for(i=0;i<210;i++){ var yy=0.05+R()*0.81, th=R()*TAU;
        P.push({x:Math.cos(th)*0.011+gj(0.003), y:yy, z:Math.sin(th)*0.011+gj(0.003), s:0.8, a:0.6}); }
      // the leaf-blade: two faces, a midrib, firm edges
      var base=0.86, tip=1.03;
      for(i=0;i<150;i++){ f=R(); var y=base+f*(tip-base), w=0.05*Math.sin(f*Math.PI);
        P.push({x:(R()*2-1)*w, y:y+gj(0.004), z:(R()<0.5?1:-1)*0.007*(1-f*0.6)+gj(0.003), s:1.0, a:0.8}); }
      seg(P,[0,base,0],[0,tip,0],26,1.0,0.9);                                 // midrib
      [1,-1].forEach(function(side){
        stroke(P,function(f){ return [side*0.05*Math.sin(f*Math.PI), base+f*(tip-base), 0]; },20,1.05,0.9); });
      ring(P,0.03,0.85,26,1.0,0.85,0.006);                                    // the socket
      ring(P,0.024,0.82,18,0.85,0.65,0.006);
      seg(P,[0,0.05,0],[0,-0.02,0],10,1.0,0.7);                               // the butt-spike
      P.push({x:0,y:1.03,z:0,s:2.4,a:1});                                     // the point — the accent
      disc(P,0.34,0,60,0.8,0.3);                                              // the ground it stands on
      for(i=0;i<30;i++){ var rr=Math.sqrt(R())*0.3, t=R()*TAU;                 // dust settling at the base
        P.push({x:Math.cos(t)*rr,y:R()*0.06,z:Math.sin(t)*rr,s:0.7,a:0.15}); }
      return P;
    },

    // HAMLET'S MILL — the precessing wheel as a body: the rim a
    // torus of dust around its drawn edge, spokes in slim sleeves,
    // churned fog inside the wheel, the axis driven to the pole.
    wheel:function(){
      var P=[], i, th, ph, p; var tilt=0.42, ct=Math.cos(tilt), st=Math.sin(tilt);
      function tip(x,y,z){ return [x, y*ct - z*st, y*st + z*ct]; }            // tilt around x
      // the rim: a torus shell — the felloe has thickness
      for(i=0;i<300;i++){ th=R()*TAU; ph=R()*TAU;
        var rr=0.5+Math.cos(ph)*0.032;
        p=tip(Math.cos(th)*rr, Math.sin(th)*rr, Math.sin(ph)*0.032);
        P.push({x:p[0],y:0.52+p[1],z:p[2],s:0.85,a:0.55}); }
      // the rim's drawn edge
      for(i=0;i<180;i++){ th=R()*TAU;
        p=tip(Math.cos(th)*0.5, Math.sin(th)*0.5, 0);
        P.push({x:p[0]+gj(0.006),y:0.52+p[1]+gj(0.006),z:p[2]+gj(0.006),s:1.05,a:0.85}); }
      // six spokes: a drawn line in a sleeve of dust
      for(var k2=0;k2<6;k2++){ var a=k2/6*TAU;
        (function(a){ stroke(P,function(f){ p=tip(Math.cos(a)*0.5*f, Math.sin(a)*0.5*f, 0);
          return [p[0], 0.52+p[1], p[2]]; },20,0.95,0.7);
          for(var j=0;j<16;j++){ var f=R();
            p=tip(Math.cos(a)*0.5*f+gj(0.01), Math.sin(a)*0.5*f+gj(0.01), gj(0.012));
            P.push({x:p[0],y:0.52+p[1],z:p[2],s:0.8,a:0.45}); } })(a); }
      blob(P,0,0.52,0,0.05,0.05,0.05,40,1.1,0.9);                             // the hub — a dark sphere
      P.push({x:0,y:0.52,z:0,s:2.0,a:1});
      // fog churned between the spokes
      for(i=0;i<90;i++){ var r2=Math.sqrt(R())*0.46; th=R()*TAU;
        p=tip(Math.cos(th)*r2, Math.sin(th)*r2, gj(0.01));
        P.push({x:p[0],y:0.52+p[1],z:p[2],s:0.7,a:0.14+R()*0.08}); }
      // the axis through the hub, driven into the ground — in its own sleeve
      (function(){ var top=tip(0,0,-0.62), bot=tip(0,0,0.5);
        seg(P,[top[0],0.52+top[1],top[2]],[bot[0],0.52+bot[1],bot[2]],44,1.15,0.9);
        for(var j=0;j<40;j++){ var f=R();
          P.push({x:top[0]+(bot[0]-top[0])*f+gj(0.008), y:0.52+top[1]+(bot[1]-top[1])*f+gj(0.008),
                  z:top[2]+(bot[2]-top[2])*f+gj(0.008), s:0.8, a:0.5}); }
        P.push({x:top[0],y:0.52+top[1],z:top[2],s:2.4,a:1}); })();            // the pole star
      // precession: the faint torus the axis-tip describes
      for(i=0;i<150;i++){ th=R()*TAU;
        P.push({x:Math.cos(th)*0.34+gj(0.015), y:1.06+gj(0.015), z:Math.sin(th)*0.34+gj(0.015), s:0.8, a:0.4}); }
      // scattered stars, a few of them bright
      for(i=0;i<30;i++){ th=R()*TAU; var rr3=0.65+R()*0.45;
        P.push({x:Math.cos(th)*rr3, y:0.25+R()*0.9, z:Math.sin(th)*rr3*0.7,
                s:R()<0.12?1.8:0.9, a:0.4+R()*0.3}); }
      disc(P,0.55,0,80,0.85,0.3);                                             // the ground the mill stands on
      return P;
    },

    // LITURGIES OF THE WILD — the rosary: beads as small hollow
    // spheres riding the cord, the drop strand, a seed-head with
    // held air inside, and a wild aura drifting off the loop.
    rosary:function(){
      var P=[], i;
      var BEADS=21;
      function loopAt(f){ var a=f*TAU-1.5708;
        var x=Math.cos(a)*0.46, z=Math.sin(a)*0.30;
        var y=0.62+Math.sin(a)*0.14 - Math.max(0,Math.cos(a*0.5))*0.06;
        return [x,y,z]; }
      // the cord: a fine dotted line through the loop
      stroke(P,function(f){ return loopAt(f); },150,0.7,0.45);
      // the beads: small shells, not smudges
      for(i=0;i<BEADS;i++){ var p=loopAt(i/BEADS);
        blob(P,p[0],p[1],p[2],0.03,0.03,0.03,24,1.05,0.85); }
      // the drop: cord down from the loop's foot, three beads, the seed-head
      var foot=loopAt(0.5);
      seg(P,[foot[0],foot[1],foot[2]],[foot[0],0.18,foot[2]],26,0.7,0.45);
      [0.42,0.33,0.24].forEach(function(y){ blob(P,foot[0],y,foot[2],0.028,0.028,0.028,18,1.05,0.85); });
      blob(P,foot[0],0.10,foot[2],0.06,0.065,0.06,60,1.1,0.95);               // the seed-head shell
      fog(P,foot[0],0.10,foot[2],0.05,0.055,0.05,20,0.7,0.2);                 // the air held inside it
      P.push({x:foot[0],y:0.10,z:foot[2],s:2.4,a:1});                         // its heart
      // wildness: leaf-flecks drifting off the loop, and a faint halo
      for(i=0;i<70;i++){ var f2=R(), q=loopAt(f2);
        P.push({x:q[0]+gj(0.12),y:q[1]+gj(0.09),z:q[2]+gj(0.12),s:0.8,a:0.25+R()*0.15}); }
      for(i=0;i<40;i++){ var f3=R(), q2=loopAt(f3);
        P.push({x:q2[0]+gj(0.05),y:q2[1]+gj(0.05),z:q2[2]+gj(0.05),s:0.7,a:0.15}); }
      disc(P,0.4,0,50,0.8,0.3);
      return P;
    },

    // ALWAYS WITH HONOUR — the receding front: three banks of dust
    // falling back across the ground, small standing strokes still
    // in the line, a last dark standard up, the retreat trailing
    // to the rear under its own raised dust.
    front:function(){
      var P=[], i;
      // three fronts, receding in z and fading — each a BANK, not a carpet
      [[0.30,-0.30,0.9,1.05],[0.44,0.02,0.6,0.95],[0.56,0.34,0.38,0.85]].forEach(function(F){
        var r=F[0], zoff=F[1], alpha=F[2], size=F[3];
        for(i=0;i<110;i++){ var t=-1.15+R()*2.3;
          P.push({x:Math.sin(t)*r*1.35, y:0.02+R()*0.05, z:zoff+Math.cos(t)*r*0.4-r*0.4, s:size, a:alpha*0.9}); }
        // dust standing over the line
        for(i=0;i<60;i++){ var t2=-1.15+R()*2.3;
          P.push({x:Math.sin(t2)*r*1.35+gj(0.02), y:0.03+Math.pow(R(),2.2)*0.16,
                  z:zoff+Math.cos(t2)*r*0.4-r*0.4+gj(0.02), s:0.75, a:alpha*0.45}); }
        // the men: small standing strokes still holding
        for(i=0;i<22;i++){ var t3=-1.15+R()*2.3;
          var mx=Math.sin(t3)*r*1.35, mz=zoff+Math.cos(t3)*r*0.4-r*0.4;
          seg(P,[mx,0.02,mz],[mx,0.10+R()*0.04,mz],5,0.85,alpha*0.8); } });
      // the standard: one upright still held at the first front — the accent
      seg(P,[0,0.05,-0.42],[0,0.62,-0.42],30,1.15,0.95);
      [1,-1].forEach(function(layer){                                          // the flag: two layers
        for(i=0;i<24;i++){ var fx=R()*0.16, fy=R()*0.10;
          P.push({x:0.02+fx, y:0.60-fy-fx*0.12, z:-0.42+layer*0.006+gj(0.004), s:1.0, a:0.9}); } });
      P.push({x:0,y:0.62,z:-0.42,s:2.3,a:1});
      // the line of retreat: a dotted path trailing back and thinning
      stroke(P,function(f){ return [0.05+Math.sin(f*2.2)*0.16, 0.03, -0.30+f*1.05]; },60,0.85,0.5);
      for(i=0;i<24;i++){ var f3=0.3+R()*0.7;                                   // stragglers on it
        P.push({x:0.05+Math.sin(f3*2.2)*0.16+gj(0.05), y:0.06+R()*0.05, z:-0.30+f3*1.05, s:1.0, a:0.55*(1-f3*0.5)}); }
      for(i=0;i<40;i++){ var f4=0.2+R()*0.8;                                   // dust the retreat raises
        P.push({x:0.05+Math.sin(f4*2.2)*0.16+gj(0.08), y:0.05+R()*0.11, z:-0.30+f4*1.05+gj(0.05), s:0.7, a:0.2*(1-f4*0.4)}); }
      disc(P,0.7,0,80,0.8,0.28);
      return P;
    }
  };

  /* ---------- idle motion: only bodies that sit IN something move ---------- */
  var MOTION={ trireme:{roll:0.035,bob:0.014} };

  /* ---------- the title sampler: letterforms as ink points ----------
     Edge-weighted: glyph contours are dense, dark, and nearly unjittered
     (they hold the serifs); interiors are a lighter stipple fill inside
     a firm outline — the same grammar as the figures. */
  function splitTitle(t){
    if(t.length<=14) return [t];
    var words=t.split(' '); if(words.length<2) return [t];
    var best=null, mid=t.length/2, acc=0;
    for(var i=0;i<words.length-1;i++){ acc+=words[i].length+1;
      if(best===null||Math.abs(acc-mid)<Math.abs(best.acc-mid)) best={i:i,acc:acc}; }
    return [words.slice(0,best.i+1).join(' '), words.slice(best.i+1).join(' ')];
  }
  /* the reference title 'The Odyssey' sets the glyph scale for the whole
     shelf: every title is sampled at the same font size and mapped through
     this one ink-width, so a short title and a long one share a cap-height. */
  function refInkWidth(fontFamily,fs){
    var W=1600,H=320, oc=document.createElement('canvas'); oc.width=W; oc.height=H;
    var g=oc.getContext('2d');
    g.fillStyle='#000'; g.textAlign='center'; g.textBaseline='middle';
    g.font='500 '+fs+'px '+fontFamily;
    g.fillText('The Odyssey',W/2,H/2);
    var d=g.getImageData(0,0,W,H).data, minx=1e9, maxx=-1e9;
    for(var y=0;y<H;y+=3) for(var x=0;x<W;x+=3){
      if(d[(y*W+x)*4+3]>128){ if(x<minx)minx=x; if(x>maxx)maxx=x; } }
    return Math.max(1,maxx-minx);
  }
  function sampleTitle(text,fontFamily){
    var W=1600,H=520;
    var oc=document.createElement('canvas'); oc.width=W; oc.height=H;
    var g=oc.getContext('2d');
    var lines=splitTitle(text);
    var fs=190;   // one glyph size for every card — The Odyssey is the reference
    g.fillStyle='#000'; g.textAlign='center'; g.textBaseline='middle';
    g.font='500 '+fs+'px '+fontFamily;
    if(lines.length===1) g.fillText(lines[0],W/2,H/2);
    else { g.fillText(lines[0],W/2,H/2-fs*0.56); g.fillText(lines[1],W/2,H/2+fs*0.56); }
    var d=g.getImageData(0,0,W,H).data, step=3;
    function on(x,y){ if(x<0||y<0||x>=W||y>=H) return false; return d[(y*W+x)*4+3]>128; }
    var edges=[], inner=[];
    for(var y=0;y<H;y+=step) for(var x=0;x<W;x+=step){
      if(!on(x,y)) continue;
      var isEdge=!on(x-step,y)||!on(x+step,y)||!on(x,y-step)||!on(x,y+step);
      (isEdge?edges:inner).push({x:x,y:y});
    }
    while(edges.length>1000){ edges.splice(Math.floor(R()*edges.length),1); }
    var innerTarget=Math.max(0,1550-edges.length);
    while(inner.length>innerTarget){ inner.splice(Math.floor(R()*inner.length),1); }
    var pts=edges.map(function(p){ return {x:p.x,y:p.y,e:1}; })
      .concat(inner.map(function(p){ return {x:p.x,y:p.y,e:0}; }));
    if(!pts.length) return pts;
    var minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9;
    pts.forEach(function(p){ if(p.x<minx)minx=p.x; if(p.x>maxx)maxx=p.x;
      if(p.y<miny)miny=p.y; if(p.y>maxy)maxy=p.y; });
    var cw=(minx+maxx)/2, ch=(miny+maxy)/2;
    var scale=1.34/refInkWidth(fontFamily,fs);   // fixed to the reference title, so all titles match
    return pts.map(function(p){ var j=p.e?0.0012:0.0035;
      return {x:(p.x-cw)*scale+gj(j), y:-(p.y-ch)*scale+gj(j), e:p.e}; });
  }

  /* ---------- the projector: slow azimuthal turn, fixed elevation ---------- */
  function mount(canvas,form,opts){
    opts=opts||{};
    var sculpt=(FORMS[form]||FORMS.trireme)().sort(function(a,b){ return b.a-a.a; });
    var ink=opts.ink||[27,25,22];
    var el=(opts.el==null)?0.34:opts.el, ce=Math.cos(el), se=Math.sin(el);
    var az=R()*TAU, speed=(opts.speed==null)?0.0028:opts.speed;
    var motion=MOTION[form]||null;
    var alive=true, visible=true, raf=0;
    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced) speed=0;

    // centre the figure vertically once
    var minY=1e9,maxY=-1e9;
    sculpt.forEach(function(p){ if(p.y<minY)minY=p.y; if(p.y>maxY)maxY=p.y; });
    var cy=(minY+maxY)/2;

    /* ----- the condensation: two homes per point ----- */
    var titled=!!opts.title, pts=null, target=0, g2=0;
    var font=opts.font||"'Cormorant Garamond',Georgia,serif";
    var FIELD=(opts.field==null)?380:opts.field;
    function buildPts(){
      var title=sampleTitle(opts.title,font), out=[], i;
      for(i=0;i<title.length;i++){ var t=title[i];
        out.push({kind:'t',t:t,ra:t.e?0.95:0.6,rs:t.e?1.05:0.85,
          d:(t.x+0.67)/1.34*0.2+R()*0.06,ph:R()*TAU}); }
      for(i=0;i<FIELD;i++)
        out.push({kind:'f',t:{fx:R(),fy:R()},ra:0.13+R()*0.12,rs:0.8,
          d:R()*0.28,ph:R()*TAU});
      // rank-match by ink weight: darkest rest ink -> darkest figure ink
      out.sort(function(a,b){ return b.ra-a.ra; });
      for(i=0;i<out.length;i++){
        var h=sculpt[Math.min(sculpt.length-1,Math.floor(i*sculpt.length/out.length))];
        out[i].s={x:h.x+gj(0.003),y:h.y+gj(0.003),z:h.z+gj(0.003),s:h.s,a:h.a}; }
      pts=out;
    }
    if(titled){
      buildPts();
      // the serif arrives late on a cold cache: resample once it lands
      if(document.fonts&&document.fonts.load)
        document.fonts.load('500 190px "Cormorant Garamond"').then(function(){
          if(alive) buildPts(); }).catch(function(){});
    }

    var last=null;
    function draw(ts){
      if(!alive) return;
      if(!visible){ raf=0; return; }
      if(last==null) last=ts;
      var dt=Math.min(0.05,((ts-last)||16)/1000); last=ts;
      if(titled){
        var dir=target>g2?1:-1;
        if(g2!==target){ g2+=dir*dt/0.95;
          if(dir>0&&g2>target)g2=target; if(dir<0&&g2<target)g2=target; }
        if(reduced) g2=target;
      } else g2=1;
      var dpr=Math.min(window.devicePixelRatio||1,2);
      var w=canvas.clientWidth||1, h=canvas.clientHeight||1;
      if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){
        canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr); }
      var g=canvas.getContext('2d');
      g.setTransform(dpr,0,0,dpr,0,0); g.clearRect(0,0,w,h);
      var sc=titled ? Math.min(w/1.55,h/1.15)*0.9
                    : Math.min(w,h)*((opts.scale==null)?0.52:opts.scale);
      var cx=w/2, cyy=titled?h/2-8:h/2;
      var ca=Math.cos(az), sa=Math.sin(az);
      var time=ts/1000;
      var roll=(motion&&!reduced)?Math.sin(time*0.5)*motion.roll*g2:0;
      var cr=Math.cos(roll), sr=Math.sin(roll);
      var bob=(motion&&!reduced)?Math.sin(time*0.8)*motion.bob*g2:0;
      var i,p,rx,rz,sy,rx2,sy2,sxp,syp,depth,sAlpha,px,py,size,a;
      if(titled){
        for(i=0;i<pts.length;i++){ p=pts[i];
          var e=(function(x){ return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2; })(
            clamp((g2-p.d)/0.72,0,1));
          rx=p.s.x*ca-p.s.z*sa; rz=p.s.x*sa+p.s.z*ca; sy=p.s.y-cy+bob;
          rx2=rx*cr-sy*sr; sy2=rx*sr+sy*cr;
          sxp=cx+rx2*sc; syp=cyy-(sy2*ce-rz*se)*sc;
          depth=(rz*ce+sy2*se);
          sAlpha=p.s.a*(0.6+0.4*clamp(0.5-depth*0.7,0,1));
          var txp,typ;
          if(p.kind==='t'){
            var shim=reduced?0:Math.sin(time*0.6+p.ph)*0.3;
            txp=cx+p.t.x*sc*0.86; typ=cyy-p.t.y*sc*0.86+shim;
          }else{
            var dx=reduced?0:Math.sin(time*0.07+p.ph)*4,
                dy=reduced?0:Math.cos(time*0.05+p.ph*1.7)*4;
            txp=p.t.fx*w+dx; typ=p.t.fy*h+dy;
          }
          px=txp+(sxp-txp)*e; py=typ+(syp-typ)*e;
          size=p.rs+(p.s.s*(1-depth*0.28)-p.rs)*e;
          a=p.ra+(sAlpha-p.ra)*e;
          g.fillStyle='rgba('+ink[0]+','+ink[1]+','+ink[2]+','+a.toFixed(3)+')';
          g.fillRect(px-size/2,py-size/2,size,size);
        }
        az+=speed*(0.15+0.85*g2);
      }else{
        for(i=0;i<sculpt.length;i++){ p=sculpt[i];
          rx=p.x*ca-p.z*sa; rz=p.x*sa+p.z*ca; sy=p.y-cy+bob;
          rx2=rx*cr-sy*sr; sy2=rx*sr+sy*cr;
          px=cx+rx2*sc; py=cyy-(sy2*ce-rz*se)*sc;
          depth=(rz*ce+sy2*se);
          a=p.a*(0.6+0.4*clamp(0.5-depth*0.7,0,1));
          g.fillStyle='rgba('+ink[0]+','+ink[1]+','+ink[2]+','+a.toFixed(3)+')';
          size=p.s*(1-depth*0.28);
          g.fillRect(px-size/2,py-size/2,size,size);
        }
        az+=speed;
      }
      raf=requestAnimationFrame(draw);
    }

    var io=null;
    if(window.IntersectionObserver){
      io=new IntersectionObserver(function(en){
        var v=en[0]&&en[0].isIntersecting;
        if(v && !visible){ visible=true; last=null; if(!raf) raf=requestAnimationFrame(draw); }
        else if(!v){ visible=false; }
      });
      io.observe(canvas);
    }
    draw(performance.now());   // first frame synchronously — the card exists before rAF ticks
    return {
      morph:function(on){ target=on?1:0; },
      destroy:function(){ alive=false; if(raf)cancelAnimationFrame(raf); if(io)io.disconnect(); }
    };
  }

  window.CardSculptures={ mount:mount, forms:Object.keys(FORMS) };
})();
