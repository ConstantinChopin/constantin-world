/* ============================================================
   ODYSSEY — CANONICAL TOPOLOGY  (single source of truth)

   The whole cosmos, not just the sea: the three registers, the
   episode knots on the sea plane, the 19 FIGURES placed by
   governance (gods above the waters they touch, Poseidon in the
   deep, the dead below the one gate, the living on the sea), the
   voyage route, the Mediterranean coastline, the concept web, and
   the signed reading. Extracted verbatim from the live instrument
   (prototypes/odyssey-sculptural) so every surface renders the
   SAME cosmos from ONE definition. Never redefine these in a page.

     <script src=".../_shared/odyssey-topology.js"></script>
     var T = window.OdysseyTopology;
     // { KNOTS, FIGURES, NODES, ROUTE, project, baseYOf, REGY,
     //   SKY_Y, ISLE_Y, DEEP_Y, UNDER_Y, NEKUIA_DEPTH, COASTS,
     //   KCON, ASPECT_MARKS, READING_BY }
     // NODES = KNOTS.concat(FIGURES), each with x, z, baseY resolved.

   Readings are the EDITION's data and travel with the topology —
   the perception is signed (READING_BY). Concepts keep no place;
   they are readings, not coordinates.
   ============================================================ */
(function(){
  'use strict';

  var READING_BY = 'Constantin Chopin';

  // aspect = thematic lens, told apart by MARK not hue (e-ink):
  var ASPECT_MARKS = {
    0:'open-square', 1:'filled-disc', 2:'fine-stipple', 3:'double-ring',
    4:'small-cross', 5:'hollow-ring', 6:'dense-cluster', 7:'short-bar',
    8:'pinprick',    9:'route-dot'
  };

  // ---- the episode knots — the sea plane, each a real lon/lat ----
  var KNOTS = [
    { id:'troy',    name:'Troy',                  place:'Hisarlık · 39.96°N 26.24°E', lon:26.24, lat:39.96, aspect:7, kind:'port',
      orient:'The departure. The war is over; the wandering has not yet begun. Everything that follows is measured from here.',
      reading:'Troy is one of the two fixed pins the whole poem hangs between. It is not part of the wandering — it is the thing the wandering is trying to get away from, and the distance back home from here is short on the map and ten years long in the living.' },
    { id:'ismarus', name:'Ismarus',               place:'Cicones · Maroneia, Thrace', lon:25.52, lat:40.87, aspect:0, kind:'raid',
      orient:'The first landfall, and the first mistake. Still in the known world, still acting like men at war.',
      reading:'The raid on the Cicones is the hinge between the Iliad and the Odyssey: Odysseus behaves as a sacker of cities, and is punished for it. The poem quietly announces that the rules have changed — what worked at Troy will now get his men killed.' },
    { id:'malea',   name:'Cape Malea',            place:'The pivot · storm westward', lon:23.19, lat:36.43, aspect:3, kind:'pivot',
      orient:'The last familiar water. Round this cape and the map turns strange.',
      reading:'He almost goes straight home. Rounding the southern cape of Greece, a storm seizes the fleet and throws it west, out of the known Aegean into the strange central Mediterranean. One gust converts a short voyage into an odyssey.' },
    { id:'lotus',   name:'The Lotus-Eaters',      place:'Djerba · 33.80°N 10.85°E', lon:10.85, lat:33.80, aspect:2, kind:'isle',
      orient:'The first temptation. No violence here — only a flower that makes you forget you were going anywhere.',
      reading:'The lotus is the poem’s first taste of its real antagonist: not a monster but amnesia. The danger is not being killed; it is forgetting you wanted to go home at all. Home becomes abstract, a word with no pull.' },
    { id:'cyclops', name:'The Cyclops',           place:'Sicily · Aci Trezza, Etna', lon:15.16, lat:37.56, aspect:1, kind:'isle',
      orient:'The cave of the one-eyed giant, where strength fails and only cunning gets out.',
      reading:[
        'Against brute force, metis — the turning intelligence that names the hero. Strength fails in the cave; only cunning gets out.',
        'He gives his name as "Nobody," blinds Polyphemus, and escapes beneath a ram. The trick works because he is willing, for one night, to be no one at all.',
        'But pride makes him shout his true name from the ship, and that boast buys him Poseidon’s ten-year grudge. He weaponises identity, and is billed for it.'
      ] },
    { id:'aeolia',  name:'Aeolia',                place:'Stromboli · bag of winds', lon:15.21, lat:38.79, aspect:3, kind:'isle',
      orient:'The island of the wind-king, and the cruellest near-miss in the poem.',
      reading:'Aeolus bags every contrary wind and gives Odysseus a clear run home; Ithaca rises on the horizon — and the crew, suspecting hidden gold, open the bag. The winds burst out and blow them all the way back. Home reached and home lost, in a single loop.' },
    { id:'laistry', name:'The Laestrygonians',    place:'Bonifacio · the fleet lost', lon:9.16, lat:41.39, aspect:6, kind:'isle',
      orient:'The far north of the wandering, where hospitality turns to slaughter and the fleet is destroyed.',
      reading:'The cannibal giants sink eleven of his twelve ships. This is the threshold past which the world stops being human — the point where xenia, guest-friendship, curdles entirely into predation, and Odysseus is left with a single crew.' },
    { id:'circe',   name:'Circe',                 place:'Monte Circeo · Aeaea', lon:13.09, lat:41.24, aspect:2, kind:'isle',
      orient:'The enchantress’s island — a year of ease, and the doorway to the dead.',
      reading:'Circe turns men to swine, then becomes a guide. Her island holds two faces of the same lure: the year of comfortable forgetting, and the instruction that sends him to the underworld. To go home he must first be told to go down.' },
    { id:'nekuia',  name:'The House of the Dead', place:'Avernus · the one descent', lon:14.07, lat:40.84, aspect:5, kind:'underworld',
      orient:'You leave the surface of the world. The one place the poem’s plane is broken — the thread goes down.',
      reading:'Here, and only here, the poem leaves the surface. He goes down for directions home — to Teiresias, to the shade of his mother, to Achilles, who would rather be a slave alive than a king among the dead. The single vertical move in a horizontal poem is the one that teaches him what living is worth.' },
    { id:'sirens',  name:'The Sirens',            place:'Li Galli · the bound mast', lon:14.43, lat:40.58, aspect:6, kind:'reef',
      orient:'The singing rocks, where the danger is knowledge itself — and the only safety is being bound.',
      reading:'The Sirens offer not pleasure but total knowing; their song is that they know everything that happened at Troy. Odysseus has himself lashed to the mast so he can hear it and survive. It is the one temptation he chooses to face directly, by making himself unable to act on it.' },
    { id:'scylla',  name:'Scylla & Charybdis',    place:'Strait of Messina', lon:15.63, lat:38.25, aspect:6, kind:'strait',
      orient:'The strait with no clean passage, where the only choice is which loss to accept.',
      reading:'Between the six-headed Scylla and the whirlpool Charybdis there is no route that costs nothing. He is told in advance: steer for Scylla and lose six men, rather than the ship. At the margins of the world, the only victory is the smaller loss, chosen with open eyes.' },
    { id:'thrina',  name:'Thrinacia',             place:'Sicily · cattle of the Sun', lon:14.27, lat:37.08, aspect:0, kind:'isle',
      orient:'The Sun’s island, where one act of hunger ends the last of the crew.',
      reading:'Forbidden the cattle of Helios and warned plainly, the starving crew eat them anyway. Every man but Odysseus drowns for it. This is where he becomes truly alone — the last companion gone, the rest of the way home to be made by himself.' },
    { id:'ogygia',  name:'Ogygia',                place:'Gozo · Calypso, seven years', lon:14.24, lat:36.05, aspect:2, kind:'isle',
      orient:'The far southwest, the end of the wandering — seven years held by a goddess who offers to make him immortal.',
      reading:'Calypso offers the ultimate version of the lure: not a year of forgetting but eternity, deathlessness, oblivion as a gift. He refuses it. He chooses mortal Penelope and a home that can be lost over an immortality without meaning — which is the poem’s deepest answer to what a human life is for.' },
    { id:'scheria', name:'Scheria',               place:'Corfu · the Phaeacians', lon:19.92, lat:39.62, aspect:5, kind:'court',
      orient:'The last island before home — the safe court where Odysseus becomes the teller of his own wandering.',
      reading:'The wildest stretch — the Cyclops, Circe, the dead, the Sirens — you never hear from Homer. You hear it from Odysseus, telling his story to the Phaeacian court. The teller is inside the telling, and the only witness to the marvels is the man they make a hero.' },
    { id:'ithaca',  name:'Ithaca',                place:'Ithaki · 38.36°N 20.72°E', lon:20.72, lat:38.36, aspect:4, kind:'home',
      orient:'Home at last — but disguised, unrecognised, a beggar in his own hall. Arriving is not yet returning.',
      reading:'Homecoming is not arrival; it is being known. He must be recognised — by his dog, his scar, his bow, and last by Penelope, who tests him with the secret of their immovable bed. The journey ends not at a place but at a moment of being seen. Completion, for this poem, is recognition.' }
  ];

  var ROUTE = [
    'troy','ismarus','malea','lotus','cyclops','aeolia',
    'aeolia','laistry','circe','nekuia','circe',
    'sirens','scylla','thrina','ogygia','scheria','ithaca'
  ];

  // ---- projection: real lon/lat -> x/z on the sea plane (north = -z) ----
  var lons = KNOTS.map(function(k){return k.lon;}), lats = KNOTS.map(function(k){return k.lat;});
  var lon0 = (Math.min.apply(null,lons)+Math.max.apply(null,lons))/2,
      lat0 = (Math.min.apply(null,lats)+Math.max.apply(null,lats))/2,
      latRad = lat0*Math.PI/180, SCALE = 0.62;
  function project(lon,lat){ return [ (lon-lon0)*Math.cos(latRad)*SCALE, -(lat-lat0)*SCALE ]; }
  KNOTS.forEach(function(k){ var p=project(k.lon,k.lat); k.x=p[0]; k.z=p[1]; });
  var byId = {}; KNOTS.forEach(function(k){ byId[k.id]=k; });

  // ---- the three registers ----
  var SKY_Y=4.6, ISLE_Y=0.5, DEEP_Y=-1.1, UNDER_Y=-3.7, NEKUIA_DEPTH=-2.7;
  var REGY={ sky:SKY_Y, isle:ISLE_Y, deep:DEEP_Y, under:UNDER_Y, gate:NEKUIA_DEPTH, sea:0 };
  KNOTS.forEach(function(k){ k.reg=(k.kind==='underworld')?'gate':'sea'; });   // episodes ride the sea, save the one gate
  function baseYOf(k){ return ((k.reg in REGY)?REGY[k.reg]:0) + (k.lift||0); }

  function doff(i,amp){ return [Math.cos(i*2.39996)*amp, Math.sin(i*2.39996*1.7)*amp]; }
  function epc(ids){ var x=0,z=0; ids.forEach(function(id){ var b=byId[id]; x+=b.x; z+=b.z; }); return [x/ids.length,z/ids.length]; }

  // ---- the FIGURES: gods, the dead, the living — placed by GOVERNANCE ----
  var FIGURES = [
    {id:'zeus',      name:'Zeus',                place:'The scales · justice and the storm',   reg:'sky',   kind:'god',    aspect:0, at:['cen',['ismarus','malea','thrina']], lift:1.1,  c:['xenia','hybris']},
    {id:'athena',    name:'Athena',              place:'Grey-eyed · cunning made divine',      reg:'sky',   kind:'god',    aspect:1, at:['cen',['ithaca','scheria']],        lift:0.2,  c:['metis','recognition']},
    {id:'hermes',    name:'Hermes',              place:'The messenger · the timely gift',      reg:'sky',   kind:'god',    aspect:1, at:['cen',['circe','ogygia']],          lift:0.6,  c:['metis']},
    {id:'helios',    name:'Helios',              place:'The Sun · the inviolable cattle',      reg:'sky',   kind:'god',    aspect:4, at:['at','thrina'],                    lift:0.9,  c:['hybris','xenia']},
    {id:'aeolus',    name:'Aeolus',              place:'Keeper of the winds',                  reg:'sky',   kind:'god',    aspect:3, at:['at','aeolia'],                    lift:0.35, c:['nostos']},
    {id:'poseidon',  name:'Poseidon',            place:'Earth-shaker · the wrath that delays', reg:'deep',  kind:'power',  aspect:6, at:['cen',['malea','cyclops','scheria']],          c:['margin','hybris']},
    {id:'calypso',   name:'Calypso',             place:'The nymph · deathless oblivion',       reg:'isle',  kind:'god',    aspect:2, at:['at','ogygia'],                              c:['oblivion','nostos']},
    {id:'kirke',     name:'Circe (the goddess)', place:'Witch and guide',                      reg:'isle',  kind:'god',    aspect:2, at:['at','circe'],                               c:['oblivion','metis']},
    {id:'hades',     name:'The Dead',            place:'The house of Hades',                   reg:'under', kind:'dead',   aspect:5, at:['at','nekuia'],                              c:['nostos']},
    {id:'anticleia', name:'Anticleia',           place:'His mother, among the dead',           reg:'under', kind:'dead',   aspect:5, at:['at','nekuia'], spread:1, lift:-0.2,         c:['oblivion','nostos']},
    {id:'achilles',  name:'Achilles',            place:'The shade who recants',                reg:'under', kind:'dead',   aspect:7, at:['at','nekuia'], spread:2, lift:-0.5,         c:['kleos']},
    {id:'teiresias', name:'Teiresias',           place:'The prophet below',                    reg:'under', kind:'dead',   aspect:3, at:['at','nekuia'], spread:3, lift:-0.3,         c:['nostos','metis']},
    {id:'odysseus',  name:'Odysseus',            place:'The man of many turns',                reg:'sea',   kind:'person', aspect:1, at:['cen',['troy','cyclops','circe','ithaca']],    c:['metis','nostos']},
    {id:'penelope',  name:'Penelope',            place:'The one who waits and tests',          reg:'sea',   kind:'person', aspect:4, at:['at','ithaca'], spread:4,                   c:['recognition','nostos']},
    {id:'telemachus',name:'Telemachus',          place:'The son coming of age',                reg:'sea',   kind:'person', aspect:7, at:['at','ithaca'], spread:5,                   c:['recognition','kleos']},
    {id:'suitors',   name:'The Suitors',         place:'The devourers of the house',           reg:'sea',   kind:'person', aspect:6, at:['at','ithaca'], spread:6,                   c:['xenia','hybris']},
    {id:'nausicaa',  name:'Nausicaa',            place:'The princess of Scheria',              reg:'sea',   kind:'person', aspect:0, at:['at','scheria'], spread:2,                  c:['xenia','recognition']},
    {id:'crew',      name:'The Crew',            place:'The companions, all lost',             reg:'sea',   kind:'person', aspect:6, at:['cen',['cyclops','sirens','thrina']],         c:['hybris','nostos']}
  ];
  FIGURES.forEach(function(f,i){
    var x,z;
    if(f.at[0]==='at'){ var b=byId[f.at[1]]; x=b.x; z=b.z; }
    else { var c=epc(f.at[1]); x=c[0]; z=c[1]; }
    if(f.spread){ var o=doff(f.spread+i*0.7,0.85); x+=o[0]; z+=o[1]; }
    f.x=x; f.z=z; f.lon=null; f.lat=null; f.offMap=true;
    f.baseY=baseYOf(f);
  });
  KNOTS.forEach(function(k){ k.baseY=baseYOf(k); });

  var NODES = KNOTS.concat(FIGURES);   // every point-bearing node, positions resolved
  NODES.forEach(function(n){ byId[n.id]=n; });   // byId indexes ALL nodes (episodes + figures)

  // ---- concept web (the Kindred chips) ----
  var KCON={troy:['kleos'],ismarus:['xenia','hybris'],malea:['nostos'],lotus:['oblivion','nostos'],
    cyclops:['metis','xenia','hybris','margin'],aeolia:['nostos','xenia'],laistry:['margin','xenia'],
    circe:['oblivion','metis'],nekuia:['nostos','recognition'],sirens:['kleos','oblivion'],
    scylla:['margin'],thrina:['hybris','xenia'],ogygia:['oblivion','nostos'],
    scheria:['xenia','recognition'],ithaca:['nostos','recognition']};
  FIGURES.forEach(function(f){ if(f.c) KCON[f.id]=f.c; });

  // ---- simplified Mediterranean coastline (lon,lat) — the locator cartouche ----
  var COASTS = [
    [[12.4,37.8],[13.7,38.1],[15.1,38.25],[15.65,38.0],[15.1,36.8],[14.3,36.7],[12.8,37.1],[12.4,37.8]],
    [[15.65,38.05],[16.2,38.9],[16.6,38.5],[17.1,39.0],[16.5,39.8],[17.5,40.3],[18.4,40.0],[18.0,40.7],[16.8,41.1]],
    [[15.65,38.05],[14.9,40.2],[13.7,41.2],[12.6,41.4],[11.8,42.0]],
    [[11.0,37.1],[10.2,36.8],[10.5,35.8],[11.1,35.2],[10.0,34.3],[10.85,33.6],[12.3,32.9],[15.2,32.4],[17.5,31.9],[20.1,32.2],[22.0,32.7],[24.0,32.0]],
    [[20.0,39.7],[20.7,38.9],[21.1,38.35],[21.6,38.15],[22.4,38.15],[23.2,38.0],[23.0,37.5],[23.15,36.42],[22.5,36.55],[21.9,36.7],[21.7,37.4],[21.1,37.7],[21.3,38.3]],
    [[20.0,39.7],[19.4,40.3],[19.4,41.0]],
    [[26.2,40.0],[26.35,39.5],[26.9,39.0],[26.7,38.4],[27.2,37.9],[27.5,37.0],[28.2,36.7]],
    [[23.6,35.2],[24.7,35.4],[25.7,35.3],[26.3,35.2],[25.0,34.9],[23.6,35.2]],
    [[9.4,41.4],[9.2,42.6],[8.6,42.4],[8.8,41.6],[8.2,40.9],[8.4,39.2],[9.1,39.1],[9.6,40.4],[9.4,41.4]],
    [[14.35,35.95],[14.57,35.83]]
  ];

  window.OdysseyTopology = {
    KNOTS:KNOTS, FIGURES:FIGURES, NODES:NODES, ROUTE:ROUTE,
    project:project, baseYOf:baseYOf, REGY:REGY,
    SKY_Y:SKY_Y, ISLE_Y:ISLE_Y, DEEP_Y:DEEP_Y, UNDER_Y:UNDER_Y, NEKUIA_DEPTH:NEKUIA_DEPTH,
    COASTS:COASTS, KCON:KCON, ASPECT_MARKS:ASPECT_MARKS, READING_BY:READING_BY, byId:byId
  };
})();
