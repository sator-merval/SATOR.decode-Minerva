// ===== glitch.js (ES5) – ULTRA / TREES-HEAVY =====

// ---- SPEED & BASE ----
var SPEED = {
  charDelay: 1,            // délai minimal
  charsPerTick: 5,         // plus de caractères / tick (était 3)
  pauseBetweenBlocks: 8,   // (était ~18-20)
  maxScrollRatio: 0.92,    // trim plus tôt
  compactLen: 64,          // compacts un peu plus courts -> cadence ↑
  treeDepthMin: 4,
  treeDepthMax: 6
};

// ---- MODES (doublés & plus d'arbres) ----
var MODES = {
  CALM: {
    name: "CALM",
    speedMul: 1.6,
    probShakeLight: .06,
    probShakeXY:    .03,
    probShakeXHeavy:.02,
    probFlashFull:  .03,
    probTextStrobe: .10,
    probDrop:       .016,
    probWipe:       .004,
    probFreeze:     .12,
    freezeMin:      80,
    freezeMax:      220,
    // mix: moins de compact, plus de tree
    kindWeights:    { compact:.45, frise:.25, tree:.30 }
  },
  AGITATED: {
    name: "AGITATED",
    speedMul: 2.6,
    probShakeLight: .16,
    probShakeXY:    .10,
    probShakeXHeavy:.08,
    probFlashFull:  .10,
    probTextStrobe: .25,
    probDrop:       .05,
    probWipe:       .02,
    probFreeze:     .05,
    freezeMin:      60,
    freezeMax:      140,
    kindWeights:    { compact:.35, frise:.25, tree:.40 }
  },
  STORM: {
    name: "STORM",
    speedMul: 3.6,
    probShakeLight: .28,
    probShakeXY:    .22,
    probShakeXHeavy:.20,
    probFlashFull:  .18,   // gros flashs fréquents
    probTextStrobe: .42,   // strobe agressif
    probDrop:       .12,   // grosses ruptures
    probWipe:       .06,   // wipe complet
    probFreeze:     .03,   // peu de pauses
    freezeMin:      40,
    freezeMax:      100,
    kindWeights:    { compact:.25, frise:.25, tree:.50 }
  }
};

var mode = MODES.CALM;
var pausedUntil = 0;

// ---- helpers ----
function $(id){ return document.getElementById(id); }
function rc(a){ return a[Math.floor(Math.random()*a.length)]; }
function ri(a,b){ return Math.floor(a + Math.random()*(b-a+1)); }
function now(){ return (new Date()).getTime(); }
function pickWeighted(weights){
  var r = Math.random(), acc=0, k;
  for (k in weights){ acc += weights[k]; if (r <= acc) return k; }
  for (k in weights) return k;
}

// ---- data ----
var frises = [
 "┌═⟦ψ⟧═┐┌╫⟧ψ╫┐╠═⧗═╣",
 "║__Ξ__║║_cut_║║__Ω__║",
 "└╦⟦⧗⟧╦┘└═Ξ═ψ═┘└═══┘",
 ">>~#[ΔΩΨ]:: {load::core} →",
 "⟦⟦⟦⟦#ψ#⟧⟧⟧⟧⟦⟦⟧⟧⟦⟦⟧⟧",
 "╠╣╠╣╠╣╠╣⫷⫷⫷⫷⫷╠╣╠╣"
];
var terms = [
 "bioflux","semantic burn","glitch kernel","ψ-architecture",
 "meta-phase","retroscan","substructural drift","transnode",
 "deep archive","volatile logic","⫷crosslayer⫸","fossil OS",
 "vector trap","quant frame","code striation","neurocache",
 "memory bleed","signal ruin","hashnest","dendritic split"
];
var glyphs = "[]{}⟦⟧#~*ψΩΞΔ⧗⫷⫸⟡".split("");

// ---- generators ----
function compactLine(L){
  if (!L) L = SPEED.compactLen;
  var s = "";
  while (s.length < L) {
    if (Math.random() < 0.16) s += rc(terms);
    else s += rc(glyphs);
  }
  return s.slice(0, L);
}
function tree(depth){
  if (!depth) depth = ri(SPEED.treeDepthMin, SPEED.treeDepthMax);
  var lines = ["root"], i;
  for (i = 1; i < depth; i++) {
    lines.push(new Array(i+1).join("  ") + "├─ " + compactLine(ri(10,20)));
  }
  for (i = 0; i < 2; i++) {
    lines.push(new Array(depth+i+1).join("  ") + "└x─ corrupted" + ri(100,999) + " ▓▓▓");
  }
  return lines;
}

// ---- DOM ----
var stage  = $("stage");
var stream = $("stream");

// ---- writer TURBO ----
function append(t){ stream.appendChild(document.createTextNode(t)); }
function nl(){ stream.appendChild(document.createTextNode("\n")); }

function typeLine(text, delay, done){
  var i = 0;
  var k = Math.max(1, Math.round(SPEED.charsPerTick * mode.speedMul));
  var d = (typeof delay === 'number' ? delay : SPEED.charDelay);
  function tick(){
    if (i < text.length) {
      var end = Math.min(i + k, text.length);
      append(text.slice(i, end));
      i = end;
      setTimeout(tick, d);
    } else {
      nl();
      if (done) done();
    }
  }
  tick();
}

// ---- scroll virtuel ----
function trim(){
  var max = window.innerHeight * SPEED.maxScrollRatio;
  if (stream.scrollHeight > max) {
    var s = stream.textContent;
    var n = s.indexOf("\n");
    if (n >= 0) stream.textContent = s.slice(n+1);
  }
}

// ---- effets (CSS requis dans flow_style.css) ----
function addTmpClass(el, cls, dur){
  el.classList.add(cls);
  setTimeout(function(){ el.classList.remove(cls); }, dur);
}
function shakeLight(){ addTmpClass(stage, 'shake', 120); }
function shakeXY(){ addTmpClass(stage, 'shakeXY', 180); }
function shakeXHeavy(){ addTmpClass(stage, 'shakeXHeavy', 240); }
function textStrobe(dur){ addTmpClass(stream, 'lit', dur || 140); }
function flashFull(dur){
  var d = dur || 130;
  document.body.classList.add('flashFull');
  setTimeout(function(){ document.body.classList.remove('flashFull'); }, d);
}
function dropLines(count){
  var s = stream.textContent;
  while (count-- > 0) {
    var n = s.indexOf("\n");
    if (n < 0) break;
    s = s.slice(n+1);
  }
  stream.textContent = s;
}
function wipeScreen(){ stream.textContent = ""; flashFull(160); }
function freeze(ms){ pausedUntil = now() + ms; }

// ---- mode switching (plus fréquent) ----
function maybeSwitchMode(){
  if (Math.random() < 0.45) { // change plus souvent
    var r = Math.random();
    if (r < 0.50) mode = MODES.CALM;
    else if (r < 0.80) mode = MODES.AGITATED;
    else mode = MODES.STORM;
  }
}

// ---- incidents (plus costauds) ----
function incidents(){
  if (Math.random() < mode.probShakeLight) shakeLight();
  if (Math.random() < mode.probShakeXY)    shakeXY();
  if (Math.random() < mode.probShakeXHeavy)shakeXHeavy();

  if (Math.random() < mode.probFlashFull)  flashFull(ri(90,160));
  if (Math.random() < mode.probTextStrobe) textStrobe(ri(90,200));

  if (Math.random() < mode.probDrop)       dropLines(ri(12, 40));
  if (Math.random() < mode.probWipe)       wipeScreen();

  if (Math.random() < mode.probFreeze)     freeze(ri(mode.freezeMin, mode.freezeMax));
}

// ---- boucle principale ----
function step(){
  if (now() < pausedUntil) { return setTimeout(step, 20); }

  maybeSwitchMode();
  incidents();

  var kind = pickWeighted(mode.kindWeights); // +trees -compacts
  if (kind === "frise") {
    typeLine(rc(frises), SPEED.charDelay, after);
  } else if (kind === "compact") {
    var n = ri(2, 4); // un peu moins qu'avant
    (function many(){
      if (n-- > 0) typeLine(compactLine(), SPEED.charDelay, many);
      else after();
    })();
  } else { // tree
    var lines = tree(), j = 0;
    (function next(){
      if (j < lines.length) typeLine(lines[j++], SPEED.charDelay, next);
      else after();
    })();
  }
}
function after(){ trim(); setTimeout(step, SPEED.pauseBetweenBlocks); }

// ---- boot ----
stream.textContent = ">> init.minerva :: ok\n";
setTimeout(step, 140);

// ==== GLITCH DE POLICE (JetBrains <-> Press Start) ====
// Rafales courtes et irrégulières de Press Start, avec longues pauses aléatoires.
// N'interfère pas avec le reste de tes animations.

(function fontGlitchBurst(){
  function rand(min, max){ return Math.floor(min + Math.random() * (max - min + 1)); }

  function oneBurst(){
    const pulses = rand(1, 6);               // nombre de "flashs" Press Start dans la rafale
    let i = 0;

    function pulse(){
      // ON (Press Start)
      document.body.classList.add('press');

      setTimeout(() => {
        // OFF (retour JetBrains)
        document.body.classList.remove('press');

        i++;
        if (i < pulses) {
          // petit intervalle entre deux ON (60–220 ms)
          setTimeout(pulse, rand(60, 220));
        } else {
          // grande respiration avant la prochaine rafale (800–2400 ms)
          setTimeout(oneBurst, rand(800, 2400));
        }
      }, rand(80, 500)); // durée ON d'un flash (80–500 ms)
    }

    pulse();
  }

  oneBurst();
})();
