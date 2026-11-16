/* PS2-style menu for leonardovicentini.com. Content comes from /ps2.json, built from the Markdown pages. */
(async () => {
const ON = () => document.documentElement.classList.contains('ps2');
if (!ON()) return;
const $ = s => document.querySelector(s);
let SW = 640, SH = 448, PORTRAIT = false, OX = 0, OY = 0, BW = 640, BH = 448;
const mq = matchMedia('(prefers-reduced-motion: reduce)');
let reduce = mq.matches;
const SITE = '';
const GH = 'https://github.com/';

/* ---------- content: built by Hugo from the Markdown pages (layouts/index.ps2.json) ---------- */
let DATA;
try { const r = await fetch(document.documentElement.dataset.ps2json || '/ps2.json'); if (!r.ok) throw new Error(r.status); DATA = await r.json(); }
catch (e) { window.__ps2fail && window.__ps2fail(); return; }
if (!ON()) return;
window.__ps2ready = true;
const toSave = x => ({id:x.id, s:x.save, t:x.short, c:x.subtitle, h:x.hue, d:x.summary, tags:x.tags || [], meta:x.meta, lead:x.lead,
  html:x.html, stack:x.stack || [], url:x.url, title:x.title, l:(x.links || []).map(l => [l.label, l.url])});
const CARDS = ['career','pro','uni'].map(k => (DATA.cards[k] || []).map(toSave));
const PROJECTS = CARDS[1].concat(CARDS[2]);
const DEVS = ['Memory Card /1-A', 'Memory Card /1-B', 'Memory Card /1-C', 'Curriculum Vitae'];

const CONF_FULL = {"Profile": "<p>My interests include <strong>cloud computing</strong>, <strong>distributed systems</strong>, <strong>AI systems</strong>, <strong>platform engineering</strong>, and <strong>software engineering</strong> in general.</p><p>I truly believe in <strong>continuous learning</strong> and <strong>self-improvement</strong>, and I’m always digging into new technologies and paradigms. The world of Computer Science is vast and ever-evolving, and among other things, I love the fact that there is not a single day where you don’t learn something new or understand a concept better than before.</p><blockquote>“Learning is the only thing the mind never exhausts, never fears, and never regrets.” — Leonardo da Vinci</blockquote>", "Status": "<p><strong>Open to new roles</strong> as a Software Engineer in platform &amp; infrastructure.</p><p>EU citizen, open to relocation across the EU, UK &amp; CH.</p><p>Get in touch via Contact (press S): CV, LinkedIn, GitHub and e-mail are all there. Experience and education are in the Browser, on Memory Card /1-A.</p>", "Skills": "<span class=\"lab\">Programming</span><p class=\"ln\">Go · Python · Java · JavaScript · Bash · SQL</p><span class=\"lab\">Platform &amp; Cloud</span><p class=\"ln\">Kubernetes · Kubernetes Operators · OpenAPI · REST APIs · Docker · Helm · AWS · GCP · Azure · Linux</p><span class=\"lab\">DevOps &amp; MLOps</span><p class=\"ln\">CI/CD · GitOps · Prometheus · Grafana · OpenTofu (Terraform) · Ansible · MLflow · KServe</p>"};
const CONF = [
  {k:'Profile', v:'Leonardo Vicentini', h:'Software Engineer – Platform & Infrastructure. Interested in cloud computing, distributed systems, AI systems and platform engineering.'},
  {k:'Status', v:'Open to new roles', h:'Looking for Software Engineer roles in platform & infrastructure. EU citizen, open to relocation across the EU, UK & CH.'},
  {k:'Skills', v:'Go · Kubernetes · Cloud', h:'Go, Python, Java · Kubernetes, Operators, Helm, Docker · AWS, GCP, Azure · Prometheus, Grafana, OpenTofu, Ansible.'},
  {k:'Links', v:'GitHub · LinkedIn · CV', h:'<a href="https://github.com/vicentinileonardo" target="_blank" rel="noopener">GitHub</a><a href="https://www.linkedin.com/in/leonardovicentini" target="_blank" rel="noopener">LinkedIn</a><a href="'+SITE+'/cv_leonardo_vicentini.pdf" target="_blank" rel="noopener">CV</a>', html:1},
];
// selected work shown in Quick View
const QV_WORK = [['OG','CRDs from OpenAPI specs, 10+ features in 6 releases'],['RP','Go query API, latency ~7 s → ~400 ms'],['SL','Go systems simulator, 100+ scenarios']];
const CUBEPOS = [[56,84],[180,150],[60,232],[178,312]];

/* ---------- stage scaling ---------- */
const screen = $('#screen'), stage = $('#stage');
// 640x448 drawn into a 4:3 tube = non-square pixels, as on a real TV
new ResizeObserver(() => { if (typeof setLayout === 'function') setLayout(); }).observe(screen);

/* ---------- state ---------- */
const S = {scene:'boot', menu:0, dev:0, card:0, save:0, opt:0, conf:0, clock:true, t0:performance.now(), tint:0};
const layers = {boot:'#Lboot', menu:'#Lmenu', root:'#Lroot', card:'#Lcard', save:'#Lsave', conf:'#Lconf', ver:'#Lver'};
const TAB = {boot:'A', menu:'A', ver:'A', root:'B', card:'B', save:'B', conf:'C'};
let bootTimer = 0, nav = 0;

function show(scene){
  $('#contact').hidden = true; $('#dov').hidden = true;
  S.scene = scene; S.t0 = performance.now(); stage.dataset.scene = scene;
  for (const k in layers) $(layers[k]).classList.toggle('on', k === scene);
  const browser = scene === 'root' || scene === 'card' || scene === 'save';
  if (scene === 'card' && S.loadNext) { S.loadNext = false; startLoad(); } else if (scene !== 'card') endLoad();
  stage.classList.toggle('bands-on', scene !== 'boot' && !browser);
  stage.classList.toggle('menu-top', scene === 'menu');
  stage.classList.toggle('nob', browser);
  const tab = TAB[scene];
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', t.dataset.tab === tab));
  document.querySelectorAll('.note').forEach(n => n.classList.toggle('on', n.dataset.note === tab));
  render();
  syncURL();
  if (reduce) draw(performance.now());
}
const CARD_URL = ['/career/', '/projects/', '/projects/#university'];
function syncURL(){
  const s = S.scene; let u = '/', title = 'Leonardo Vicentini';
  if (s === 'card') { u = CARD_URL[S.card]; title = ['Experience & Education', 'Projects', 'University projects'][S.card] + ' :: ' + title; }
  else if (s === 'save') { const p = CARDS[S.card][S.save]; u = p.url; title = p.title + ' :: ' + title; }
  else if (s === 'conf') { u = '/about/'; title = 'About :: ' + title; }
  if (location.pathname + location.hash !== u) { try { history.replaceState(null, '', u); } catch (e) {} }
  document.title = title;
}
function routeFromURL(){
  const path = location.pathname.replace(/\/?$/, '/');
  for (let c = 0; c < 3; c++) { const i = CARDS[c].findIndex(p => p.url === path); if (i >= 0) return {scene:'save', card:c, save:i}; }
  if (path === '/career/') return {scene:'card', card:0, save:0};
  if (path === '/projects/') return {scene:'card', card: location.hash === '#university' ? 2 : 1, save:0};
  if (path === '/about/') return {scene:'conf'};
  return null;
}
function go(scene){
  const id = ++nav, f = $('#fader');
  if (reduce) { f.classList.remove('on'); return show(scene); }
  f.classList.add('on');
  setTimeout(() => { if (id !== nav) return; show(scene); f.classList.remove('on'); }, 450);
}
function boot(){
  clearTimeout(bootTimer); nav++; $('#fader').classList.remove('on');
  if (reduce) return show('menu');
  show('boot');
  const L = $('#Lboot'); L.classList.remove('run'); void L.offsetWidth; L.classList.add('run');
  try { sessionStorage.setItem('lvBooted', '1'); } catch (e) {}
  bootTimer = setTimeout(() => go('menu'), 2200);
}
function skipBoot(){ clearTimeout(bootTimer); go('menu'); }

/* ---------- button hints ---------- */
const GLYPH = {
  x:'<path d="M5.5 5l14 14M19.5 5l-14 14" stroke="#7777bb" stroke-width="2.6"/>',
  o:'<circle cx="12.5" cy="12" r="6" fill="none" stroke="#ff5c70" stroke-width="2.2"/>',
  t:'<path d="M12.5 6l6.5 11h-13z" fill="none" stroke="#329966" stroke-width="2.1" stroke-linejoin="miter"/>',
  s:'<rect x="7" y="6.5" width="11" height="11" fill="none" stroke="#f08cd2" stroke-width="2.1"/>'
};
const SLOTX = [24, 213, 335];
const HINTS = {
  boot:[], menu:[[0,'s','Contact'],[1,'x','Enter'],[3,'t','Quick View']],
  root:[[0,'s','Contact'],[1,'x','Enter'],[2,'o','Back']], card:[[0,'s','Contact'],[1,'x','Enter'],[2,'o','Back']], save:[[0,'s','Contact'],[1,'x','Enter'],[2,'o','Back']],
  conf:[[0,'s','Contact'],[1,'x','Details'],[2,'o','Back']], ver:[[0,'s','Contact'],[2,'o','Back']]
};
const KEYOF = {x:'Enter', o:'Escape', t:'t', s:'s'};
const KEYCAP = {x:'Enter', o:'Esc', t:'T', s:'S'};
function renderHints(){
  const h = $('#hints'); h.innerHTML = '';
  const dlg = !$('#dov').hidden || !$('#contact').hidden;
  for (const [slot, g, label] of (dlg ? [[1,'x','Enter'],[2,'o','Back']] : HINTS[S.scene])) {
    const b = document.createElement('button');
    b.type = 'button'; b.tabIndex = -1; b.className = 'btn hint t';
    b.innerHTML = `<svg viewBox="0 0 25 24" aria-hidden="true">${GLYPH[g]}</svg>${label}<kbd>${KEYCAP[g]}</kbd>`;
    if (slot < 3) b.style.left = (PORTRAIT ? [14,122,232] : SLOTX)[slot] + 'px'; else b.style.right = (PORTRAIT ? 14 : 24) + 'px';
    b.addEventListener('click', () => { act(KEYOF[g]); screen.focus({preventScroll:true}); });
    h.append(b);
  }
}

/* ---------- top band ---------- */
const p2 = n => String(n).padStart(2,'0');
function renderBand(){
  const tl = $('#tl'), tr = $('#tr'); tr.className = 't';
  const s = S.scene;
  if (s === 'conf' || s === 'ver') {
    const d = new Date();
    tl.textContent = S.clock ? `${d.getFullYear()}/${p2(d.getMonth()+1)}/${p2(d.getDate())}` : '';
    tr.textContent = S.clock ? `${d.getHours()}:${p2(d.getMinutes())}:${p2(d.getSeconds())}` : '';
  } else if (s === 'root') {
    tl.innerHTML = ''; const t1 = document.createElement('span'); t1.textContent = 'Browser';
    const sm = document.createElement('small'); sm.textContent = ['Experience & Education · ' + CARDS[0].length + ' saves','Professional projects · ' + CARDS[1].length + ' saves','University projects · ' + CARDS[2].length + ' saves','PDF · opens in a new tab'][S.dev];
    t1.append(sm); tl.append(t1); tr.textContent = DEVS[S.dev]; tr.classList.add('yel');
  } else if (s === 'card' || s === 'save') {
    const p = CARDS[S.card][S.save];
    const n = CARDS[S.card].length;
    tl.innerHTML = '<span class="mini"></span>'; const t1 = document.createElement('span'); t1.textContent = DEVS[S.card];
    const sm = document.createElement('small'); sm.textContent = `${(8000 - n*90).toLocaleString('en-US')} KB Free`; t1.append(sm); tl.append(t1);
    tr.innerHTML = ''; tr.classList.add('two');
    tr.append(p.t, document.createElement('br'), p.c);
  } else if (s === 'menu') {
    // name and title side by side need a wide screen; otherwise the title goes under the name
    if (PORTRAIT || SW < 760) { tl.innerHTML = ''; const t1 = document.createElement('span'); t1.className = 'who'; t1.textContent = 'LEONARDO VICENTINI'; const sm = document.createElement('small'); sm.textContent = 'Software Engineer – Platform & Infrastructure'; t1.append(sm); tl.append(t1); tr.textContent = ''; }
    else { tl.innerHTML = '<span class="who">LEONARDO VICENTINI</span>'; tr.textContent = 'Software Engineer – Platform & Infrastructure'; tr.classList.add('role'); }
  } else { tl.textContent = ''; tr.textContent = ''; }
}
setInterval(() => { if (S.scene === 'conf' || S.scene === 'ver') renderBand(); }, 1000);

/* ---------- build DOM ---------- */
const cubeHTML = id => `<i>${id}</i>`.repeat(6);
/* ---------- low-poly save icons (pilot) ----------
   Small flat-shaded meshes built from a few primitives and drawn on a 2D canvas:
   painter-sorted faces, one light, two-sided normals. Projects without a model fall back to the cube. */
const LP = {
  box(m, cx,cy,cz, w,h,d, c, e){ const x0=cx-w/2,x1=cx+w/2,y0=cy-h/2,y1=cy+h/2,z0=cz-d/2,z1=cz+d/2;
    [[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],[[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0]],[[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0]],
     [[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]],[[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1]],[[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]]].forEach(p => m.push({p,c,e})); },
  cyl(m, cx,cy,cz, r,h,n, c, e, a){ const ring = yy => Array.from({length:n}, (_,i) => { const a = i/n*Math.PI*2; return [cx + r*Math.cos(a), cy + yy, cz + r*Math.sin(a)]; });
    const t = ring(h/2), b = ring(-h/2); m.push({p:t,c,e,a}, {p:b.slice().reverse(),c,e,a});
    for (let i = 0; i < n; i++) { const j = (i+1)%n; m.push({p:[b[i],b[j],t[j],t[i]],c,e,a}); } },
  sphere(m, cx,cy,cz, r, c, e, nl=5, nm=8){ const P = (a,b) => [cx + r*Math.cos(a)*Math.cos(b), cy + r*Math.sin(a), cz + r*Math.cos(a)*Math.sin(b)];
    for (let i = 0; i < nl; i++) for (let j = 0; j < nm; j++) { const a0 = -Math.PI/2 + Math.PI*i/nl, a1 = a0 + Math.PI/nl, b0 = j/nm*Math.PI*2, b1 = b0 + Math.PI*2/nm;
      m.push({p:[P(a0,b0),P(a0,b1),P(a1,b1),P(a1,b0)],c,e}); } },
  torus(m, cx,cy,cz, R,r, nu,nv, c, sx=1, rx=0){ const cr = Math.cos(rx), sr = Math.sin(rx);
    const P = (u,v) => { const x = (R + r*Math.cos(v))*Math.cos(u)*sx, y0 = (R + r*Math.cos(v))*Math.sin(u), z0 = r*Math.sin(v); return [cx + x, cy + y0*cr - z0*sr, cz + y0*sr + z0*cr]; };
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const u0 = i/nu*Math.PI*2, u1 = (i+1)/nu*Math.PI*2, v0 = j/nv*Math.PI*2, v1 = (j+1)/nv*Math.PI*2;
      m.push({p:[P(u0,v0),P(u1,v0),P(u1,v1),P(u0,v1)],c}); } },
  bar(m, a, b, w, c){ const d = [b[0]-a[0], b[1]-a[1], b[2]-a[2]], L = Math.hypot(...d), n = d.map(x => x/L);
    const ref = Math.abs(n[2]) < .9 ? [0,0,1] : [1,0,0];
    let u = [n[1]*ref[2]-n[2]*ref[1], n[2]*ref[0]-n[0]*ref[2], n[0]*ref[1]-n[1]*ref[0]]; const ul = Math.hypot(...u); u = u.map(x => x/ul*w);
    const v = [n[1]*u[2]-n[2]*u[1], n[2]*u[0]-n[0]*u[2], n[0]*u[1]-n[1]*u[0]];
    const C = (o, s1, s2) => [o[0] + s1*u[0] + s2*v[0], o[1] + s1*u[1] + s2*v[1], o[2] + s1*u[2] + s2*v[2]];
    const k = [[1,1],[-1,1],[-1,-1],[1,-1]];
    for (let i = 0; i < 4; i++) { const j = (i+1)%4; m.push({p:[C(a,...k[i]),C(a,...k[j]),C(b,...k[j]),C(b,...k[i])],c}); } },
  cone(m, cx,cy,cz, r0,r1,h,n, c, e, a){ const ring = (yy, r) => Array.from({length:n}, (_,i) => { const t = i/n*Math.PI*2; return [cx + r*Math.cos(t), cy + yy, cz + r*Math.sin(t)]; });
    const b = ring(-h/2, r0), t = ring(h/2, r1); m.push({p:b.slice().reverse(),c,e,a}); if (r1 > 0) m.push({p:t,c,e,a});
    for (let i = 0; i < n; i++) { const j = (i+1)%n; m.push(r1 > 0 ? {p:[b[i],b[j],t[j],t[i]],c,e,a} : {p:[b[i],b[j],t[0]],c,e,a}); } },
  extrude(m, pts, d, cx,cy,cz, c, e){ const F = pts.map(([x,y]) => [cx + x, cy + y, cz + d/2]), B = pts.map(([x,y]) => [cx + x, cy + y, cz - d/2]);
    let mx = 0, my = 0; pts.forEach(([x,y]) => { mx += x; my += y; }); mx /= pts.length; my /= pts.length;
    for (let i = 0; i < pts.length; i++) { const j = (i+1)%pts.length;
      m.push({p:[[cx+mx,cy+my,cz+d/2],F[i],F[j]],c,e}, {p:[[cx+mx,cy+my,cz-d/2],B[j],B[i]],c,e}, {p:[F[i],B[i],B[j],F[j]],c,e}); } },
  // faces pushed inside fn form one solid part: parts are depth-sorted as a whole, which keeps
  // stacked or touching solids from bleeding through each other
  grp(m, fn){ const n = m.length; fn(); const g = LP._g = (LP._g || 0) + 1; for (let i = n; i < m.length; i++) if (m[i].g == null) m[i].g = g; },
  // a convex part (box, cylinder): its back faces are culled, so it can never paint its own far side over its near side
  solid(m, fn){ const n = m.length; LP.grp(m, fn); for (let i = n; i < m.length; i++) if (!m[i].n) m[i].cv = 1; },
  // a thin surface detail with an outward normal: drawn only when it faces the viewer, just above its face
  decal(m, p, c, n, e){ m.push({p, c, n, e, zb:.01}); },
  xf(fs, fn){ fs.forEach(f => { f.p = f.p.map(fn); if (f.n) { const o = fn([0,0,0]), q = fn(f.n); f.n = [q[0]-o[0], q[1]-o[1], q[2]-o[2]]; } }); },
  // a closed book: one solid cover with page edges on three sides, spine along the long -z edge
  book(m, x,y,z, W,H,D, rot, c){ const b = [], pg = [238,232,214], t = H/2 - .035, e = .004, z0 = -D/2 + .06, z1 = D/2 - .01, xw = W/2 - .01;
    LP.solid(b, () => { LP.box(b, 0,0,0, W,H,D, c);
      LP.decal(b, [[-xw,-t,D/2+e],[xw,-t,D/2+e],[xw,t,D/2+e],[-xw,t,D/2+e]], pg, [0,0,1]);
      LP.decal(b, [[W/2+e,-t,z1],[W/2+e,-t,z0],[W/2+e,t,z0],[W/2+e,t,z1]], pg, [1,0,0]);
      LP.decal(b, [[-W/2-e,-t,z0],[-W/2-e,-t,z1],[-W/2-e,t,z1],[-W/2-e,t,z0]], pg, [-1,0,0]); });
    const cr = Math.cos(rot), sr = Math.sin(rot); LP.xf(b, ([px,py,pz]) => [px*cr - pz*sr + x, py + y, px*sr + pz*cr + z]); b.forEach(f => m.push(f)); },
  // a seam line drawn on a sphere's surface, following pts (on the sphere of radius r around c)
  seam(m, c, r, pts, w, col){ for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i+1)%pts.length];
      const mid = [(a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2], ml = Math.hypot(...mid), n = mid.map(v => v/ml);
      const d = [b[0]-a[0], b[1]-a[1], b[2]-a[2]]; let u = [n[1]*d[2]-n[2]*d[1], n[2]*d[0]-n[0]*d[2], n[0]*d[1]-n[1]*d[0]]; const ul = Math.hypot(...u) || 1; u = u.map(v => v/ul*w);
      const P = (q, k) => { const l = Math.hypot(...q), s = r*1.012/l; return [c[0] + q[0]*s + k*u[0], c[1] + q[1]*s + k*u[1], c[2] + q[2]*s + k*u[2]]; };
      LP.decal(m, [P(a,-1),P(b,-1),P(b,1),P(a,1)], col, n, 1); } },
  tilt(m, ax){ const c = Math.cos(ax), s = Math.sin(ax); m.forEach(f => f.p = f.p.map(([x,y,z]) => [x, y*c - z*s, y*s + z*c])); }
};
function star(n, R, r){ return Array.from({length:n*2}, (_,i) => { const a = Math.PI/2 + i*Math.PI/n, q = i % 2 ? r : R; return [q*Math.cos(a), q*Math.sin(a)]; }); }
const MODELS = {
  // Krateo: a three-headed guard dog (cerberus), low-poly
  KR: () => { const m = [], fur = [96,100,122], dark = [58,60,76], eye = [110,230,255];
    // every solid is its own part, so small pieces never sort through the body or the heads
    LP.solid(m, () => LP.box(m, 0,-.08,-.18, .62,.42,.95, fur));
    [[-.2,.12],[.2,.12],[-.2,-.48],[.2,-.48]].forEach(([x,z]) => LP.solid(m, () => LP.box(m, x,-.5,z, .15,.46,.15, dark)));
    LP.solid(m, () => LP.bar(m, [0,.04,-.62], [0,.38,-.86], .05, fur));
    [-.36,0,.36].forEach((x, i) => { const y = i === 1 ? .5 : .4, z = .46 - (i === 1 ? 0 : .04), fz = z + .14 + .004;
      LP.solid(m, () => LP.bar(m, [x*.45,.08,.18], [x,y - .08,z - .12], .09, fur));
      // the eyes are decals on the head's front face: drawn right after it, and only while it faces the viewer
      LP.solid(m, () => { LP.box(m, x,y,z, .27,.24,.28, fur);
        [-.07, .07].forEach(ex => LP.decal(m, [[x+ex-.025,y+.005,fz],[x+ex+.025,y+.005,fz],[x+ex+.025,y+.055,fz],[x+ex-.025,y+.055,fz]], eye, [0,0,1], 1)); });
      LP.solid(m, () => LP.box(m, x,y - .06,z + .2, .15,.12,.17, dark));
      [-.08, .08].forEach(ex => LP.solid(m, () => LP.cone(m, x + ex,y + .19,z - .04, .06,0,.15,4, dark)));
    });
    return m; },
  // Thesis: a Kubernetes helm steering three clouds (AWS, GCP, Azure), with a green leaf for carbon-aware scheduling
  TH: t => { const m = [], tt = t || 0, blue = [50,108,228], white = [236,240,250];
    LP.grp(m, () => LP.extrude(m, Array.from({length:7}, (_,k) => { const a = Math.PI/2 + k*Math.PI*2/7; return [.74*Math.cos(a), .74*Math.sin(a)]; }), .08, 0,0,-.09, blue));
    LP.grp(m, () => { const w = [], sp = tt*.6;
      LP.torus(w, 0,0,0, .4,.055, 14,4, white);
      for (let k = 0; k < 7; k++) { const a = sp + Math.PI/2 + k*Math.PI*2/7, c = Math.cos(a), s2 = Math.sin(a);
        LP.bar(w, [.1*c,.1*s2,0], [.56*c,.56*s2,0], .032, white); LP.sphere(w, .58*c,.58*s2,0, .05, white, 0, 3, 5); }
      const h = []; LP.cyl(h, 0,0,0, .12,.1,7, white); LP.tilt(h, Math.PI/2); w.push(...h); m.push(...w); });
    LP.grp(m, () => { const l = []; LP.extrude(l, Array.from({length:10}, (_,k) => { const a = k/10*Math.PI*2; return [.09*Math.sin(a), .17*Math.cos(a)*(Math.cos(a) > 0 ? 1.15 : 1)]; }), .03, 0,0,0, [150,240,120]);
      LP.bar(l, [0,-.18,0], [0,-.28,0], .015, [100,190,90]); const c = Math.cos(-.5), s2 = Math.sin(-.5);
      LP.xf(l, ([x,y,z]) => [x*c - y*s2 + .02, x*s2 + y*c + .96, z]); m.push(...l); });
    [[245,160,50],[66,133,244],[0,160,230]].forEach((c, i) => { const th = tt*.8 + i*Math.PI*2/3, x = 1.0*Math.cos(th), z = 1.0*Math.sin(th), y = -.1 + .08*Math.sin(th*2);
      LP.grp(m, () => { LP.sphere(m, x,y + .06,z, .18, c, 0, 5, 9); LP.sphere(m, x - .17,y - .03,z, .13, c, 0, 4, 8); LP.sphere(m, x + .17,y - .03,z, .14, c, 0, 4, 8); }); });
    return m; },
  // ESA / ESOC: a ground-station dish
  ES: t => { const m = [], w = [215,220,230];
    // a small satellite orbiting above the dish
    { const a = (t || 0)*.8, sx = .8*Math.cos(a), sz = .8*Math.sin(a), sy = .78, sat = [];
      LP.box(sat, 0,0,0, .16,.16,.2, [225,180,70]);
      LP.box(sat, -.25,0,0, .3,.02,.14, [60,110,210], 1); LP.box(sat, .25,0,0, .3,.02,.14, [60,110,210], 1);
      LP.bar(sat, [0,-.08,0], [0,-.16,0], .015, [200,200,210]);
      const ca = Math.cos(-a), sa = Math.sin(-a);
      sat.forEach(f => { f.p = f.p.map(([x,y,z]) => [1.4*(x*ca - z*sa) + sx, 1.4*y + sy, 1.4*(x*sa + z*ca) + sz]); m.push(f); }); }
    LP.box(m, 0,-.75,0, .9,.12,.9, [80,84,96]);
    LP.cyl(m, 0,-.45,0, .12,.5,8, [150,155,168]);
    LP.box(m, 0,-.15,0, .34,.22,.3, [120,125,140]);
    const d = []; LP.cone(d, 0,0,0, .78,.1,.3,12, w); LP.box(d, 0,.32,0, .04,.5,.04, [150,155,168]); LP.sphere(d, 0,.6,0, .07, [255,190,80], 1, 3, 6);
    const ax = -.75, c = Math.cos(ax), s = Math.sin(ax);
    d.forEach(f => { f.p = f.p.map(([x,y,z]) => [x, y*c - z*s + .22, y*s + z*c]); m.push(f); });
    return m; },
  // FIPIC: an archive cabinet with a basketball on top
  FI: () => { const m = [];
    LP.grp(m, () => { LP.box(m, 0,-.3,0, .8,1.0,.62, [120,128,140]);
      [.02,-.3,-.62].forEach(y => { LP.decal(m, [[-.33,y-.12,.315],[.33,y-.12,.315],[.33,y+.12,.315],[-.33,y+.12,.315]], [150,158,170], [0,0,1]);
      }); });
    // handles stay outside the cabinet part so they sort on their own depth
    [.02,-.3,-.62].forEach(y => LP.box(m, 0,y + .04,.34, .2,.05,.05, [60,62,70]));
    const C = [0,.5,0], r = .3, N = 36, ring = fn => Array.from({length:N}, (_,k) => fn(k/N*Math.PI*2));
    LP.grp(m, () => LP.sphere(m, ...C, r, [224,108,36], 0, 8, 14));
    const q = .7, rho = Math.sqrt(1 - q*q);
    [ring(a => [r*Math.cos(a), 0, r*Math.sin(a)]), ring(a => [0, r*Math.sin(a), r*Math.cos(a)]),
     ring(a => [q*r, rho*r*Math.sin(a), rho*r*Math.cos(a)]), ring(a => [-q*r, rho*r*Math.sin(a), rho*r*Math.cos(a)])]
      .forEach(p => LP.seam(m, C, r, p, .012, [30,18,14]));
    return m; },
  // Master's degree: three stacked books and a graduation cap
  MS: () => { const m = [];
    LP.book(m, 0,-.62,0, 1.0,.2,.7, .02, [170,40,50]); LP.book(m, 0,-.42,0, .94,.2,.66, -.12, [50,90,160]); LP.book(m, 0,-.22,0, .9,.2,.64, .08, [60,140,90]);
    LP.grp(m, () => LP.cyl(m, 0,-.03,0, .25,.18,10, [30,30,36]));
    LP.grp(m, () => { const cap = []; LP.box(cap, 0,.09,0, .86,.05,.86, [34,34,40]); const ca = Math.cos(.78), sa = Math.sin(.78);
      LP.xf(cap, ([x,y,z]) => [x*ca - z*sa, y, x*sa + z*ca]); m.push(...cap); });
    { const n = m.length; LP.box(m, 0,.125,0, .07,.025,.07, [240,200,70]); LP.bar(m, [0,.125,0], [.61,.125,0], .013, [240,200,70]); for (let i = n; i < m.length; i++) m[i].top = 1; }
    LP.bar(m, [.6,.12,0], [.6,-.12,0], .018, [240,200,70]); LP.box(m, .6,-.16,0, .05,.08,.05, [240,200,70]);
    return m; },
  // Bachelor's degree: a book with a rolled diploma tied with a red ribbon
  BS: t => { const m = [], paper = [244,238,220], red = [190,40,50];
    LP.book(m, 0,-.5,0, 1.15,.22,.98, -.15, [50,90,160]);
    const nBook = m.length;
    // the scroll is three solid segments along its axis (paper, ribbon band, paper) so each sorts cleanly
    const seg = (x0, x1, r, c) => LP.solid(m, () => { const d = []; LP.cyl(d, 0,0,0, r, x1 - x0, 12, c);
      const cr = Math.cos(.45), sr = Math.sin(.45), xm = (x0 + x1)/2;
      LP.xf(d, ([x,y,z]) => { const x1_ = -y + xm, y1 = x; return [x1_*cr - z*sr, y1 - .22, x1_*sr + z*cr]; }); m.push(...d); });
    seg(-.58,-.06,.16, paper); seg(-.06,.06,.175, red); seg(.06,.58,.16, paper);
    const tc = Math.cos(.45), ts = Math.sin(.45), T = (x,y,z) => [x*tc - z*ts, y, x*ts + z*tc];
    // a laurel wreath floating upright above the book and scroll
    { const A = [Math.cos(.45), 0, Math.sin(.45)], N = [-Math.sin(.45), 0, Math.cos(.45)], C = [0, .45 + .035*Math.sin((t || 0)*2.2), 0], R = .25;
      const W = ([u,v,w]) => [C[0] + u*A[0] + w*N[0], C[1] - v, C[2] + u*A[2] + w*N[2]];  // flipped: the opening faces down
      const leaf = Array.from({length:8}, (_,k) => { const a = k/8*Math.PI*2; return [.08*Math.cos(a), .032*Math.sin(a)]; });
      [-1, 1].forEach(sd => { for (let k = 0; k < 7; k++) { const a = .35 + k*.36, rr = R + (k % 2 ? .034 : -.026);
          const px = sd*rr*Math.sin(a), py = -rr*Math.cos(a), ang = Math.atan2(Math.sin(a), sd*Math.cos(a)) + (k % 2 ? .45 : -.45)*sd;
          const l = []; LP.extrude(l, leaf, .024, 0,0,0, k % 2 ? [120,196,84] : [86,164,66]);
          const ca = Math.cos(ang), sa = Math.sin(ang); LP.xf(l, ([x,y,z]) => W([x*ca - y*sa + px, x*sa + y*ca + py, z]));
          LP.grp(m, () => m.push(...l)); }
        for (let k = 0; k < 6; k++) { const a0 = .3 + k*.38, a1 = a0 + .38;
          LP.grp(m, () => LP.bar(m, W([sd*R*Math.sin(a0), -R*Math.cos(a0), 0]), W([sd*R*Math.sin(a1), -R*Math.cos(a1), 0]), .011, [110,90,50])); } });
      LP.grp(m, () => { const b = []; LP.box(b, 0,-R,0, .1,.07,.04, [235,190,60]); LP.xf(b, W); m.push(...b); }); }
    const nTails = m.length;
    LP.solid(m, () => LP.bar(m, T(0,-.3,.17), T(.1,-.38,.42), .02, red)); LP.solid(m, () => LP.bar(m, T(0,-.3,.17), T(-.1,-.38,.44), .02, red));
    // fixed layers: the book, then the ribbon tails lying on it (their ends tuck under the scroll), then the scroll and wreath
    for (let i = nBook; i < m.length; i++) m[i].top = i >= nTails ? 1 : 2;
    return m; },
  // OASGen: a press stamping out small operators (the piston moves)
  OG: t => { const m = [], py = .12 + .12*Math.sin((t || 0)*3);
    LP.box(m, 0,-.72,0, 1.8,.22,1.1, [74,76,86]);
    // pillars and piston stop at the beam's underside so nothing pokes through it
    LP.box(m, -.78,-.01,0, .18,1.2,.2, [96,100,116]); LP.box(m, .78,-.01,0, .18,1.2,.2, [96,100,116]);
    // the beam is the topmost part and the camera looks down, so it is drawn over everything it overlaps
    { const nt = m.length; LP.box(m, 0,.7,0, 1.76,.22,.34, [58,108,205]); for (let i = nt; i < m.length; i++) m[i].top = 1; }
    LP.cyl(m, 0,(.59 + py)/2,0, .1, .59 - py, 8, [190,195,205]);
    LP.box(m, 0,py - .06,0, .62,.14,.5, [58,108,205]);
    LP.box(m, -.46,-.49,.32, .22,.22,.22, [70,205,170]); LP.box(m, -.12,-.49,.32, .22,.22,.22, [95,170,255]); LP.box(m, .22,-.49,.32, .22,.22,.22, [250,190,70]);
    return m; },
  // resources-presenter: a monitor listing resources
  RP: () => { const m = [];
    LP.box(m, 0,.2,0, 1.7,1.15,.16, [48,50,58]);
    // back housing with vent slots, so the monitor reads as solid from behind
    LP.box(m, 0,.24,-.17, 1.25,.82,.18, [42,44,52]);
    const nb = m.length;
    for (let i = 0; i < 5; i++) LP.box(m, 0,.42 - i*.09,-.265, .8,.035,.01, [24,25,30], 1);
    for (let i = nb; i < m.length; i++) m[i].bo = 1;
    // screen and its content are drawn only while the monitor faces the viewer
    const ns = m.length;
    LP.box(m, 0,.22,.09, 1.48,.94,.02, [18,52,98], 1);
    [[.5,1.0],[.26,1.2],[.02,.8],[-.22,1.05]].forEach(([y,w]) => { LP.box(m, -.58,y,.11, .1,.1,.02, [250,200,80], 1); LP.box(m, -.48 + w/2,y,.11, w,.08,.02, [120,215,255], 1); });
    for (let i = ns; i < m.length; i++) m[i].fo = 1;
    { const nn = m.length; LP.box(m, 0,-.47,-.17, .2,.58,.12, [62,64,72]); for (let i = nn; i < m.length; i++) m[i].nb = 1; } LP.cyl(m, 0,-.8,-.12, .52,.08,10, [62,64,72]);
    return m; },
  // Galaxies classifier: a tilted spiral galaxy
  GX: () => { const m = [];
    m.push({p:Array.from({length:16}, (_,i) => { const a = i/16*Math.PI*2; return [1.05*Math.cos(a), -.02, 1.05*Math.sin(a)]; }), c:[70,55,150], e:1, a:.45});
    LP.sphere(m, 0,0,0, .26, [255,236,190], 1);
    for (let arm = 0; arm < 2; arm++) for (let k = 0; k < 12; k++) { const th = k*.52 + arm*Math.PI, r = .3 + k*.064, q = k/11, sz = .09 - q*.03;
      LP.box(m, r*Math.cos(th), .03*Math.sin(k*1.7), r*Math.sin(th), sz, sz, sz, [Math.round(225 - 100*q), Math.round(215 - 120*q), 255], 1); }
    LP.tilt(m, .55); return m; },
  // ProjectsChain: three interlocked links
  PC: () => { const m = [];
    LP.torus(m, -.78,0,0, .3,.09, 10,5, [214,172,62], 1.55);
    LP.torus(m, 0,0,0, .3,.09, 10,5, [196,200,210], 1.55, Math.PI/2);
    LP.torus(m, .78,0,0, .3,.09, 10,5, [214,172,62], 1.55);
    LP.tilt(m, .35); return m; },
  // Distributed cache: a database feeding a two-level cache tree
  DC: () => { const m = [];
    [.88,.72,.56].forEach(y => LP.cyl(m, 0,y,0, .32,.12,10, [232,172,62]));
    const L1 = [[-.58,.02,0],[.58,.02,0]], L2 = [[-.88,-.66,0],[-.3,-.66,0],[.3,-.66,0],[.88,-.66,0]];
    L1.forEach(q => LP.bar(m, [0,.5,0], q, .035, [150,155,165])); L2.forEach((q,i) => LP.bar(m, L1[i < 2 ? 0 : 1], q, .03, [150,155,165]));
    L1.forEach(q => LP.cyl(m, ...q, .25,.2,9, [70,200,190])); L2.forEach(q => LP.cyl(m, ...q, .17,.16,8, [95,150,255]));
    return m; },
  // Rest Dynamic Controller: a control dial with tick lights
  RD: () => { const m = [];
    LP.cyl(m, 0,-.55,0, 1.0,.2,12, [70,72,82]);
    LP.cyl(m, 0,-.2,0, .62,.5,14, [150,156,170]);
    LP.cyl(m, 0,.1,0, .5,.12,14, [190,196,210]);
    LP.box(m, 0,.19,.25, .1,.08,.42, [235,90,80], 1);
    [[-.75,.0],[-.55,.55],[0,.8],[.55,.55],[.75,0]].forEach(([x,z],i) => LP.box(m, x,-.43,z, .12,.06,.12, i < 3 ? [90,220,140] : [70,80,90], i < 3 ? 1 : 0));
    return m; },
  // Azure DevOps provider: an endless pipeline loop (no logo)
  AZ: () => { const m = [];
    LP.torus(m, -.42,0,0, .36,.11, 12,5, [40,120,230]);
    LP.torus(m, .42,0,0, .36,.11, 12,5, [70,160,245]);
    LP.box(m, 0,0,.0, .16,.16,.16, [250,250,255], 1);
    LP.tilt(m, -.25); return m; },
  // GitHub provider: a branch forking and merging (no logo)
  GH: () => { const m = [], g = [130,135,150];
    LP.bar(m, [0,-.85,0], [0,.85,0], .06, g);
    LP.bar(m, [0,-.25,0], [.55,.2,0], .06, g); LP.bar(m, [.55,.2,0], [.55,.85,0], .06, g);
    [[0,-.85,[240,140,60]],[0,0,[240,140,60]],[0,.85,[240,140,60]],[.55,.2,[90,210,120]],[.55,.85,[90,210,120]]].forEach(([x,y,c]) => LP.sphere(m, x,y,0, .15, c, 0, 4, 8));
    return m; },
  // systemslabs: a server rack wired to a second node
  SL: () => { const m = [];
    LP.box(m, -.25,0,0, .9,1.5,.7, [64,66,76]);
    [.5,.18,-.14,-.46].forEach((y,i) => { LP.box(m, -.25,y,.36, .78,.26,.04, [150,156,172]);
      LP.box(m, -.55,y,.39, .07,.07,.02, i === 2 ? [250,180,60] : [90,230,130], 1); LP.box(m, -.44,y,.39, .07,.07,.02, [90,230,130], 1);
      LP.box(m, -.02,y,.39, .36,.05,.02, [40,42,48]); });
    LP.box(m, .62,-.4,.05, .42,.62,.42, [58,108,205]);
    LP.box(m, .62,-.32,.27, .3,.06,.02, [120,215,255], 1);
    LP.bar(m, [.2,.18,.2], [.62,-.09,.12], .03, [240,190,70]);
    LP.cyl(m, -.1,-.86,0, .95,.06,10, [70,72,80]);
    return m; },
  // Daytrip: a snow-capped mountain and a sun
  DT: () => { const m = [];
    LP.cyl(m, 0,-.72,0, 1.0,.1,10, [90,170,90]);
    LP.cone(m, -.15,-.2,0, .75,.0,1.0, 5, [125,120,135]);
    LP.cone(m, -.15,.17,0, .28,.0,.26, 5, [245,245,250]);
    LP.cone(m, .5,-.42,.25, .4,.0,.5, 5, [105,100,115]);
    LP.sphere(m, .62,.55,-.2, .2, [255,210,70], 1, 4, 8);
    return m; },
  // Query recommendation: a magnifying glass over a star
  QR: () => { const m = [];
    LP.torus(m, -.15,.2,0, .45,.08, 14,5, [180,186,200]);
    m.push({p:Array.from({length:14}, (_,i) => { const a = i/14*Math.PI*2; return [-.15 + .44*Math.cos(a), .2 + .44*Math.sin(a), 0]; }), c:[170,210,255], e:1, a:.3});
    LP.extrude(m, star(5, .26, .11), .08, -.15,.2,.0, [255,205,60], 1);
    LP.bar(m, [.17,-.12,0], [.62,-.62,0], .09, [120,70,50]);
    return m; },
  // Convex hull solver: points wrapped by a faceted hull
  CH: () => { const m = [];
    [[-.3,-.2,.2],[.25,.3,-.1],[.1,-.35,-.25],[-.15,.35,.15],[.35,-.05,.3],[-.35,.1,-.3]].forEach(([x,y,z]) => LP.box(m, x,y,z, .1,.1,.1, [255,120,90], 1));
    LP.sphere(m, 0,0,0, .72, [120,220,210], 0, 3, 6);
    m.slice(-18).forEach(f => f.a = .38);
    return m; },
  // Digital watermarking: a framed picture with a faint diagonal mark
  WM: () => { const m = [], fr = [150,110,60];
    LP.box(m, 0,.66,0, 1.5,.14,.12, fr); LP.box(m, 0,-.66,0, 1.5,.14,.12, fr);
    LP.box(m, -.68,0,0, .14,1.46,.12, fr); LP.box(m, .68,0,0, .14,1.46,.12, fr);
    LP.box(m, 0,0,-.02, 1.24,1.2,.03, [120,180,230], 1);
    LP.extrude(m, [[-.6,-.6],[.0,.2],[.3,-.15],[.6,-.6]], .02, 0,0,.02, [70,120,80], 1);
    LP.sphere(m, .33,.33,.03, .12, [255,230,140], 1, 3, 6);
    LP.box(m, 0,0,.06, 1.5,.16,.01, [255,255,255], 1); m[m.length-1].a = .35;
    m.slice(-6).forEach(f => f.a = .35);
    return m; },
  // Video outpainting localizer: a film frame with its outpainted margin flagged, and the binary mask behind it
  VO: () => { const m = [];
    // back: binary mask (white = outpainted, black = original)
    LP.box(m, .26,.2,-.32, 1.5,1.0,.02, [245,245,245], 1); LP.box(m, .26,.2,-.30, .8,.5,.02, [10,10,12], 1);
    // front: film frame with perforations
    LP.box(m, 0,0,0, 1.7,1.2,.05, [30,30,36]);
    for (let i = 0; i < 6; i++) { LP.box(m, -.7 + i*.28,.53,.03, .12,.08,.02, [225,225,225], 1); LP.box(m, -.7 + i*.28,-.53,.03, .12,.08,.02, [225,225,225], 1); }
    LP.box(m, 0,0,.03, 1.5,.86,.02, [230,70,170], 1); m.slice(-6).forEach(f => f.a = .7);
    LP.box(m, 0,0,.05, .8,.5,.02, [110,180,240], 1);
    LP.extrude(m, [[-.4,-.25],[-.1,.08],[.08,-.08],[.22,.05],[.4,-.25]], .01, 0,0,.065, [70,150,90], 1);
    return m; },
  // Dating app: an extruded heart
  DA: () => { const m = [], pts = [];
    for (let i = 0; i < 24; i++) { const t = i/24*Math.PI*2; pts.push([Math.pow(Math.sin(t),3)*.85, (13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t))/16*.85]); }
    LP.extrude(m, pts, .32, 0,.05,0, [230,60,90]);
    return m; },
};
const ANIM = {OG:1, TH:1, ES:1, BS:1}, MCACHE = {}, SWING = {KR:1, TH:1, PC:1, AZ:1, GH:1, QR:1, WM:1, VO:1};
const LIGHT = (() => { const v = [-.45,.7,.55], l = Math.hypot(...v); return v.map(x => x/l); })();
function renderModel(cv, id, t){
  const def = MODELS[id]; if (!def) return;
  const m = ANIM[id] ? def(t) : (MCACHE[id] ||= def());
  if (!m._r) { let r = 0; m.forEach(f => f.p.forEach(q => r = Math.max(r, Math.hypot(...q)))); m._r = r; }
  const g = cv.getContext('2d'), W = cv.width, H = cv.height; g.clearRect(0,0,W,H);
  // long objects swing instead of turning end-on
  const yaw = t == null ? .55 : (SWING[id] ? .3 + .55*Math.sin(t*1.4) : t*1.1), pitch = .38;
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const sc = Math.min(W,H)*.44/m._r, EZ = 5*m._r;   // the projection below puts the eye at z = 5r
  const toEye = (P, n) => { let x = 0, y = 0, z = 0; P.forEach(q => { x -= q[0]; y -= q[1]; z += EZ - q[2]; }); const l = Math.hypot(x,y,z) || 1; return (n[0]*x + n[1]*y + n[2]*z)/l; };
  const faces = m.map(f => { const p = f.p.map(([x,y,z]) => { const x1 = x*cy + z*sy, z1 = -x*sy + z*cy; return [x1, y*cp - z1*sp, y*sp + z1*cp]; });
    let zc = 0; p.forEach(q => zc += q[2]); let nv = 1;
    // decals: visible when the normal points at the eye (perspective-correct, so details don't pop in at the silhouette)
    if (f.n) { const [nx,ny,nz] = f.n, z1 = -nx*sy + nz*cy, n = [nx*cy + nz*sy, ny*cp - z1*sp, ny*sp + z1*cp]; nv = toEye(p, n); }
    return {p, zc: zc/p.length + (f.zb || 0), c:f.c, e:f.e, a:f.a, fo:f.fo, bo:f.bo, nb:f.nb, top:f.top, g:f.g, nv, dc:!!f.n, cv:f.cv}; });
  const facing = cy*cp;  // view-space z of the model's +z (front) axis
  // parts behind a front panel (a stand's neck) go first while the front faces the viewer
  if (facing > 0) faces.forEach(f => { if (f.nb) f.zc -= 1; });
  // grouped faces sort by their part's mean depth first, then by their own depth inside the part
  const GS = {}, GC = {}; faces.forEach(f => { if (f.g != null && !f.dc) { const q = GS[f.g] ||= [0,0]; q[0] += f.zc; q[1]++;
    if (f.cv) { const c = GC[f.g] ||= [0,0,0,0]; f.p.forEach(v => { c[0] += v[0]; c[1] += v[1]; c[2] += v[2]; c[3]++; }); } } });
  // top = a layer number: parts resting on others (layer 1 over 0, 2 over 1) always draw after them
  faces.forEach(f => { const L = 10*(+f.top || 0); f.zc += L; f.k = f.g != null ? GS[f.g][0]/GS[f.g][1] + L : f.zc; });
  // inside a part, surface details go after the solid's own faces: a visible detail always lies on a
  // front face of a convex solid, and front faces of a convex solid never overlap each other
  faces.sort((a,b) => (a.k - b.k) || (a.g != null && b.g === a.g ? (a.dc - b.dc) : 0) || (a.zc - b.zc));
  for (const f of faces) {
    if ((f.fo && facing < .02) || (f.bo && facing > -.02) || f.nv < .03) continue;
    let nx = 0, ny = 0, nz = 0; const P = f.p;
    for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i+1)%P.length]; nx += (a[1]-b[1])*(a[2]+b[2]); ny += (a[2]-b[2])*(a[0]+b[0]); nz += (a[0]-b[0])*(a[1]+b[1]); }
    const nl = Math.hypot(nx,ny,nz) || 1; nx /= nl; ny /= nl; nz /= nl;
    if (f.cv) { const c = GC[f.g]; let mx = 0, my = 0, mz = 0; P.forEach(q => { mx += q[0]; my += q[1]; mz += q[2]; });
      const L = P.length, d = (mx/L - c[0]/c[3])*nx + (my/L - c[1]/c[3])*ny + (mz/L - c[2]/c[3])*nz;
      const o = d < 0 ? -1 : 1; if (toEye(P, [o*nx, o*ny, o*nz]) < 0) continue; }   // outward normal points away from the eye: a back face
    if (nz < 0) { nx = -nx; ny = -ny; nz = -nz; }
    const dif = Math.max(0, nx*LIGHT[0] + ny*LIGHT[1] + nz*LIGHT[2]);
    const sh = f.e ? 1 : .34 + .66*dif, spec = f.e ? 0 : 70*Math.pow(Math.max(0, nz*.8 + ny*.6), 18);
    const col = f.c.map(v => Math.min(255, Math.round(v*sh + spec)));
    g.beginPath();
    P.forEach((q,i) => { const k = 5/(5 - q[2]/m._r); const x = W/2 + q[0]*sc*k, y = H*.52 - q[1]*sc*k; i ? g.lineTo(x,y) : g.moveTo(x,y); });
    g.closePath(); g.globalAlpha = f.a || 1;
    g.fillStyle = `rgb(${col})`; g.fill(); g.strokeStyle = `rgb(${col})`; g.lineWidth = .8; g.stroke();
  }
  g.globalAlpha = 1;
}
let loadTimer = 0;
const LOAD_STEP = .16, LOAD_POP = .3;
function startLoad(){
  const g = $('#grid'), items = g.querySelectorAll('.save');
  items.forEach((b,i) => b.style.setProperty('--d', (.25 + i*LOAD_STEP).toFixed(2) + 's'));
  g.classList.remove('loading'); void g.offsetWidth; g.classList.add('loading');
  S.loading = true;
  clearTimeout(loadTimer);
  loadTimer = setTimeout(endLoad, (.25 + (items.length - 1)*LOAD_STEP + LOAD_POP + .35)*1000);
}
function endLoad(){
  clearTimeout(loadTimer);
  if (!S.loading) return;
  S.loading = false; $('#grid').classList.remove('loading');
}
function buildGrid(){
  const g = $('#grid'); g.innerHTML = '';
  CARDS[S.card].forEach((p,i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.tabIndex = -1; b.className = 'btn save'; b.setAttribute('role','option'); b.setAttribute('aria-label', p.t);
    b.style.setProperty('--h', p.h);
    b.innerHTML = (MODELS[p.id] ? `<span class="float"><canvas class="mdl" width="190" height="176"></canvas></span>` : `<span class="float"><span class="cube">${cubeHTML(p.id)}</span></span>`) + `<span class="sh"></span><span class="lbl t">${p.s}</span>`;
    b._cv = b.querySelector('canvas.mdl'); b._id = p.id;
    b.addEventListener('click', () => { if (S.save === i) act('Enter'); else { S.save = i; render(); } screen.focus({preventScroll:true}); });
    g.append(b);
  });
}
const gWrap = $('#gcubes');
CONF.forEach((c,i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.tabIndex = -1; b.className = 'btn gc'; b.setAttribute('aria-label', c.k);
  b.style.left = CUBEPOS[i][0] + 'px'; b.style.top = CUBEPOS[i][1] + 'px';
  b.style.setProperty('--ry', (20 + i*23) + 'deg');
  b.innerHTML = `<span class="cube">${'<i></i>'.repeat(6)}</span>`;
  b.addEventListener('click', () => { if (S.conf === i) act('Enter'); else { S.conf = i; render(); } screen.focus({preventScroll:true}); });
  gWrap.append(b);
});
{
  const esc = x => String(x).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const work = QV_WORK.map(([id, line]) => { const p = PROJECTS.find(q => q.id === id); return `<li><a href="${esc(p.l[0][1])}" target="_blank" rel="noopener">${esc(p.t)}</a> <small>· ${esc(line)}</small></li>`; }).join('');
  $('#qv').innerHTML = `
    <dt>Role</dt><dd>Software Engineer – Platform &amp; Infrastructure</dd>
    <dt>Status</dt><dd><span class="open">Open to new roles</span> · relocation EU, UK, CH</dd>
    <dt>Experience</dt><dd>Krateo · Software Engineer, 2025–2026<br>ESA / ESOC · Cloud &amp; Infrastructure intern, 2024</dd>
    <dt>Education</dt><dd>MSc &amp; BSc Computer Science, UniTn · MSc 110/110 cum laude</dd>
    <dt>Stack</dt><dd>Go, Python · Kubernetes, Helm · AWS, GCP, Azure · Prometheus</dd>
    <dt>Selected work</dt><dd><ul>${work}</ul></dd>`;
}
document.querySelectorAll('.dev').forEach(b => b.addEventListener('click', () => {
  const i = +b.dataset.i; if (S.dev === i) act('Enter'); else { S.dev = i; render(); } screen.focus({preventScroll:true});
}));
[$('#mi0'), $('#mi1')].forEach((b,i) => {
  b.addEventListener('mouseenter', () => { S.menu = i; render(); });
  b.addEventListener('click', () => { S.menu = i; act('Enter'); screen.focus({preventScroll:true}); });
});

/* memory card as the console's browser draws it: dark slab, notch tab, step to a lower panel; no logos */
function cardSVG(i, back){
  const g = `g${i}${back ? 'b' : 'f'}`;
  return `<svg viewBox="0 0 74 66"><defs><linearGradient id="${g}" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#46474b"/><stop offset=".5" stop-color="#2a2b2e"/><stop offset="1" stop-color="#1c1d1f"/></linearGradient></defs>
  <rect x=".5" y=".5" width="73" height="65" rx="3" fill="url(#${g})" stroke="#5c5e62" stroke-width=".8"/>` + (back ? '' : `
  <path d="M29 5 Q37 1.5 45 5 V8 H29 Z" fill="#232427" stroke="#66686c" stroke-width=".6"/>
  <rect x="4" y="27" width="66" height="30" rx="1.5" fill="#1e1f21" stroke="#56585c" stroke-width=".7"/>
  <line x1="4.5" y1="27.4" x2="69.5" y2="27.4" stroke="#7a7c80" stroke-width=".7"/>
  <rect x="6" y="58.5" width="62" height="4" rx="1" fill="#2c2d30"/>`) + `</svg>`;
}
document.querySelectorAll('.card3d').forEach((el, i) => {
  el.innerHTML = `<span class="ce l"></span><span class="ce r"></span><span class="ce t"></span><span class="ce b"></span><span class="cf back">${cardSVG(i, 1)}</span><span class="cf front">${cardSVG(i, 0)}<span class="spec"></span></span>`;
});

/* ---------- render ---------- */
function render(){
  renderHints(); renderBand();
  const s = S.scene;
  $('#mi0').classList.toggle('on', S.menu === 0); $('#mi1').classList.toggle('on', S.menu === 1);
  document.querySelectorAll('.dev').forEach((d,i) => d.classList.toggle('on', i === S.dev));
  if (s === 'card') {
    document.querySelectorAll('.save').forEach((b,i) => { b.classList.toggle('on', i === S.save); b.setAttribute('aria-selected', i === S.save); });
    requestAnimationFrame(() => drawGridModels(performance.now()));
    const n = CARDS[S.card].length;
  }
  if (s === 'save') {
    const p = CARDS[S.card][S.save];
    const bc = $('#bigCube'); bc.innerHTML = cubeHTML(p.id); bc.parentElement.style.setProperty('--h', p.h);
    bc.hidden = !!MODELS[p.id]; $('#bigMdl').hidden = !MODELS[p.id];
    if (MODELS[p.id]) requestAnimationFrame(() => renderModel($('#bigMdl'), p.id, reduce ? null : performance.now()/1000));
    const o = $('#opts'); o.innerHTML = '';
    // ○ Back (Esc) is always in the hints, so the list holds only Details and the project links
    [['Details', 'details'], ...p.l].forEach(([label, url], i) => {
      const isLink = url && url !== 'details';
      const el = document.createElement(isLink ? 'a' : 'button');
      if (isLink) { el.href = url; el.target = '_blank'; el.rel = 'noopener'; } else el.type = 'button';
      el.tabIndex = -1; el.className = 'btn opt t' + (i === S.opt ? ' on' : ''); el.textContent = label;
      el.addEventListener('mouseenter', () => { S.opt = i; markOpts(); });
      if (!url) el.addEventListener('click', () => { act('Escape'); screen.focus({preventScroll:true}); });
      if (url === 'details') el.addEventListener('click', () => openPanel(p.t, projectHTML(p), p.l));
      o.append(el);
    });
    const sd = $('#sdesc'); sd.innerHTML = '';
    const d1 = document.createElement('p'); d1.textContent = p.d; sd.append(d1);
    // the full story lives in Details; here only the one-liner and a plain tech line, console style
    const tl = document.createElement('p'); tl.className = 'tl'; tl.textContent = (p.tags && p.tags.length ? p.tags : [p.m || p.c]).join(' · '); sd.append(tl);
    if (p.dr) { const dr = document.createElement('p'); dr.className = 'dr'; dr.textContent = 'Draft text'; sd.append(dr); }
    // sit the description just under the option list, whatever its length
    requestAnimationFrame(() => { const o = $('#opts'); sd.style.top = (o.offsetTop + o.offsetHeight + 22) + 'px'; });
  }
  if (s === 'conf') {
    document.querySelectorAll('.gc').forEach((b,i) => b.classList.toggle('on', i === S.conf));
    const c = CONF[S.conf];
    $('#centry').textContent = c.k; $('#cval').textContent = c.v;
    const w = $('#centry').offsetWidth;
    $('.arrows').style.left = Math.min(BW - 34, (PORTRAIT ? 180 : 430) + w/2 + 16) + 'px';
    if (c.html) $('#chelp').innerHTML = c.h; else $('#chelp').textContent = c.h;
  }
}
function drawGridModels(now){
  document.querySelectorAll('.save').forEach((b,i) => { if (b._cv) renderModel(b._cv, b._id, i === S.save && !reduce ? now/1000 : null); });
}
function markOpts(){ document.querySelectorAll('.opt').forEach((o,i) => o.classList.toggle('on', i === S.opt)); }

/* ---------- input ---------- */
/* scrollable details panel (projects and About entries) */
const escH = x => String(x).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let dSel = 0;
function dItems(){ return [...document.querySelectorAll('#dmenu .dmi')]; }
function markD(){ dItems().forEach((o,i) => o.classList.toggle('on', i === dSel)); }
function pageStep(b){ return Math.max(40, b.clientHeight - 30); }
function updatePage(){
  const b = $('#dbody'), step = pageStep(b), extra = b.scrollHeight - b.clientHeight;
  // a few pixels of spacing must not count as a second page
  const pages = extra > 24 ? Math.ceil(extra / step) + 1 : 1;
  if (pages === 1 && b.style.overflowY !== 'hidden') { b.style.overflowY = 'hidden'; b.scrollTop = 0; }
  if (pages > 1 && b.style.overflowY === 'hidden') b.style.overflowY = '';
  $('#dpage').hidden = pages < 2;
  $('#dpn').textContent = `${Math.min(pages, Math.round(b.scrollTop / step) + 1)} / ${pages}`;
}
function openPanel(title, html, links = []){
  $('#dtitle').textContent = title;
  const b = $('#dbody'); b.innerHTML = `<div class="dwrap">${html}</div>`; b.style.overflowY = ''; b.scrollTop = 0;
  const m = $('#dmenu'); m.innerHTML = '';
  links.forEach(([label, url], i) => {
    const el = document.createElement(url ? 'a' : 'button');
    if (url) { el.href = url; el.target = '_blank'; el.rel = 'noopener'; } else { el.type = 'button'; el.addEventListener('click', closePanel); }
    el.className = 'btn dmi t'; el.tabIndex = -1; el.textContent = label;
    el.addEventListener('mouseenter', () => { dSel = i; markD(); });
    m.append(el);
  });
  dSel = 0; $('#dov').hidden = false; markD(); renderHints(); requestAnimationFrame(updatePage);
}
function closePanel(){ $('#dov').hidden = true; renderHints(); screen.focus({preventScroll:true}); }
$('#dbody').addEventListener('scroll', updatePage, {passive:true});
function projectHTML(p){
  const sec = t => `<span class="lab sec">${t}</span>`;
  const chips = xs => `<p class="chips">${xs.map(x => `<span class="chip">${escH(x)}</span>`).join('')}</p>`;
  let h = `<p class="lead">${escH(p.lead || p.d)}</p>`;
  if (p.meta) h += `<p class="meta">${escH(p.meta)}</p>`;
  h += (p.html || '').replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, (_, t) => sec(t));
  if (p.stack.length) h += sec('Tech stack') + chips(p.stack);
  return h;
}
$('#dov').addEventListener('click', e => { if (e.target.id === 'dov') closePanel(); });
let cSelC = 0;
function contactItems(){ return [...document.querySelectorAll('#clist .copt')]; }
function markContact(){ contactItems().forEach((o,i) => o.classList.toggle('on', i === cSelC)); }
function openContact(){ if (S.scene === 'boot') return; cSelC = 0; $('#cstat').textContent = ''; $('#contact').hidden = false; markContact(); renderHints(); }
function closeContact(){ $('#contact').hidden = true; renderHints(); screen.focus({preventScroll:true}); }
function copyMail(){
  const t = $('#mailTxt').textContent, st = $('#cstat');
  const sel = () => { const r = document.createRange(); r.selectNodeContents($('#mailTxt')); const g = getSelection(); g.removeAllRanges(); g.addRange(r); st.textContent = 'Address selected: press Ctrl/Cmd+C to copy.'; };
  try { navigator.clipboard.writeText(t).then(() => st.textContent = 'Address copied to the clipboard.', sel); } catch (e) { sel(); }
}
contactItems().forEach((o,i) => o.addEventListener('mouseenter', () => { cSelC = i; markContact(); }));
$('#cmail').addEventListener('click', copyMail);
$('#contact').addEventListener('click', e => { if (e.target.id === 'contact') closeContact(); });
function act(k){
  if (!$('#dov').hidden) {
    const b = $('#dbody'), items = dItems();
    if (k === 'ArrowDown' || k === 'PageDown') b.scrollTop += pageStep(b);
    else if (k === 'ArrowUp' || k === 'PageUp') b.scrollTop -= pageStep(b);
    else if (k === 'ArrowRight') { dSel = Math.min(items.length-1, dSel+1); markD(); }
    else if (k === 'ArrowLeft') { dSel = Math.max(0, dSel-1); markD(); }
    else if (k === 'Enter' || k === ' ') { if (items[dSel]) items[dSel].click(); else closePanel(); }
    else if (k === 'Escape' || k === 'Backspace') closePanel();
    else return false;
    return true;
  }
  if (!$('#contact').hidden) {
    const items = contactItems();
    if (k === 'ArrowDown') { cSelC = Math.min(items.length-1, cSelC+1); markContact(); }
    else if (k === 'ArrowUp') { cSelC = Math.max(0, cSelC-1); markContact(); }
    else if (k === 'Enter' || k === ' ') items[cSelC].click();
    else if (k === 'Escape' || k === 'Backspace' || k === 'c' || k === 'C') closeContact();
    else return false;
    return true;
  }
  if ((k === 'c' || k === 'C' || k === 's' || k === 'S') && S.scene !== 'boot') { openContact(); return true; }
  const s = S.scene;
  const cols = PORTRAIT ? 3 : 5;
  if (s === 'boot') { skipBoot(); return true; }
  if (s === 'menu') {
    if (k === 'ArrowUp' || k === 'ArrowDown') { S.menu ^= 1; render(); }
    else if (k === 'Enter' || k === ' ') go(S.menu ? 'conf' : 'root');
    else if (k === 't' || k === 'T') go('ver');
    else return false;
    return true;
  }
  if (s === 'ver') { if (k === 'Escape' || k === 'Backspace') { go('menu'); return true; } return false; }
  if (s === 'root') {
    if (k === 'ArrowLeft') S.dev = Math.max(0, S.dev-1);
    else if (k === 'ArrowRight') S.dev = Math.min(3, S.dev+1);
    else if (PORTRAIT && k === 'ArrowDown') S.dev = Math.min(3, S.dev+2);
    else if (PORTRAIT && k === 'ArrowUp') S.dev = Math.max(0, S.dev-2);
    else if (k === 'Enter' || k === ' ') {
      if (S.dev === 3) { $('#cvLink').click(); return true; }
      S.card = S.dev; S.save = 0; buildGrid(); S.loadNext = !reduce; go('card'); return true;
    }
    else if (k === 'Escape' || k === 'Backspace') { go('menu'); return true; }
    else return false;
    render(); return true;
  }
  if (s === 'card') {
    const n = CARDS[S.card].length;
    if (S.loading && k !== 'Escape' && k !== 'Backspace') { endLoad(); return true; }
    if (k === 'ArrowRight') S.save = Math.min(n-1, S.save+1);
    else if (k === 'ArrowLeft') S.save = Math.max(0, S.save-1);
    else if (k === 'ArrowDown') S.save = Math.min(n-1, S.save+cols);
    else if (k === 'ArrowUp') S.save = Math.max(0, S.save-cols);
    else if (k === 'Enter' || k === ' ') { S.opt = 0; go('save'); return true; }
    else if (k === 'Escape' || k === 'Backspace') { go('root'); return true; }
    else return false;
    render(); return true;
  }
  if (s === 'save') {
    const items = [...document.querySelectorAll('.opt')];
    if (k === 'ArrowDown') { S.opt = Math.min(items.length-1, S.opt+1); markOpts(); }
    else if (k === 'ArrowUp') { S.opt = Math.max(0, S.opt-1); markOpts(); }
    else if (k === 'Enter' || k === ' ') items[S.opt].click();
    else if (k === 'Escape' || k === 'Backspace') go('card');
    else return false;
    return true;
  }
  if (s === 'conf') {
    if (k === 'ArrowDown') S.conf = (S.conf+1) % CONF.length;
    else if (k === 'ArrowUp') S.conf = (S.conf-1+CONF.length) % CONF.length;
    else if (k === 'Enter' || k === ' ') { const c = CONF[S.conf]; if (CONF_FULL[c.k]) openPanel(c.k, CONF_FULL[c.k]); else { const a = $('#chelp a'); if (a) a.focus(); } return true; }
    else if (k === 'Escape' || k === 'Backspace') { go('menu'); return true; }
    else return false;
    render(); return true;
  }
  return false;
}
screen.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;
  if (e.target.tagName === 'A' && (k === 'Enter' || k === ' ')) return;   // native link activation
  if (e.target.tagName === 'A' && k.startsWith('Arrow')) screen.focus({preventScroll:true});
  if (act(k)) e.preventDefault();
});
stage.addEventListener('click', e => { if (S.scene === 'boot') { skipBoot(); e.stopPropagation(); } }, true);
/* ---------- canvas scenes ---------- */
const cv = $('#bg'), ctx = cv.getContext('2d');
const RES = 2; cv.width = 640*RES; cv.height = 448*RES; ctx.scale(RES, RES);
/* portrait console on phones: a 360x560 stage instead of shrinking the 4:3 TV */
const CUBEPOS_P = [[30,62],[105,62],[180,62],[255,62]];
function placeCubes(){ document.querySelectorAll('.gc').forEach((b,i) => { const [x,y] = (PORTRAIT ? CUBEPOS_P : CUBEPOS)[i]; b.style.left = x + 'px'; b.style.top = y + 'px'; }); }
/* the console fills the window: the 640x448 (or 360x560 portrait) layout sits centred in a stage
   that is stretched to the window's shape; backgrounds, bands and corner text use the full stage */
let lastPortrait = null;
function setLayout(){
  const vw = innerWidth, vh = innerHeight;
  PORTRAIT = vw / vh < .8;
  BW = PORTRAIT ? 360 : 640; BH = PORTRAIT ? 560 : 448;
  const k = Math.min(vw / BW, vh / BH);
  SW = vw / k; SH = vh / k; OX = (SW - BW) / 2; OY = (SH - BH) / 2;
  stage.classList.toggle('portrait', PORTRAIT);
  stage.style.width = SW + 'px'; stage.style.height = SH + 'px';
  stage.style.transform = `scale(${k})`;
  document.documentElement.style.setProperty('--ps2k', k);   // stage zoom, for page-level overlays
  stage.style.setProperty('--ox', OX + 'px'); stage.style.setProperty('--oy', OY + 'px');
  stage.style.setProperty('--bw', BW + 'px'); stage.style.setProperty('--bh', BH + 'px');
  cv.width = Math.round(SW*RES); cv.height = Math.round(SH*RES); ctx.setTransform(RES,0,0,RES,0,0);
  if (lastPortrait !== PORTRAIT) { placeCubes(); if (S.scene === 'card') buildGrid(); }
  lastPortrait = PORTRAIT;
  render(); draw(performance.now());
}
addEventListener('resize', setLayout);
let seed = 7; const rnd = () => (seed = seed*16807 % 2147483647) / 2147483647;
const clamp = (v,a=0,b=1) => Math.max(a, Math.min(b, v));
const ease = x => 1 - Math.pow(1-x, 3);
function noiseCanvas(w, h, fn){ const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); const im = g.createImageData(w,h); for (let i = 0; i < w*h; i++){ const [r,gg,b,a] = fn(); im.data.set([r,gg,b,a], i*4); } g.putImageData(im,0,0); return c; }
const stone = ctx.createPattern(noiseCanvas(96,96,() => { const v = 150 + rnd()*70; return [v*.9, v*.9, v*1.04, 255]; }), 'repeat');
const cloud = noiseCanvas(40,28,() => { const v = rnd()*255; return [v,v,v,255]; });
const purple = noiseCanvas(48,34,() => { const v = rnd(); return [48+v*30, 38+v*22, 92+v*40, 255]; });

/* A1: stone towers, seen from above */
const TOW = [];
for (let i = 0; i < 14; i++) for (let j = 0; j < 9; j++) {
  const x = (i-6.5)*1.12, z = (j-4)*1.12, r = Math.hypot(x,z);
  if (r < 1.2) continue;
  TOW.push({x, z, r, h: .6 + rnd()*2 + (r < 4.5 ? 1.1*rnd() : 0)});
}
TOW.sort((a,b) => b.r - a.r);
const LIGHTS = [['255,70,70',0],['70,230,120',2.1],['170,100,255',4.2],['90,150,255',1.1]];
function quad(pts){ ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(pts[i][0],pts[i][1]); ctx.closePath(); }
function drawBoot(t){
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,SW,SH);
  const vis = clamp((t-.1)/.5) * (1 - clamp((t-1.75)/.4));
  if (vis <= 0) return;
  const Hc = 11.5 - 3*ease(clamp(t/2.2)), rot = .35 + t*.14, f = 190*Math.min(SW/640, SH/448), cx = SW/2, cy = SH/2;
  const ca = Math.cos(rot), sa = Math.sin(rot);
  const P = (x,y,z) => { const rx = x*ca - z*sa, rz = x*sa + z*ca, d = Hc - y; return [cx + f*rx/d, cy + f*rz/d]; };
  ctx.globalAlpha = vis;
  const g = ctx.createRadialGradient(cx,cy,0,cx,cy,170); g.addColorStop(0,'rgba(80,110,255,.75)'); g.addColorStop(.5,'rgba(40,60,200,.25)'); g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,SW,SH);
  const s = .4;
  for (const p of TOW) {
    const c = [[-s,-s],[s,-s],[s,s],[-s,s]];
    const base = c.map(([dx,dz]) => P(p.x+dx, 0, p.z+dz)), top = c.map(([dx,dz]) => P(p.x+dx, p.h, p.z+dz));
    const far = .35 * (1 - p.h/5);
    for (let e = 0; e < 4; e++) {
      const n = (e+1) % 4;
      quad([base[e], base[n], top[n], top[e]]);
      ctx.fillStyle = stone; ctx.fill();
      ctx.fillStyle = `rgba(8,8,20,${.45 + .12*e + far})`; ctx.fill();
    }
    quad(top); ctx.fillStyle = stone; ctx.fill();
    ctx.fillStyle = `rgba(10,10,25,${.22 + far})`; ctx.fill();
    ctx.strokeStyle = 'rgba(200,205,240,.18)'; ctx.lineWidth = .7; ctx.stroke();
  }
  ctx.globalCompositeOperation = 'lighter';
  const g2 = ctx.createRadialGradient(cx,cy,0,cx,cy,90); g2.addColorStop(0,'rgba(60,90,255,.35)'); g2.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle = g2; ctx.fillRect(0,0,SW,SH);
  for (const [col, ph] of LIGHTS) {
    for (let k = 0; k < 10; k++) {
      const tt = t*.5 + ph - k*.025, x = cx + Math.cos(tt*1.3)*150*Math.sin(tt*.7+ph), y = cy + Math.sin(tt*1.1)*110;
      ctx.fillStyle = `rgba(${col},${.5*(1-k/10)})`; ctx.beginPath(); ctx.arc(x, y, k ? 1.4 : 2.6, 0, 7); ctx.fill();
    }
  }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}

/* orbs on a wire sphere (main menu + clock) */
function orb(x, y, a){
  const g = ctx.createRadialGradient(x,y,0,x,y,11);
  g.addColorStop(0,`rgba(255,255,255,${a})`); g.addColorStop(.25,`rgba(200,230,255,${a*.9})`); g.addColorStop(.6,`rgba(80,150,255,${a*.35})`); g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,11,0,7); ctx.fill();
}
function sphere(cx, cy, R, t, mode){
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = 'rgba(40,90,210,.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx,cy,R,0,7); ctx.stroke();
  for (let k = 0; k < 3; k++) { const w = Math.abs(Math.cos(t*.35 + k*1.05)); ctx.beginPath(); ctx.ellipse(cx,cy,R*w,R,0,0,7); ctx.strokeStyle = 'rgba(40,90,210,.14)'; ctx.stroke(); }
  for (let i = 0; i < 7; i++) {
    for (let k = 9; k >= 0; k--) {
      const tt = t - k*.05;
      let x, y;
      if (mode === 'ring') { const a = tt*.22 + i*Math.PI*2/7; x = cx + R*Math.cos(a); y = cy + R*Math.sin(a); }
      else { const a = tt*(.3 + i*.07) + i*1.7, b = Math.sin(tt*.4 + i)*.9; x = cx + R*.82*Math.cos(a)*Math.cos(b); y = cy + R*.82*Math.sin(b); }
      if (k === 0) orb(x, y, 1); else { const g = ctx.createRadialGradient(x,y,0,x,y,5); g.addColorStop(0,`rgba(140,190,255,${.16*(1-k/10)})`); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,5,0,7); ctx.fill(); }
    }
  }
  ctx.globalCompositeOperation = 'source-over';
}
const PHASE = [0,.18,1.80,1.98,3.60,3.78,5.40];   // seven orbs travelling in pairs
function orbPos(i, t, R){
  // ring in the XY plane, tumbling about X (round to edge-on every ~0.5 s) while its axis turns about Z
  const A = t*2.9 + .5*Math.sin(t*.8), B = t*.7;
  const a = t*3.0 + PHASE[i] + .12*Math.sin(t*1.7 + i);
  const x = R*Math.cos(a), y0 = R*Math.sin(a);
  const y1 = y0*Math.cos(A), z = y0*Math.sin(A);
  const x2 = x*Math.cos(B) - y1*Math.sin(B), y2 = x*Math.sin(B) + y1*Math.cos(B);
  const k = 300/(300 + z);
  return [x2*k, y2*k, z, k];
}
/* one cached glow sprite instead of new gradients per orb per frame */
const GLOW = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const r = g.createRadialGradient(32,32,0,32,32,32);
  r.addColorStop(0,'rgba(255,255,255,1)'); r.addColorStop(.12,'rgba(240,248,255,1)'); r.addColorStop(.26,'rgba(120,185,255,.6)'); r.addColorStop(.6,'rgba(40,110,255,.16)'); r.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle = r; g.fillRect(0,0,64,64); return c; })();
function orbGlow(x, y, a, s){ const r = 12.5*s; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(GLOW, x - r, y - r, r*2, r*2); ctx.globalAlpha = 1; }
function drawOrbs(cx, cy, R, t){
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 7; i++) {
    // previous field at reduced strength: the interlaced "double" seen on a real TV
    for (const [dt, w] of [[.0167,.45],[0,1]]) {
      const [x, y, , k] = orbPos(i, t - dt, R);
      orbGlow(cx + x, cy + y, w, .85 + .2*k);
    }
  }
  ctx.globalCompositeOperation = 'source-over';
}
function drawMenu(t){
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,SW,SH);
  drawOrbs(OX + (PORTRAIT ? 180 : 263), OY + (PORTRAIT ? 200 : 210), 45, t);
}

/* C: purple clouds + crystal clock
   The background, vignette, blurred rods and text shading are static once the fly-in ends,
   so they are drawn once into an offscreen layer and reused; only the orbs move per frame. */
function clockGeom(){ return { cx: OX + (PORTRAIT ? 180 : 262), cy: OY + (PORTRAIT ? 205 : 228), K: PORTRAIT ? .62 : 1 }; }
function paintClockStatic(g, intro, blur){
  const { cx, cy, K } = clockGeom();
  g.imageSmoothingEnabled = true;
  g.drawImage(purple, 0, 0, SW, SH);
  g.globalAlpha = .18; g.globalCompositeOperation = 'overlay';
  g.drawImage(cloud, -40, -30, SW + 120, SH + 72);
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  const v = g.createRadialGradient(cx,cy,30,cx,cy,250*K); v.addColorStop(0,'rgba(6,4,20,.92)'); v.addColorStop(.45,'rgba(10,6,30,.55)'); v.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle = v; g.fillRect(0,0,SW,SH);
  const hour = new Date().getHours() % 12;
  g.save(); if (blur) g.filter = 'blur(1.6px)'; g.globalAlpha = .78*intro;
  for (let i = 0; i < 12; i++) {
    const a = (i/12)*Math.PI*2 - Math.PI/2;
    g.save(); g.translate(cx, cy); g.rotate(a + (1-intro)*.9); g.scale((2.2 - 1.2*intro)*K, (2.2 - 1.2*intro)*K);
    // the lit hour rod stays soft where it would sit behind the text
    const inText = PORTRAIT ? (i >= 4 && i <= 8) : (i >= 1 && i <= 5);
    const on = i === hour && !inText, mid = i === hour && inText;
    const r0 = 96, r1 = 212, hw = 10;
    // upper facet (lit) and lower facet (shade): a hexagonal glass prism seen side-on
    const up = g.createLinearGradient(0,-hw,0,0), dn = g.createLinearGradient(0,0,0,hw);
    if (on) { up.addColorStop(0,'#9fe6ff'); up.addColorStop(1,'#f2fcff'); dn.addColorStop(0,'#bdeeff'); dn.addColorStop(1,'#4fb6ee'); }
    else if (mid) { up.addColorStop(0,'rgba(50,110,180,.9)'); up.addColorStop(1,'rgba(110,175,230,.9)'); dn.addColorStop(0,'rgba(80,140,210,.9)'); dn.addColorStop(1,'rgba(30,70,140,.9)'); }
    else { up.addColorStop(0,'rgba(24,60,120,.9)'); up.addColorStop(1,'rgba(70,135,205,.9)'); dn.addColorStop(0,'rgba(40,95,165,.9)'); dn.addColorStop(1,'rgba(12,32,80,.9)'); }
    g.fillStyle = up; g.fillRect(r0,-hw,r1-r0,hw);
    g.fillStyle = dn; g.fillRect(r0,0,r1-r0,hw);
    g.fillStyle = on ? 'rgba(255,255,255,.9)' : 'rgba(160,210,255,.35)'; g.fillRect(r0,-1,r1-r0,1.2);
    // rectangular end caps
    g.fillStyle = on ? '#dff6ff' : 'rgba(90,150,215,.85)'; g.fillRect(r1,-hw,5,hw*2);
    g.fillStyle = on ? '#8fd8ff' : 'rgba(30,70,140,.85)'; g.fillRect(r0-4,-hw,4,hw*2);
    g.strokeStyle = on ? 'rgba(255,255,255,.8)' : 'rgba(140,190,255,.35)'; g.lineWidth = 1; g.strokeRect(r0-4,-hw,r1-r0+9,hw*2);
    g.restore();
  }
  g.restore();
  // keep the text area calm, as the real screen does
  if (PORTRAIT) { const r = g.createLinearGradient(0,OY+270,0,SH-56); r.addColorStop(0,'rgba(12,8,32,0)'); r.addColorStop(.25,'rgba(12,8,32,.5)'); r.addColorStop(1,'rgba(12,8,32,.6)'); g.fillStyle = r; g.fillRect(0,OY+270,SW,SH-56-OY-270); }
  else { const r = g.createLinearGradient(OX+300,0,OX+640,0); r.addColorStop(0,'rgba(12,8,32,0)'); r.addColorStop(.35,'rgba(12,8,32,.5)'); r.addColorStop(1,'rgba(12,8,32,.58)'); g.fillStyle = r; g.fillRect(OX+300,56,SW-OX-300,SH-112); }
}
let clockLayer = null, clockKey = '';
function drawClock(t){
  const intro = reduce ? 1 : ease(clamp((performance.now() - S.t0)/1300));
  const { cx, cy, K } = clockGeom();
  if (intro < 1) {
    paintClockStatic(ctx, intro, false);
    ctx.fillStyle = `rgba(0,0,0,${1-intro})`; ctx.fillRect(0,0,SW,SH);
  } else {
    const key = [cv.width, cv.height, OX, OY, new Date().getHours() % 12].join(':');
    if (key !== clockKey) {
      clockLayer = clockLayer || document.createElement('canvas');
      clockLayer.width = cv.width; clockLayer.height = cv.height;
      const g = clockLayer.getContext('2d'); g.setTransform(RES,0,0,RES,0,0);
      paintClockStatic(g, 1, true); clockKey = key;
    }
    ctx.setTransform(1,0,0,1,0,0); ctx.drawImage(clockLayer, 0, 0); ctx.setTransform(RES,0,0,RES,0,0);
  }
  drawOrbs(cx, cy, 45*K, t);
}

/* B: grey fog from the four-corner gradient, tinted per save */
const fogBase = noiseCanvas(2,2,(() => { const c = [[188,188,180],[104,104,92],[140,140,130],[48,50,36]]; let i = 0; return () => [...c[i++], 255]; })());
function cornerCanvas(h){ const c = document.createElement('canvas'); c.width = 2; c.height = 2; const g = c.getContext('2d');
  [[0,0,`hsl(${h} 55% 48%)`],[1,0,`hsl(${h+30} 45% 26%)`],[0,1,`hsl(${h-20} 50% 36%)`],[1,1,`hsl(${h} 55% 10%)`]].forEach(([x,y,col]) => { g.fillStyle = col; g.fillRect(x,y,1,1); }); return c; }
let tintCanvas = null, tintHue = null;
function drawFog(t){
  ctx.imageSmoothingEnabled = true;
  // diagonal light-grey to dark-olive, as in the console capture
  const fg = ctx.createLinearGradient(0, 0, SW, SH);
  fg.addColorStop(0,'#b9b9b1'); fg.addColorStop(.45,'#85857a'); fg.addColorStop(1,'#34362a');
  ctx.fillStyle = fg; ctx.fillRect(0,0,SW,SH);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  S.tint = S.scene === 'save' ? (reduce ? 1 : clamp((performance.now() - S.t0)/600)) : 0;
  if (S.tint > .01) {
    const h = CARDS[S.card][S.save].h;
    const tg = ctx.createLinearGradient(0, 0, SW, SH);
    tg.addColorStop(0, `hsl(${h} 55% 48%)`); tg.addColorStop(.5, `hsl(${h - 20} 48% 30%)`); tg.addColorStop(1, `hsl(${h} 55% 10%)`);
    ctx.globalAlpha = S.tint; ctx.fillStyle = tg; ctx.fillRect(0,0,SW,SH); ctx.globalAlpha = 1;
  }
}

function draw(now){
  const t = (now - S.t0)/1000, s = S.scene;
  if (s === 'card') { const b = document.querySelectorAll('.save')[S.save]; if (b && b._cv) renderModel(b._cv, b._id, now/1000); }
  if (s === 'save') { const p = CARDS[S.card][S.save]; if (MODELS[p.id]) renderModel($('#bigMdl'), p.id, now/1000); }
  if (s === 'boot') drawBoot(t);
  else if (s === 'menu') drawMenu(now/1000);
  else if (s === 'conf' || s === 'ver') { drawClock(now/1000); if (s === 'ver') { ctx.fillStyle = 'rgba(8,5,24,.62)'; ctx.fillRect(0,56,SW,SH-112); } }
  else drawFog(now/1000);
}
const grain = $('#grain'), gctx = grain.getContext('2d'), gimg = gctx.createImageData(320,224);
let lastGrain = 0;
function drawGrain(now){
  if (now - lastGrain < 70) return; lastGrain = now;
  const d = gimg.data; for (let i = 0; i < d.length; i += 4) { const v = Math.random()*255; d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255; }
  gctx.putImageData(gimg, 0, 0);
}
drawGrain(0);
let rafOn = false;
/* ~60 fps cap: 120 Hz screens would otherwise redraw twice as often for no visible gain */
let lastFrame = 0;
function loop(now){ if (reduce) { rafOn = false; return; } requestAnimationFrame(loop); if (now - lastFrame < 15) return; lastFrame = now; draw(now); drawGrain(now); }
function startLoop(){ if (!rafOn && !reduce) { rafOn = true; requestAnimationFrame(loop); } }
mq.addEventListener('change', e => { reduce = e.matches; startLoop(); if (reduce && S.scene === 'boot') { clearTimeout(bootTimer); show('menu'); } draw(performance.now()); });

buildGrid();
setLayout();
screen.focus({preventScroll:true});
let seenBoot = false; try { seenBoot = sessionStorage.getItem('lvBooted') === '1'; } catch (e) {}
document.querySelectorAll('.dev .cap').forEach((c, i) => { if (i < 3) c.textContent = CARDS[i].length + ' saves'; });
const R0 = routeFromURL();
if (R0) {
  try { sessionStorage.setItem('lvBooted', '1'); } catch (e) {}
  if (R0.scene === 'conf') S.menu = 1; else { S.card = S.dev = R0.card; S.save = R0.save; buildGrid(); }
  S.opt = 0; show(R0.scene);
} else if (seenBoot) show('menu'); else boot();
startLoop();
if (reduce) draw(performance.now());
})();
