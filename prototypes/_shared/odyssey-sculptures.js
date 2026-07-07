/* ============================================================
   ODYSSEY — SCULPTURES  (the engraved knot-figures)

   One volumetric metaphor per node: episodes (Troy’s horse, the
   Cyclops’ eye, the Nekuia throat) AND the cast (Zeus’ bolt,
   Poseidon’s trident, Penelope’s loom, the gate of the dead).
   Extracted from the live instrument (prototypes/odyssey-sculptural)
   so every surface — the folio, the manifesto — draws the SAME
   figures from ONE definition. Consumes the shared cloud engine.

     <script src=".../_shared/cloud-engine.js"></script>
     <script src=".../_shared/odyssey-sculptures.js"></script>
     var S = window.OdysseySculptures;   // { SCULPT, aspectInk }

   Each builder is fn(k, e) where e(dx,dy,dz,size,mark,colOverride)
   places a point in LOCAL space (origin-centred); the caller decides
   where that origin sits and at what scale.
   ============================================================ */
(function(){
  "use strict";
  var CE = window.CloudEngine;
  if(!CE){ throw new Error("odyssey-sculptures.js requires cloud-engine.js to load first"); }
  // the shared drawing vocabulary — destructured from the engine
  var R=CE.R, gj=CE.gj, sdir=CE.sdir, pRing=CE.pRing, pDisc=CE.pDisc, pCone=CE.pCone,
      pConeShell=CE.pConeShell, pCol=CE.pCol, pWall=CE.pWall, pProfile=CE.pProfile,
      pProfileShell=CE.pProfileShell, pEll=CE.pEll, stroke=CE.stroke, strokeD=CE.strokeD,
      seg=CE.seg, segD=CE.segD, IFK=CE.IFK;
  var INK_FULL=CE.INK_FULL, INK_SOFT=CE.INK_SOFT, INK_MID=CE.INK_MID, GHOST=CE.GHOST, FAINT=CE.FAINT;

  // per-aspect intrinsic ink value (some lenses read darker than others)
  function aspectInk(a){
    switch(a){
      case 0: return INK_SOFT;  // xenia
      case 1: return INK_FULL;  // metis — the darkest, most solid
      case 2: return GHOST;     // lethe — faint, forgetting
      case 3: return INK_SOFT;  // nostos
      case 4: return INK_FULL;  // recognition — sharp
      case 5: return INK_MID;   // embedded tale
      case 6: return INK_FULL;  // monstrous — heavy
      case 7: return INK_SOFT;  // kleos
      default: return GHOST;
    }
  }

  const SCULPT = {
    // 1 · TROY — the walled city, breached — and the horse inside it
    troy(k,e){
      for(let i=0;i<460;i++){ const t=R()*6.2831;
        if(Math.abs(((t+Math.PI)%6.2831)-Math.PI)<0.42 && R()<0.8) continue;   // the breach
        const rr=0.62+gj(0.025); e(Math.cos(t)*rr, R()*0.4, Math.sin(t)*rr, 1.05, 8); }
      for(let h=0;h<5;h++){ const a=0.6+h/5*5.1;                                // towers clear of the breach
        for(let i=0;i<26;i++){ e(Math.cos(a)*0.62+gj(0.025), R()*0.62, Math.sin(a)*0.62+gj(0.025), 1.3, 8); } }
      // the horse: body, four legs, arched neck, head — full ink, the dark heart of the ring
      pEll(e,0,0.46,0,0.21,0.11,0.1,170,1.15,1,IFK);
      [[0.14,0.055],[0.14,-0.055],[-0.14,0.055],[-0.14,-0.055]].forEach(L=>{
        seg(e,[L[0],0.38,L[1]],[L[0],0.03,L[1]],24,1.1,1,IFK,0.005); });
      stroke(e,f=>[0.18+f*0.1, 0.52+f*0.17, 0],18,1.1,1,IFK,0.006);             // neck
      pEll(e,0.31,0.71,0,0.07,0.035,0.035,44,1.15,1,IFK);                       // head, nose forward
      e(0.36,0.72,0,2.2,1,IFK);                                                 // the eye — one accent
      for(let i=0;i<80;i++){ const p=pDisc(0.5,0); e(p[0],0.02,p[2],1.1,0); }
    },
    // 2 · ISMARUS — the citadel afire: intact wall, flame-strokes, one bent smoke column
    ismarus(k,e){
      for(let i=0;i<280;i++){ const p=pWall(0.4,0.26,0.025); e(p[0],p[1],p[2],1.1,8); }
      for(let i=0;i<30;i++){ const a=R()*6.2831, rr=R()*0.3;                    // flames inside
        seg(e,[Math.cos(a)*rr,0.26,Math.sin(a)*rr],[Math.cos(a)*rr+gj(0.03),0.44+R()*0.14,Math.sin(a)*rr+gj(0.03)],9,1.05,7,IFK,0.008); }
      stroke(e,f=>{                                                             // the smoke, bending east
        return [f*f*0.55, 0.4+f*1.5, f*0.18]; },130,0.95,2,null,0.05);
      for(let i=0;i<110;i++){ const f=R(); const v=0.34+0.34*f;
        e(f*f*0.55+gj(0.1), 0.4+f*1.5, f*0.18+gj(0.1), 0.8+0.5*(1-f), 2, [v,v*0.97,v*0.92]); }
      for(let i=0;i<80;i++){ const p=pDisc(0.38,0); e(p[0],0.02,p[2],1.1,0); }
    },
    // 3 · CAPE MALEA — the waterspout: one tight helix, spray flung off its head
    malea(k,e){
      stroke(e,f=>{ const a=f*9.0, r=0.5*(1-0.72*f);
        return [Math.cos(a)*r, 0.06+f*1.5, Math.sin(a)*r]; },420,1.0,2,null,0.014);
      for(let s=0;s<3;s++){ const a0=s/3*6.2831;
        stroke(e,f=>[Math.cos(a0+f*1.4)*(0.14+f*0.42), 1.5+f*0.16, Math.sin(a0+f*1.4)*(0.14+f*0.42)],28,0.9,2,null,0.014); }
      for(let i=0;i<100;i++){ const p=pRing(0.58,0.06,0.03); e(p[0],p[1],p[2],1.0,0); }
    },
    // 4 · LOTUS-EATERS — the flower drawn: eight petal-outlines, tips lifted, a dark boss
    lotus(k,e){
      const petals=8;
      for(let pI=0;pI<petals;pI++){ const a=pI/petals*6.2831, ca=Math.cos(a), sa=Math.sin(a);
        const pca=Math.cos(a+1.5708), psa=Math.sin(a+1.5708);
        [1,-1].forEach(side=>{ stroke(e,f=>{                                   // petal edge curves
          const len=0.12+f*0.46, w=side*0.13*Math.sin(f*Math.PI), lift=0.05+0.2*f*f;
          return [ca*len+pca*w, lift, sa*len+psa*w]; },30,1.0,2,null,0.006); });
        stroke(e,f=>[ca*(0.12+f*0.46), 0.05+0.2*f*f, sa*(0.12+f*0.46)],16,0.85,2,null,0.005); // vein
      }
      for(let i=0;i<60;i++){ const p=pDisc(0.09,0); e(p[0],0.1+R()*0.07,p[2],1.9,1,IFK); }  // boss
      for(let i=0;i<70;i++){ const p=pRing(0.58,0.04,0.02); e(p[0],0.02,p[2],1.0,0); }
    },
    // 5 · CYCLOPS — the one-eyed mountain: a bare shell now, the eye its only weight
    cyclops(k,e){
      const H=1.5, RB=0.7, eyeY=H*0.62, eyeR=0.24;
      for(let i=0;i<980;i++){ const p=pConeShell(RB,H,0.03);
        if(Math.hypot(p[0],p[1]-eyeY,p[2])<eyeR) continue;
        e(p[0],p[1],p[2],1.05,1); }
      for(let i=0;i<130;i++){ const t=R()*6.2831, rr=eyeR+gj(0.015);
        e(Math.cos(t)*rr, eyeY+Math.sin(t)*rr, eyeR*0.15, 1.3, 5); }
      for(let i=0;i<70;i++){ const t=R()*6.2831, rr=eyeR*0.72+gj(0.012);
        e(Math.cos(t)*rr, eyeY+Math.sin(t)*rr, eyeR*0.2, 1.0, 5); }
      e(0,eyeY,0,4.6,1,IFK);
      for(let i=0;i<90;i++){ const p=pRing(RB*0.9,0.05,0.02); e(p[0],0.02,p[2],1.05,0); }
    },
    // 6 · AEOLIA — the bag of winds: tied at the neck, four streamlines escaping
    aeolia(k,e){
      const sack=[[0,0.14],[0.2,0.33],[0.5,0.4],[0.75,0.3],[0.88,0.12],[1,0.07]];
      for(let i=0;i<560;i++){ const p=pProfileShell(sack,0.72,0.015);
        e(p[0],0.05+p[1],p[2],1.05,1); }
      for(let i=0;i<56;i++){ const t=R()*6.2831; e(Math.cos(t)*(0.09+gj(0.01)), 0.72+R()*0.05, Math.sin(t)*(0.09+gj(0.01)), 1.7, 7, IFK); } // the tie
      for(let s=0;s<4;s++){ const a0=s/4*6.2831+0.4;
        stroke(e,f=>{ const r=0.06+f*0.55, a=a0+f*2.6;
          return [Math.cos(a)*r, 0.8+f*1.05, Math.sin(a)*r]; },64,0.95,2,null,0.014); }
      for(let i=0;i<70;i++){ const p=pDisc(0.3,0); e(p[0],0.02,p[2],1.05,0); }
    },
    // 7 · LAESTRYGONIANS — cliff-jaws, hurled boulders mid-air, hulls under the water
    laistry(k,e){
      [[-1],[1]].forEach(([sx])=>{
        for(let i=0;i<300;i++){ const p=pConeShell(0.3,0.95,0.04); e(sx*0.45+p[0]*0.7, p[1], p[2], 1.1, 6); } });
      for(let b=0;b<3;b++){ const bx=-0.3+b*0.3;                                // the thrown stones
        pEll(e,bx,0.95+((b%2)?0.14:0),0,0.05,0.05,0.05,30,1.3,6,IFK); }
      [[-0.12],[0.14]].forEach(([hx])=>{                                        // sunk hulls: crescents below
        stroke(e,f=>[hx+Math.cos(0.4+f*2.3)*0.16, -0.1-Math.sin(0.4+f*2.3)*0.12, gj(0.02)],26,1.1,7,null,0.008); });
      for(let i=0;i<60;i++){ e(gj(0.08),0.02,(R()-0.5)*0.7,1.0,0); }
    },
    // 8 · CIRCE — her attributes drawn: the wand, the kylix cup, and legible swine
    circe(k,e){
      seg(e,[0,0,0],[0,0.98,0],70,1.15,7,null,0.006);                           // wand
      for(let i=0;i<26;i++){ const d=sdir(); e(d[0]*0.06,0.98+d[1]*0.06,d[2]*0.06,1.7,1,IFK); }
      const cx=0.42;                                                            // kylix: stem, bowl, lip
      seg(e,[cx,0,0],[cx,0.26,0],22,1.0,5,null,0.005);
      for(let i=0;i<160;i++){ const f=Math.sqrt(R()); const r=0.05+f*0.17;
        const t=R()*6.2831; e(cx+Math.cos(t)*r, 0.26+f*0.16, Math.sin(t)*r, 1.0, 5); }
      for(let i=0;i<70;i++){ const t=R()*6.2831; e(cx+Math.cos(t)*0.22, 0.42, Math.sin(t)*0.22, 1.2, 5, IFK); }
      const pigs=4;                                                             // swine: body+snout+legs+ear
      for(let pI=0;pI<pigs;pI++){ const a=0.8+pI/pigs*6.2831, px=Math.cos(a)*0.52, pz=Math.sin(a)*0.52;
        const fx=Math.cos(a+1.5708), fz=Math.sin(a+1.5708);                     // facing tangent
        pEll(e,px,0.12,pz,Math.abs(fx)*0.11+0.05,0.07,Math.abs(fz)*0.11+0.05,80,1.05,6);
        pEll(e,px+fx*0.13,0.1,pz+fz*0.13,0.035,0.03,0.035,18,1.1,6,IFK);        // snout
        [[0.06],[-0.06]].forEach(([o])=>{ seg(e,[px+fx*o,0.06,pz+fz*o],[px+fx*o,0.0,pz+fz*o],7,0.95,6,null,0.004); });
        e(px-fx*0.02,0.2,pz-fz*0.02,1.6,6,IFK);                                 // ear point
      }
      for(let i=0;i<70;i++){ const p=pRing(0.58,0.04,0.02); e(p[0],0.02,p[2],1.0,0); }
    },
    // 9 · NEKUIA — the throat to the dead (kept), thin shades rising at the mouth
    nekuia(k,e){
      for(let i=0;i<220;i++){ const p=pRing(0.5,0.03,0.0); e(p[0],p[1],p[2],1.1,5); }
      for(let i=0;i<920;i++){ const f=R(); const rad=0.5*(1-f)*(1-f); const t=R()*6.2831+f*9;
        const v=0.22+0.36*f; e(Math.cos(t)*(rad+gj(0.015)), -f*2.6, Math.sin(t)*(rad+gj(0.015)), 1.0, 5, [v,v*0.96,v*0.9]); }
      for(let s=0;s<3;s++){ const a=s/3*6.2831+0.5;
        stroke(e,f=>[Math.cos(a)*(0.42-f*0.1), f*0.4, Math.sin(a)*(0.42-f*0.1)],18,0.85,2,[0.55,0.54,0.5],0.014); }
      e(0,-2.6,0,4.2,1,IFK);
    },
    // 10 · SIRENS — winged figures on the twin rocks; the mast, the yard, the bound man
    sirens(k,e){
      [[-0.42],[0.42]].forEach(([sx])=>{
        for(let i=0;i<220;i++){ const p=pConeShell(0.19,0.62,0.02); e(sx+p[0],p[1],p[2],1.05,6); }
        pEll(e,sx,0.7,0,0.05,0.06,0.045,40,1.2,6,IFK);                          // siren body
        e(sx,0.79,0,2.2,6,IFK);                                                 // head
        [[1],[-1]].forEach(([w])=>{ stroke(e,f=>                                // spread wings
          [sx+w*(0.05+f*0.2), 0.72+Math.sin(f*Math.PI)*0.12, gj(0.006)],20,1.0,6,IFK,0.004); });
      });
      seg(e,[0,0,0],[0,1.02,0],80,1.15,7,null,0.006);                           // mast
      seg(e,[-0.22,0.86,0],[0.22,0.86,0],30,1.05,7,null,0.004);                 // yard
      seg(e,[0,0.3,0.02],[0,0.62,0.02],26,1.35,1,IFK,0.006);                    // the bound man
      for(let j=0;j<4;j++){ const y=0.3+j*0.11; for(let i=0;i<14;i++){ const t=R()*6.2831;
        e(Math.cos(t)*0.05, y, Math.sin(t)*0.05, 1.0, 4); } }                   // lashings
      for(let i=0;i<60;i++){ e((R()-0.5)*1.0,0.02,gj(0.1),1.0,0); }
    },
    // 11 · SCYLLA & CHARYBDIS — six striking necks; the whirlpool, sinking as it turns
    scylla(k,e){
      const cx=-0.45;
      pEll(e,cx,0.22,0,0.16,0.14,0.14,140,1.15,6);
      for(let h=0;h<6;h++){ const a=h/6*6.2831;
        stroke(e,f=>{ const reach=f*0.42, rise=0.26+Math.sin(f*2.6)*0.3-f*0.05;
          return [cx+Math.cos(a)*reach, rise, Math.sin(a)*reach]; },32,1.05,6,null,0.007);
        const hx=cx+Math.cos(a)*0.42, hz=Math.sin(a)*0.42, hy=0.26+Math.sin(2.6)*0.3-0.05;
        pEll(e,hx,hy,hz,0.04,0.035,0.04,20,1.3,6,IFK); }
      const wx=0.5;
      stroke(e,f=>{ const a=f*7.5, r=0.34*(1-f);
        return [wx+Math.cos(a)*r, -f*0.45, Math.sin(a)*r]; },260,0.95,5,null,0.009);
      for(let i=0;i<60;i++){ const p=pRing(0.34,0.03,0.0); e(wx+p[0],0.02,p[2],1.0,5); }
    },
    // 12 · THRINACIA — the Sun's cattle: horned, some grazing, on the wide isle
    thrina(k,e){
      const cows=[[-0.3,-0.2,0.7,false],[0.25,-0.3,2.4,true],[0.05,0.2,4.0,false],[-0.35,0.3,5.3,true],[0.4,0.15,1.6,false]];
      cows.forEach(([px,pz,a,graze])=>{
        const fx=Math.cos(a), fz=Math.sin(a);
        pEll(e,px,0.15,pz,Math.abs(fx)*0.13+0.06,0.085,Math.abs(fz)*0.13+0.06,90,1.1,1);
        const hy=graze?0.08:0.2;                                                // head down if grazing
        pEll(e,px+fx*0.17,hy,pz+fz*0.17,0.05,0.045,0.04,24,1.15,1);
        [[1],[-1]].forEach(([w])=>{ stroke(e,f=>                                // the horns — full ink
          [px+fx*0.2+(-fz)*w*(0.03+f*0.05), hy+0.04+f*0.07, pz+fz*0.2+fx*w*(0.03+f*0.05)],8,1.2,4,IFK,0.003); });
        [[0.08,0.04],[0.08,-0.04],[-0.08,0.04],[-0.08,-0.04]].forEach(([lo,lp])=>{
          seg(e,[px+fx*lo+(-fz)*lp,0.09,pz+fz*lo+fx*lp],[px+fx*lo+(-fz)*lp,0.0,pz+fz*lo+fx*lp],7,0.95,1,null,0.004); });
      });
      for(let i=0;i<140;i++){ const p=pDisc(0.62,0); e(p[0],0.02,p[2],1.05,0); }
    },
    // 13 · OGYGIA — the cave-dome, the loom-threads at its mouth, the held figure
    ogygia(k,e){
      for(let i=0;i<480;i++){ const d=sdir(); if(d[1]<0.05) continue;           // dome shell
        if(d[2]>0.45 && d[1]<0.75) continue;                                    // the opening, facing +z
        e(d[0]*0.5,d[1]*0.42,d[2]*0.5,1.05,2); }
      for(let t=0;t<6;t++){ const tx=-0.2+t*0.08;                               // Calypso's loom
        seg(e,[tx,0.34,0.44],[tx,0.02,0.44],20,0.9,7,[0.5,0.49,0.45],0.003); }
      seg(e,[0,0.1,0.1],[0,0.3,0.1],18,1.4,1,IFK,0.007);                        // the held figure
      e(0,0.36,0.1,2.6,1,IFK);
      for(let i=0;i<130;i++){ const p=pDisc(0.6,0); const d=1-Math.hypot(p[0],p[2])/0.6;
        e(p[0],0.02+d*0.12,p[2],1.0,2); }
      for(let i=0;i<60;i++){ const p=pRing(0.6,0.04,0.0); e(p[0],0.02,p[2],1.0,0); }
    },
    // 14 · SCHERIA — the colonnade of the telling (kept), hearth-smoke added
    scheria(k,e){
      const cols=8;
      for(let c=0;c<cols;c++){ const a=c/cols*6.2831, rad=0.5;
        seg(e,[Math.cos(a)*rad,0,Math.sin(a)*rad],[Math.cos(a)*rad,0.7,Math.sin(a)*rad],40,1.15,5,null,0.012); }
      for(let i=0;i<110;i++){ const p=pRing(0.5,0.03,0.7); e(p[0],p[1],p[2],1.1,5); }
      for(let i=0;i<30;i++){ const p=pDisc(0.06,0); e(p[0],0.04+R()*0.06,p[2],1.8,1,IFK); }  // hearth
      stroke(e,f=>[gj(0.02)+f*0.1, 0.12+f*0.75, gj(0.02)],40,0.85,2,[0.5,0.49,0.45],0.022);  // its smoke
      for(let i=0;i<70;i++){ const p=pDisc(0.55,0); e(p[0],0.02,p[2],1.0,0); }
    },
    // 15 · ITHACA — home: the isle, the palace, the strung bow with its arrow nocked
    ithaca(k,e){
      for(let i=0;i<340;i++){ const p=pDisc(0.6,0); const d=1-Math.hypot(p[0],p[2])/0.6;
        e(p[0],0.02+d*0.34,p[2],1.05,4); }
      for(let i=0;i<90;i++){ const p=pDisc(0.15,0); e(p[0],0.36+R()*0.08,p[2],1.3,4); }
      const bx=0.48;                                                            // the great bow
      stroke(e,f=>{ const ang=-1.05+f*2.1;
        return [bx, 0.5+Math.cos(ang)*0.42, Math.sin(ang)*0.42]; },80,1.3,1,IFK,0.006);
      seg(e,[bx,0.5+Math.cos(-1.05)*0.42,Math.sin(-1.05)*0.42],
            [bx,0.5+Math.cos(1.05)*0.42,Math.sin(1.05)*0.42],40,0.85,7,null,0.004);          // string
      seg(e,[bx-0.16,0.5,0],[bx+0.1,0.5,0],22,1.1,1,IFK,0.004);                              // the arrow
      e(bx-0.2,0.5,0,2.6,1,IFK);                                                             // its head
      for(let i=0;i<70;i++){ const p=pRing(0.6,0.04,0.0); e(p[0],0.02,p[2],1.0,0); }
    },

    /* ============================================================
       THE FIGURES — the cast of the poem, sculpted in the same ink.
       Gods ride the sky above the waters they govern; Poseidon lies
       in the deep; island-powers rest on their isles; the dead stand
       below the gate; the living keep the sea. Each is an ATTRIBUTE
       drawn — a bolt, a trident, a loom — not a portrait.
       ============================================================ */

    // ZEUS — the thunderbolt, forked, in a faint aureole
    zeus(k,e){
      const bolt=[[0,0.92],[0.13,0.56],[-0.05,0.5],[0.1,0.18],[-0.08,0.12],[0.02,-0.16]];
      for(let i=0;i<bolt.length-1;i++){ seg(e,[bolt[i][0],bolt[i][1],0],[bolt[i+1][0],bolt[i+1][1],0],22,1.25,1,IFK,0.006); }
      seg(e,[0.02,-0.16,0],[0.16,-0.34,0],14,1.1,1,IFK,0.006);
      seg(e,[0.02,-0.16,0],[-0.12,-0.36,0],14,1.1,1,IFK,0.006);
      for(let s=0;s<16;s++){ const a=s/16*6.2831;
        stroke(e,f=>[Math.cos(a)*(0.5+f*0.22),0.42+Math.sin(a)*(0.5+f*0.22)*0.72,Math.sin(a)*0.05],7,0.85,2,null,0.01); }
      for(let i=0;i<70;i++){ const p=pRing(0.6,0.05,0); e(p[0],0.42+p[2]*0.72,0.05,0.9,0); }
    },
    // ATHENA — the owl, two great eyes, a spear at her side
    athena(k,e){
      seg(e,[0.34,-0.12,0],[0.34,0.86,0],66,1.05,7,null,0.006);
      e(0.34,0.9,0,2.2,4,IFK);
      for(let i=0;i<240;i++){ const d=sdir(); if(d[1]<-0.15) continue; e(d[0]*0.2,0.34+d[1]*0.26,0.02+d[2]*0.18,1.05,1); }
      [[-0.09],[0.09]].forEach(([ox])=>{
        for(let i=0;i<26;i++){ const t=R()*6.2831; e(ox+Math.cos(t)*0.07,0.4+Math.sin(t)*0.07,0.2,1.0,5); }
        e(ox,0.4,0.21,1.7,1,IFK); });
      seg(e,[-0.16,0.54,0.08],[-0.1,0.66,0.06],7,1.0,6,IFK,0.004);
      seg(e,[0.16,0.54,0.08],[0.1,0.66,0.06],7,1.0,6,IFK,0.004);
      e(0,0.34,0.22,1.5,4,IFK);
      for(let i=0;i<70;i++){ const p=pRing(0.42,0.04,0); e(p[0],0.02,p[2],1.0,0); }
    },
    // HERMES — the caduceus: staff, two entwined helices, wings
    hermes(k,e){
      seg(e,[0,-0.1,0],[0,0.84,0],66,1.1,7,null,0.006);
      for(let s=0;s<2;s++){ const ph=s*Math.PI;
        stroke(e,f=>{ const a=ph+f*9; return [Math.cos(a)*0.07,0.0+f*0.78,Math.sin(a)*0.07]; },42,0.95,1,IFK,0.006); }
      [[1],[-1]].forEach(([w])=>{ stroke(e,f=>[w*(0.03+f*0.26),0.8+Math.sin(f*Math.PI)*0.14,0.02],22,1.0,6,IFK,0.004); });
      e(0,0.88,0,2.0,1,IFK);
      for(let i=0;i<60;i++){ const p=pRing(0.32,0.04,0); e(p[0],0.02,p[2],1.0,0); }
    },
    // HELIOS — the sun: an inked disc, a bright core, rays all round
    helios(k,e){
      for(let i=0;i<120;i++){ const t=R()*6.2831; e(Math.cos(t)*0.24,0.42+Math.sin(t)*0.24,0,1.1,1); }
      for(let i=0;i<60;i++){ const t=R()*6.2831,r=R()*0.14; e(Math.cos(t)*r,0.42+Math.sin(t)*r,0,1.3,1,IFK); }
      e(0,0.42,0,3.2,1,IFK);
      for(let s=0;s<16;s++){ const a=s/16*6.2831,l=(s%2)?0.2:0.32;
        seg(e,[Math.cos(a)*0.28,0.42+Math.sin(a)*0.28,0],[Math.cos(a)*(0.28+l),0.42+Math.sin(a)*(0.28+l),0],10,1.0,7,IFK,0.005); }
      for(let i=0;i<60;i++){ const p=pRing(0.5,0.04,0); e(p[0],0.02,p[2],1.0,0); }
    },
    // AEOLUS — the wind: a tied bag, four winds spiralling free
    aeolus(k,e){
      const sack=[[0,0.1],[0.2,0.26],[0.5,0.3],[0.78,0.22],[1,0.06]];
      for(let i=0;i<300;i++){ const p=pProfileShell(sack,0.5,0.015); e(p[0],0.0+p[1],p[2],1.05,1); }
      for(let i=0;i<30;i++){ const t=R()*6.2831; e(Math.cos(t)*0.06,0.5+R()*0.04,Math.sin(t)*0.06,1.5,7,IFK); }
      for(let s=0;s<4;s++){ const a0=s/4*6.2831;
        stroke(e,f=>{ const r=0.1+f*0.48,a=a0+f*3.4; return [Math.cos(a)*r,0.55+f*0.5,Math.sin(a)*r]; },54,0.95,2,null,0.012); }
      for(let i=0;i<60;i++){ const p=pRing(0.34,0.04,0); e(p[0],0.02,p[2],1.0,0); }
    },
    // POSEIDON — the trident, waves at its foot (rides the deep)
    poseidon(k,e){
      seg(e,[0,-0.2,0],[0,0.6,0],60,1.25,1,IFK,0.006);
      seg(e,[-0.22,0.6,0],[0.22,0.6,0],26,1.1,1,IFK,0.005);
      [-0.22,0,0.22].forEach(tx=>{ seg(e,[tx,0.6,0],[tx,0.96,0],20,1.15,1,IFK,0.005); e(tx,0.99,0,1.9,4,IFK); });
      stroke(e,f=>[-0.22-Math.sin(f*1.4)*0.06,0.9+f*0.08,0],8,1.0,1,IFK,0.004);
      stroke(e,f=>[0.22+Math.sin(f*1.4)*0.06,0.9+f*0.08,0],8,1.0,1,IFK,0.004);
      for(let s=0;s<3;s++){ const a=s/3*6.2831;
        stroke(e,f=>[Math.cos(a)*(0.3+f*0.2),-0.2+Math.sin(f*6.28)*0.05,Math.sin(a)*(0.3+f*0.2)],26,0.9,2,null,0.01); }
      for(let i=0;i<80;i++){ const p=pRing(0.42,0.05,0); e(p[0],-0.2,p[2],1.0,0); }
    },
    // CALYPSO — the veiled nymph, her endless loom trailing
    calypso(k,e){
      for(let i=0;i<340;i++){ const p=pConeShell(0.26,0.72,0.02); e(p[0],p[1],p[2],1.05,2); }
      for(let i=0;i<80;i++){ const d=sdir(); if(d[1]<0) continue; e(d[0]*0.12,0.72+d[1]*0.13,d[2]*0.12,1.05,2); }
      e(0,0.78,0.07,1.7,1,IFK);
      for(let t=0;t<5;t++){ const tx=0.24+t*0.05; seg(e,[tx,0.02,0.16],[tx,0.5,0.16],18,0.85,7,[0.5,0.49,0.45],0.003); }
      for(let i=0;i<70;i++){ const p=pRing(0.4,0.04,0); e(p[0],0.02,p[2],1.0,0); }
    },
    // CIRCE (goddess) — the wand crowned with a star, the drugged cup
    kirke(k,e){
      seg(e,[-0.12,0,0],[-0.12,0.78,0],60,1.1,7,null,0.006);
      for(let s=0;s<8;s++){ const a=s/8*6.2831; seg(e,[-0.12,0.78,0],[-0.12+Math.cos(a)*0.1,0.78+Math.sin(a)*0.1,0],7,1.1,1,IFK,0.004); }
      e(-0.12,0.78,0,1.9,1,IFK);
      const cx=0.24; seg(e,[cx,0,0],[cx,0.22,0],20,1.0,5,null,0.005);
      for(let i=0;i<130;i++){ const f=Math.sqrt(R()),r=0.05+f*0.14,t=R()*6.2831; e(cx+Math.cos(t)*r,0.22+f*0.13,Math.sin(t)*r,1.0,5); }
      for(let i=0;i<50;i++){ const t=R()*6.2831; e(cx+Math.cos(t)*0.19,0.35,Math.sin(t)*0.19,1.1,5,IFK); }
      for(let i=0;i<60;i++){ const p=pRing(0.4,0.04,0); e(p[0],0.02,p[2],1.0,0); }
    },
    // THE DEAD — the gate of Hades, dark within, shades rising
    hades(k,e){
      [[-0.28],[0.28]].forEach(([px])=>{ seg(e,[px,0,0],[px,0.82,0],56,1.2,1,IFK,0.008); seg(e,[px,0,0.06],[px,0.82,0.06],40,1.0,1,IFK,0.006); });
      seg(e,[-0.34,0.84,0],[0.34,0.84,0],40,1.2,1,IFK,0.008);
      seg(e,[-0.34,0.84,0.06],[0.34,0.84,0.06],28,1.0,1,IFK,0.006);
      for(let i=0;i<200;i++){ const v=0.26+R()*0.16; e((R()-0.5)*0.5,R()*0.8,0.02+gj(0.03),1.0,2,[v,v*0.96,v*0.9]); }
      for(let s=0;s<3;s++){ const ox=(s-1)*0.15; stroke(e,f=>[ox+gj(0.02),f*0.72,0.03],18,0.9,2,[0.5,0.49,0.46],0.012); }
      for(let i=0;i<70;i++){ const p=pRing(0.46,0.04,0); e(p[0],0.02,p[2],1.0,0); }
    },
    // ANTICLEIA — a thin shade, arms open, dissolving at the hem
    anticleia(k,e){
      const v=[0.5,0.49,0.46];
      stroke(e,f=>[gj(0.02),f*0.66,gj(0.02)],40,0.95,2,v,0.01);
      stroke(e,f=>[-(0.04+f*0.22),0.44+f*0.12,0.02],16,0.9,2,v,0.006);
      stroke(e,f=>[(0.04+f*0.22),0.44+f*0.12,0.02],16,0.9,2,v,0.006);
      for(let i=0;i<30;i++){ const t=R()*6.2831; e(Math.cos(t)*0.08,0.74+Math.sin(t)*0.08,0,0.95,5,v); }
      for(let i=0;i<50;i++){ e(gj(0.14),0.02+R()*0.1,gj(0.14),0.85,2,v); }
    },
    // ACHILLES — a shade still bearing the great round shield and spear
    achilles(k,e){
      const v=[0.44,0.43,0.4];
      stroke(e,f=>[gj(0.015),f*0.72,gj(0.015)],44,1.0,2,v,0.008);
      for(let i=0;i<30;i++){ const t=R()*6.2831; e(Math.cos(t)*0.08,0.8+Math.sin(t)*0.08,0,1.0,5,v); }
      const sx=-0.24;
      for(let ring=0;ring<3;ring++){ const r=0.1+ring*0.08; for(let i=0;i<40;i++){ const t=R()*6.2831; e(sx+Math.cos(t)*r,0.4+Math.sin(t)*r,0.06,1.0,5,v); } }
      e(sx,0.4,0.08,1.6,1,IFK);
      seg(e,[0.22,-0.05,0],[0.22,0.82,0],40,0.95,7,v,0.005);
      e(0.22,0.85,0,1.4,4,v);
      for(let i=0;i<50;i++){ e(gj(0.12),0.02,gj(0.12),0.85,2,v); }
    },
    // TEIRESIAS — the blind seer, bent over his staff
    teiresias(k,e){
      const v=[0.5,0.49,0.45];
      stroke(e,f=>[Math.sin(f*0.9)*0.14,f*0.6,0],40,1.0,2,v,0.008);
      for(let i=0;i<28;i++){ const d=sdir(); if(d[1]<0) continue; e(0.12+d[0]*0.09,0.62+d[1]*0.1,d[2]*0.09,1.0,2,v); }
      seg(e,[0.28,0,0.04],[0.14,0.72,0.0],40,1.05,7,v,0.005);
      e(0.14,0.74,0,1.4,1,IFK);
      stroke(e,f=>[0.14-f*0.04,0.56-f*0.3,0.06],14,0.85,2,v,0.006);
      for(let i=0;i<50;i++){ e(gj(0.12),0.02,gj(0.12),0.85,2,v); }
    },
    // ODYSSEUS — the man himself, standing on his last keel
    odysseus(k,e){
      seg(e,[0,0.16,0],[0,0.62,0],30,1.3,1,IFK,0.006);
      for(let i=0;i<26;i++){ const d=sdir(); if(d[1]<0) continue; e(d[0]*0.1,0.68+d[1]*0.1,d[2]*0.09,1.15,1,IFK); }
      seg(e,[0,0.56,0],[-0.16,0.4,0.02],14,1.1,1,IFK,0.005);
      seg(e,[0,0.56,0],[0.16,0.42,0.02],14,1.1,1,IFK,0.005);
      seg(e,[0,0.16,0],[-0.1,-0.02,0],12,1.1,1,IFK,0.005);
      seg(e,[0,0.16,0],[0.1,-0.02,0],12,1.1,1,IFK,0.005);
      for(let i=0;i<90;i++){ const p=pDisc(0.3,0); e(p[0],0.0,p[2],1.0,4); }
      for(let i=0;i<60;i++){ const p=pRing(0.36,0.03,0); e(p[0],0.02,p[2],1.0,0); }
    },
    // PENELOPE — the loom: warp threads, the weave dense below, undone above
    penelope(k,e){
      seg(e,[-0.3,0,0],[-0.3,0.8,0],40,1.1,7,null,0.005);
      seg(e,[0.3,0,0],[0.3,0.8,0],40,1.1,7,null,0.005);
      seg(e,[-0.3,0.8,0],[0.3,0.8,0],28,1.1,7,null,0.005);
      seg(e,[-0.3,0.0,0],[0.3,0.0,0],28,1.05,7,null,0.005);
      for(let w=0;w<11;w++){ const wx=-0.3+w*0.06; seg(e,[wx,0,0],[wx,0.8,0],26,0.8,7,[0.5,0.49,0.45],0.003); }
      for(let i=0;i<220;i++){ const f=R(); if(R()>(1-f)*0.9) continue; e(-0.3+R()*0.6,f*0.8,0.01,1.0,1); }
      for(let i=0;i<50;i++){ const p=pRing(0.42,0.03,0); e(p[0],0.02,p[2],1.0,0); }
    },
    // TELEMACHUS — a small ship under sail (his own voyage)
    telemachus(k,e){
      stroke(e,f=>[-0.34+f*0.68,0.12-Math.sin(f*Math.PI)*0.14,0],40,1.15,1,IFK,0.006);
      stroke(e,f=>[-0.3+f*0.6,0.13-Math.sin(f*Math.PI)*0.1,0.04],30,1.0,7,null,0.005);
      seg(e,[0,0.1,0],[0,0.72,0],40,1.1,7,null,0.005);
      seg(e,[-0.16,0.6,0],[0.16,0.6,0],18,1.0,7,null,0.004);
      for(let i=0;i<90;i++){ const u=R(),vv=R(); e((-0.14+u*0.28)+0.04*Math.sin(vv*3.14),0.28+vv*0.3,0.04+Math.sin(u*3.14)*0.05,1.0,2); }
      for(let i=0;i<50;i++){ e((R()-0.5)*0.7,0.02,gj(0.05),1.0,0); }
    },
    // THE SUITORS — a crowd of tipped cups, the house devoured
    suitors(k,e){
      const cups=5;
      for(let c=0;c<cups;c++){ const a=c/cups*6.2831,cx=Math.cos(a)*0.28,cz=Math.sin(a)*0.28;
        for(let i=0;i<70;i++){ const f=Math.sqrt(R()),r=0.03+f*0.1,t=R()*6.2831; e(cx+Math.cos(t)*r,0.1+f*0.12,cz+Math.sin(t)*r,1.0,6); }
        seg(e,[cx,0.0,cz],[cx,0.1,cz],10,1.0,6,null,0.004);
        for(let i=0;i<24;i++){ const t=R()*6.2831; e(cx+Math.cos(t)*0.13,0.22,cz+Math.sin(t)*0.13,1.05,6,IFK); } }
      for(let i=0;i<90;i++){ e(gj(0.34),0.02+R()*0.04,gj(0.34),1.0,6); }
      for(let i=0;i<60;i++){ const p=pRing(0.46,0.03,0); e(p[0],0.02,p[2],1.0,0); }
    },
    // NAUSICAA — the princess at play: a figure, a ball, folded linen
    nausicaa(k,e){
      seg(e,[-0.1,0.1,0],[-0.1,0.5,0],24,1.1,1,IFK,0.005);
      for(let i=0;i<22;i++){ const d=sdir(); if(d[1]<0) continue; e(-0.1+d[0]*0.08,0.55+d[1]*0.08,d[2]*0.07,1.0,1,IFK); }
      seg(e,[-0.1,0.44,0],[0.06,0.34,0.02],12,1.0,1,IFK,0.004);
      for(let i=0;i<40;i++){ const t=R()*6.2831; e(0.2+Math.cos(t)*0.09,0.46+Math.sin(t)*0.09,0.02,1.0,5); }
      for(let s=0;s<3;s++){ for(let i=0;i<24;i++){ const p=pDisc(0.12-s*0.02,0); e(0.18+p[0],0.04+s*0.05,p[2],1.0,8); } }
      for(let i=0;i<50;i++){ const p=pRing(0.4,0.03,0); e(p[0],0.02,p[2],1.0,0); }
    },
    // THE CREW — a fan of oars, small figures dimming, some sinking
    crew(k,e){
      for(let s=0;s<7;s++){ const a=-0.9+s/6*1.8;
        seg(e,[0,0.2,0],[Math.cos(a+1.5708)*0.5,0.2+Math.sin(a)*0.1,Math.sin(a+1.5708)*0.5],22,1.0,7,null,0.005); }
      for(let s=0;s<5;s++){ const a=s/5*6.2831,r=0.16,v=0.4+s*0.06;
        seg(e,[Math.cos(a)*r,0.1,Math.sin(a)*r],[Math.cos(a)*r,0.34,Math.sin(a)*r],10,1.0,6,[v,v*0.97,v*0.92],0.004);
        e(Math.cos(a)*r,0.4,Math.sin(a)*r,1.3,6,[v,v*0.97,v*0.92]); }
      for(let i=0;i<40;i++){ e(gj(0.3),-0.05-R()*0.1,gj(0.3),0.9,2,[0.5,0.49,0.45]); }
      for(let i=0;i<70;i++){ const p=pDisc(0.5,0); e(p[0],0.0,p[2],1.0,0); }
    },
  };

  window.OdysseySculptures = { SCULPT: SCULPT, aspectInk: aspectInk };
})();
