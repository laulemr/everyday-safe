/* ===== ESQ Ready 2.0 — part 1: state, helpers ===== */
const KEY='esq-ready-v2', KEY1='esq-ready-v1';
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>[...el.querySelectorAll(s)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const escR=v=>esc(v).replace(/&lt;(\/?)(b|i)&gt;/g,'<$1$2>');
const pick=a=>a[Math.floor(Math.random()*a.length)];
const DAY=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
const WEEK=()=>Math.floor((DAY()+3)/7);
const IVL=[0,1,3,7,14,30];
const TIER={A:0,B:1,C:2};

const DEF={v:2,onboarded:false,floor:null,conf0:null,conf1:null,done:{},acc:{},prog:{},lb:{},ep:{},missions:{},badges:{},warden:'',name:'',next:null,finalBest:null,lastVisit:null,alertusNote:null,pulse:{},kw:null,epoch:0,_t:0};
const fresh=()=>JSON.parse(JSON.stringify(DEF));
let S=fresh();
const ID=/^[a-z0-9-]{1,40}$/;
const num=(v,lo,hi)=>{v=+v; return Number.isFinite(v)?Math.min(hi,Math.max(lo,Math.round(v))):lo;};

/* v1 -> v2 migration: lesson ids, review history, missions */
const V1MAP={evac:'1-1',plan:'1-2',fire:'1-3',mobility:'1-4',room:'2-1','u-control':'2-2',notfire:'2-4',medical:'3-1',coffee:'3-2',threats:'3-3',alerts:'3-4','u-report':'3-5','u-care':'4-1','u-rights':'4-3','u-psych':'4-5',late:'5-1',downtown:'5-2',final:'final'};
function fromV1(o){const n=fresh(); if(!o||typeof o!=='object') return n;
  n.onboarded=!!o.onboarded; n.floor=o.floor; n.conf0=o.conf0; n.conf1=o.conf1; n.finalBest=o.finalBest==null?null:o.finalBest; n.warden=o.warden||''; n.alertusNote=o.alertusNote||null; n.epoch=+o.epoch||0; n._t=+o._t||0;
  Object.keys(o.done||{}).forEach(k=>{if(V1MAP[k]) n.done[V1MAP[k]]=true;});
  Object.keys(o.acc||{}).forEach(k=>{if(V1MAP[k]) n.acc[V1MAP[k]]=o.acc[k];});
  Object.keys(o.lb||{}).forEach(k=>{const r=o.lb[k]; if(r&&typeof r==='object') n.lb[k]={b:r.b,d:r.d,n:r.n,c:r.b>=3?2:r.b>=1?1:0,lc:-1,w:0};});
  const Q={save:'save',alertus:'alertus',aed:'aed',warden:'warden'}; Object.keys(o.quests||{}).forEach(k=>{if(Q[k]) n.missions[Q[k]]=+o.lastRef||DAY();});
  if(o.next&&typeof o.next.t==='string') n.next={t:o.next.t,lesson:V1MAP[o.next.lesson]||'',day:o.next.day,status:o.next.status||null};
  return n;}
function coerceS(o){if(!o||typeof o!=='object') return fresh(); if(o.v!==2) o=fromV1(o);
  ['done','acc','prog','lb','ep','missions','badges','pulse'].forEach(k=>{if(!o[k]||typeof o[k]!=='object'||Array.isArray(o[k])) o[k]={};});
  o.v=2; o.onboarded=!!o.onboarded; ['epoch','_t'].forEach(k=>o[k]=num(o[k],0,1e14));
  o.finalBest=o.finalBest==null?null:num(o.finalBest,0,100); ['conf0','conf1'].forEach(k=>{if(![1,2,3,4,5].includes(o[k])) o[k]=null;});
  o.lastVisit=o.lastVisit==null?null:num(o.lastVisit,0,1e6);
  if(o.floor!=null&&!/^[C1-4]$/.test(String(o.floor))) o.floor=null;
  o.warden=typeof o.warden==='string'?o.warden.slice(0,60):''; o.name=typeof o.name==='string'?o.name.slice(0,40):'';
  if(typeof o.alertusNote!=='string'||!['ok','x','none'].includes(o.alertusNote)) o.alertusNote=null;
  if(!(o.next&&typeof o.next==='object'&&typeof o.next.t==='string')) o.next=null; else o.next={t:o.next.t.slice(0,200),lesson:ID.test(o.next.lesson||'')?o.next.lesson:'',day:num(o.next.day,0,1e6),status:['yes','not','stuck'].includes(o.next.status)?o.next.status:null};
  if(!(o.kw&&typeof o.kw==='object'&&/^k\d{8,40}$/.test(o.kw.id||''))) o.kw=null; else o.kw={w:num(o.kw.w,0,1e6),id:o.kw.id};
  for(const k of Object.keys(o.done)){if(!ID.test(k)) delete o.done[k]; else o.done[k]=true;}
  for(const k of Object.keys(o.acc)){if(!ID.test(k)) delete o.acc[k]; else o.acc[k]=num(o.acc[k],0,100);}
  for(const k of Object.keys(o.badges)){if(!ID.test(k)) delete o.badges[k]; else o.badges[k]=num(o.badges[k],1,1e14);}
  for(const k of Object.keys(o.missions)){if(!ID.test(k)) delete o.missions[k]; else o.missions[k]=num(o.missions[k],0,1e6);}
  for(const k of Object.keys(o.ep)){const e=o.ep[k]; if(!/^w\d{1,6}$/.test(k)||!e||typeof e!=='object') delete o.ep[k]; else o.ep[k]={n:num(e.n,0,99),acc:num(e.acc,0,100)};}
  for(const k of Object.keys(o.pulse)){const v=o.pulse[k]; if(!/^w\d{1,6}$/.test(k)||!Array.isArray(v)) delete o.pulse[k]; else o.pulse[k]=v.filter(x=>['stairs','alertus','report','checkin','none'].includes(x));}
  for(const k of Object.keys(o.lb)){const r=o.lb[k]; if(!ID.test(k)||!r||typeof r!=='object') delete o.lb[k]; else o.lb[k]={b:num(r.b,0,5),d:num(r.d,0,1e6),n:num(r.n,0,1e5),c:num(r.c,0,1e4),lc:r.lc==null?-1:num(r.lc,-1,1e6),w:r.w?1:0};}
  for(const k of Object.keys(o.prog)){if(!ID.test(k)||!o.prog[k]||typeof o.prog[k]!=='object') delete o.prog[k];}
  if(o.done.final&&!(o.finalBest>=80)) delete o.done.final;
  return o;}
function mergeS(loc,rem){
  const pristine=x=>!x.onboarded&&!Object.keys(x.done||{}).length;
  if(pristine(loc)&&!pristine(rem)&&(rem.epoch||0)>=(loc.epoch||0)){const o=coerceS(Object.assign(fresh(),rem)); o.warden=loc.warden; o.name=loc.name; return o;}
  if((rem.epoch||0)!==(loc.epoch||0)){const w=(rem.epoch||0)>(loc.epoch||0)?rem:loc; const o=coerceS(Object.assign(fresh(),w)); o.warden=loc.warden; o.name=loc.name; return o;}
  const newer=(rem._t||0)>(loc._t||0)?rem:loc, older=newer===rem?loc:rem;
  const o=coerceS(Object.assign(fresh(),older,newer)); const A=coerceS(Object.assign(fresh(),older)), B=coerceS(Object.assign(fresh(),newer));
  ['done','badges','pulse'].forEach(k=>o[k]=Object.assign({},A[k],B[k]));
  o.missions={}; new Set([...Object.keys(A.missions),...Object.keys(B.missions)]).forEach(k=>o.missions[k]=Math.max(A.missions[k]||0,B.missions[k]||0));
  o.acc={}; new Set([...Object.keys(A.acc),...Object.keys(B.acc)]).forEach(k=>o.acc[k]=Math.max(A.acc[k]||0,B.acc[k]||0));
  o.ep={}; new Set([...Object.keys(A.ep),...Object.keys(B.ep)]).forEach(k=>{const a=A.ep[k],b=B.ep[k]; o.ep[k]=!a?b:!b?a:{n:Math.max(a.n,b.n),acc:Math.max(a.acc,b.acc)};});
  o.lb={}; new Set([...Object.keys(A.lb),...Object.keys(B.lb)]).forEach(k=>{const a=A.lb[k],b=B.lb[k]; o.lb[k]=!a?b:!b?a:((b.n||0)>=(a.n||0)?b:a);});
  const fb=Math.max(A.finalBest||0,B.finalBest||0); if(fb) o.finalBest=fb;
  o.lastVisit=Math.max(A.lastVisit||0,B.lastVisit||0)||null;
  o.onboarded=!!(A.onboarded||B.onboarded); ['floor','conf0','conf1'].forEach(k=>{if(o[k]==null) o[k]=A[k]!=null?A[k]:B[k];});
  o.warden=loc.warden; o.name=loc.name; return o;}

try{const r=localStorage.getItem(KEY); if(r) S=coerceS(Object.assign(fresh(),JSON.parse(r))); else {const r1=localStorage.getItem(KEY1); if(r1) S=coerceS(JSON.parse(r1));}}catch(e){S=fresh();}
let STORE_OK=true; try{localStorage.setItem('esq-ready-t','1'); STORE_OK=localStorage.getItem('esq-ready-t')==='1'; localStorage.removeItem('esq-ready-t');}catch(e){STORE_OK=false;}
function save(){try{const c=JSON.parse(localStorage.getItem(KEY)||'null'); if(c&&typeof c==='object'&&(+c._t||0)>(S._t||0)) S=mergeS(S,coerceS(c));}catch(e){} S._t=Date.now(); try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){} syncSoon();}
addEventListener('storage',e=>{if(e.key!==KEY||!e.newValue) return; try{const c=coerceS(JSON.parse(e.newValue)); if((c._t||0)<=(S._t||0)) return; S=mergeS(S,c); if(!S.onboarded){onboard(0); return;} if(!PL||player.hidden) softRender();}catch(_){}});

function toast(html){$$('.toast').forEach(x=>x.remove()); const t=document.createElement('div'); t.className='toast'; t.setAttribute('aria-hidden','true'); t.innerHTML=html; document.body.appendChild(t); const lv=$('#live'); lv.textContent=''; requestAnimationFrame(()=>{lv.textContent=t.textContent;}); setTimeout(()=>t.remove(),Math.max(2400,Math.min(6000,1500+t.textContent.length*45)));}
function copyText(txt,done){try{navigator.clipboard.writeText(txt).then(()=>{toast(ic('check',18)+' Copied'); done&&done();},()=>toast('Copy blocked here. Select the text instead.'));}catch(e){toast('Copy blocked here. Select the text instead.');}}
let dlgPrev=null;
function dialog(title,text,yes,no,onYes){$('#dlgT').textContent=title; $('#dlgP').textContent=text; $('#dlgYes').textContent=yes; $('#dlgNo').textContent=no; dlgPrev=document.activeElement; const d=$('#dlg'); d.hidden=false; $('#dlgNo').focus();
  const close=()=>{d.hidden=true; if(dlgPrev&&dlgPrev.focus) dlgPrev.focus();};
  $('#dlgYes').onclick=()=>{d.hidden=true; onYes();}; $('#dlgNo').onclick=close;}
