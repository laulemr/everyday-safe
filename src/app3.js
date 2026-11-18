/* ===== part 3: question bank, item states, player and interactions ===== */
let BANK=null, QB={}, bankP=null;
function loadBank(){ if(BANK) return Promise.resolve(BANK); if(bankP) return bankP;
  bankP=fetch('data/bank.json',{cache:'no-cache'}).then(r=>{if(!r.ok) throw new Error('bank '+r.status); return r.json();}).then(b=>{
    if(!b||!Array.isArray(b.questions)||!Array.isArray(b.topics)) throw new Error('bad bank');
    const okQ=q=>{if(!q||typeof q.id!=='string'||!ID.test(q.id)||typeof q.q!=='string'||typeof q.lesson!=='string') return false;
      const f=q.format; if(!f) return Array.isArray(q.opts)&&q.opts.length>1&&q.opts.some(o=>o&&o.ok)&&q.opts.every(o=>o&&typeof o.t==='string');
      const d=q[f]; if(!d||typeof d!=='object') return false;
      if(f==='sort') return Array.isArray(d.buckets)&&Array.isArray(d.cards)&&d.cards.every(c=>d.buckets.includes(c.bucket));
      if(f==='order') return Array.isArray(d.steps)&&d.steps.length>1;
      if(f==='rank') return Array.isArray(d.items)&&d.items.length>1;
      if(f==='hotspot') return Array.isArray(d.list_alternative)&&d.list_alternative.some(o=>o.ok);
      if(f==='dialogue') return Array.isArray(d.opts)&&d.opts.some(o=>o.ok);
      if(f==='branching') return Array.isArray(d.nodes)&&d.nodes.length>0;
      return false;};
    b.questions=b.questions.filter(okQ); b.cases=(b.cases||[]).filter(c=>c&&ID.test(c.id||'')&&c.branching&&Array.isArray(c.branching.nodes));
    b.weeks=(Array.isArray(b.weeks)?b.weeks:[]).filter(w=>w&&w.title&&w.mission&&w.huddle&&Array.isArray(w.topics));
    const qb={}; b.questions.forEach(q=>qb[q.id]=q); b.cases.forEach(c=>qb[c.id]=c); QB=qb; BANK=b; try{softRender();}catch(e){console.error(e);} return b;})
    .catch(e=>{bankP=null; throw e;});
  return bankP;}
const lessonOfQ=q=>q.lesson==='Final'?'final':String(q.lesson).replace('.','-');
const eligible=q=>!!S.done[lessonOfQ(q)];
const pool=()=>BANK?BANK.questions.filter(eligible):[];
function lbUpdate(id,ok){const t=DAY(), r=S.lb[id]||{b:0,d:t,n:0,c:0,lc:-1,w:0}; r.n++;
  if(!ok){r.b=1; r.d=t+1; r.w=1;} else {r.w=0; if(r.lc!==t){r.c++; r.lc=t;} if(r.d<=t){r.b=Math.min(5,r.b+1); r.d=t+IVL[r.b];}}
  S.lb[id]=r;}
/* Unseen · Learning · Due · Needs practice · Retained (right on two separate days and spaced) */
function qstate(id){const r=S.lb[id]; if(!r) return 'unseen'; if(r.w) return 'practice'; if(r.d<=DAY()) return 'due'; if(r.c>=2&&r.b>=3) return 'retained'; return 'learning';}
const STN={unseen:'Unseen',learning:'Learning',due:'Due',practice:'Needs practice',retained:'Retained'};
const retainedN=()=>BANK?BANK.questions.filter(q=>qstate(q.id)==='retained').length:Object.keys(S.lb).filter(k=>qstate(k)==='retained').length;
function countStates(qs){const c={unseen:0,learning:0,due:0,practice:0,retained:0}; qs.forEach(q=>c[qstate(q.id)]++); return c;}
const topicName=id=>{const t=BANK&&BANK.topics.find(x=>x.id===id); return t?t.name:id;};
const weekTheme=()=>BANK&&BANK.weeks.length?BANK.weeks[WEEK()%BANK.weeks.length]:null;
const epiOf=()=>EPIS[WEEK()%EPIS.length];

function toItem(q){const b={bid:q.id,q:escR(q.q),tier:q.tier};
  const f=q.format;
  if(!f) return Object.assign(b,{type:q.type==='multi'?'multi':'choice',opts:shuffle(q.opts).map(o=>({t:escR(o.t),ok:o.ok?1:0,fb:escR(o.fb||'')})),fb:escR(q.fb||'')});
  const d=q[f];
  if(f==='dialogue') return Object.assign(b,{type:'dialogue',opts:shuffle(d.opts).map(o=>({t:escR(o.t),ok:o.ok?1:0,fb:escR(o.fb||'')}))});
  if(f==='sort') return Object.assign(b,{type:'sort',title:escR(q.title||''),buckets:d.buckets.map(escR),cards:d.cards.map(c=>({t:escR(c.t),bucket:escR(c.bucket),fb:escR(c.fb||'')}))});
  if(f==='order') return Object.assign(b,{type:'order',items:d.steps.map(escR),extra:d.distractor?[escR(d.distractor)]:[],fb:escR(d.fb||'')});
  if(f==='rank') return Object.assign(b,{type:'rank',items:d.items.map(i=>({t:escR(i.t),reason:escR(i.reason||'')}))});
  if(f==='hotspot'){const img=/^plan-/.test(q.id)?['plan',q.id==='plan-08'?'3':(S.floor||'2')]:q.id==='alerts-f01'?['qv','redx']:null;
    const opts=shuffle(d.list_alternative).map(o=>({t:escR(o.t),ok:o.ok?1:0,fb:escR(o.fb||'')}));
    return Object.assign(b,{type:opts.filter(o=>o.ok).length>1?'multi':'choice',hot:1,img2:img,opts,fb:escR(d.miss_fb||'')});}
  if(f==='branching') return Object.assign(b,{type:'branch',title:escR(q.title||''),setup:escR(d.setup||''),nodes:d.nodes.map(n=>({id:n.id,prompt:escR(n.prompt),choices:shuffle(n.choices).map(c=>({t:escR(c.t),consequence:escR(c.consequence||''),next:c.next,good:!!c.good}))})),resolution:escR(d.resolution||'')});
  return null;}

/* ---------- player ---------- */
let PL=null;
const NONQ=['intro','teach','bridge','story','worked','episode','checkin','model','compare','explore','mission'];
const player=$('#player'), pBody=$('#pBody'), pMain=$('#pMain'), pPrev=$('#pPrev');
function workedSteps(id){const w=WORKED[id]; if(!w) return [];
  return [{type:'worked',title:w.title,text:w.text,steps:w.steps},{type:'choice',faded:1,q:`${w.title}: what's the expert's next step?`,opts:w.opts.map(([t,ok,fb])=>({t,ok,fb}))}];}
function lessonPool(l){return BANK?BANK.questions.filter(q=>lessonOfQ(q)===l.id):[];}
function buildLesson(l,pickIds){
  if(l.flow){const body=l.flow().map(s=>s&&s.build?BUILD[s.build]():s).filter(Boolean); const LT=['teach','model','compare','explore'];
    return {steps:[{type:'intro',nl:body.filter(s=>LT.includes(s.type)).length,nq:body.filter(s=>!NONQ.includes(s.type)).length}].concat(body),picks:[]};}
  const cards=l.m?(LEARN[l.m]||[]).map((c,k)=>({c,vkey:l.m+'-'+k})):(l.cards||[]).map(([s,k])=>({c:LEARN[s][k],vkey:s+'-'+k}));
  let prac=[], picks=pickIds||[];
  if(l.final){const cs=BANK.cases; const cid=(pickIds&&pickIds[0])||pick(cs).id; picks=[cid];
    prac=[MBY('final').steps()[0], toItem(QB['final-f01']), toItem(QB[cid])].filter(Boolean);}
  else{
    if(l.m) prac=MBY(l.m).steps.map(s=>s.build?BUILD[s.build]():s);
    else if(l.story){const st=ULES[l.story].story; prac=[{type:'story',time:st.time,title:st.title,text:st.text}];}
    if(!pickIds){const extra=(l.bank||[]).filter(id=>QB[id]); const rest=shuffle(lessonPool(l).filter(q=>!extra.includes(q.id)&&!q.format)).sort((a,b)=>TIER[a.tier]-TIER[b.tier]).slice(0,l.n||0).map(q=>q.id); picks=extra.concat(shuffle(rest));}
    prac=prac.concat(picks.filter(id=>QB[id]).map(id=>toItem(QB[id])).filter(Boolean));}
  const nq=prac.filter(s=>!NONQ.includes(s.type)).length;
  const steps=[{type:'intro',nl:cards.length,nq}].concat(cards.map((x,k)=>({type:'teach',c:x.c,vkey:x.vkey,n:k+1,of:cards.length})));
  if(l.worked) steps.push(...workedSteps(l.worked));
  if(cards.length) steps.push({type:'bridge',nq,titles:cards.map(x=>typeof x.c.t==='function'?x.c.t():x.c.t)});
  return {steps:steps.concat(prac),picks};}
function startLesson(id,restart,resume){const l=LBY(id); if(!l) return; if(!unlocked(l)){toast('Finish Units 1–4 to unlock the final challenge.'); return;}
  const sp=S.prog[id]; if(!restart&&!resume&&sp&&sp.pos>0&&!S.done[id]){
    dialog('Pick up where you left off?',`You're partway through "${l.title}". Continue from where you stopped, or start this lesson again from the beginning.`,'Continue','Start over',()=>startLesson(id,false,true));
    $('#dlgYes').focus(); $('#dlgNo').onclick=()=>{$('#dlg').hidden=true; delete S.prog[id]; save(); startLesson(id,true,true);}; return;}
  if(!BANK){toast('Loading questions…'); loadBank().then(()=>startLesson(id,restart,true)).catch(()=>toast("Couldn't load the questions. Check your connection and try again.")); return;}
  const sv=!restart&&S.prog[id]; const {steps,picks}=buildLesson(l,sv&&Array.isArray(sv.pick)?sv.pick:null);
  openPlayer({kind:l.final?'final':'lesson',l,steps,picks,pos:sv&&sv.pos<steps.length?sv.pos:0,resumed:!!(sv&&sv.pos)});}
function openPlayer(o){
  PL=Object.assign({q:o.steps.map(s=>Object.assign({},s)),view:0,res:{},cache:{},right:0,of:0,first:0,inter:0,used:new Set(o.picks||[]),t0:Date.now(),done:false},o);
  PL.total=PL.q.length; PL.view=PL.pos||0;
  for(let k=0;k<PL.view;k++) if(!NONQ.includes(PL.q[k].type)) PL.res[k]={ok:true,skip:true};
  $('#pTitle').textContent=o.kind==='episode'?'Keep Ready episode':(o.l?o.l.title:'Lesson');
  player.hidden=false; setInert(true); document.body.style.overflow='hidden'; $('#pQuit').innerHTML=`${ic('x',20,2.6)}<span>Exit</span>`;
  renderStep(); if(o.resumed) toast("Welcome back. You're where you left off.");}
function setInert(on){[...document.body.children].forEach(el=>{if(['player','team','leads','onb','dlg','live'].includes(el.id)||el.classList.contains('toast')||el.tagName==='SCRIPT'||el.tagName==='STYLE'||el.tagName==='svg') return; if(on) el.setAttribute('inert',''); else el.removeAttribute('inert');});}
function closePlayer(){player.hidden=true; setInert(false); document.body.style.overflow=''; PL=null; render(); const h=$('.tab:not([hidden]) h1'); if(h){h.tabIndex=-1; h.focus({preventScroll:true});}}
function setBar(){const p=Math.round(Math.min(PL.view,PL.q.length)/PL.q.length*100); $('#pBar').style.width=p+'%'; $('#pBarWrap').setAttribute('aria-valuenow',p);
  const qs=PL.q.filter(s=>!NONQ.includes(s.type)); const qi=PL.q.slice(0,PL.view+1).filter(s=>!NONQ.includes(s.type)).length; $('#pCount').textContent=PL.done?'':(NONQ.includes((PL.q[PL.view]||{}).type)?'':`${qi} of ${qs.length}`);}
function can(on){if(PL&&!PL.res[PL.view]) pMain.disabled=!on;}
function saveProg(){if(!PL||PL.kind!=='lesson'||PL.done) return; S.prog[PL.l.id]={pick:PL.picks,pos:Math.min(PL.view,PL.total-1)}; save();}
function tagHTML(it){if(it._retry) return `<p class="tag" style="color:var(--amber)">${ic('back',16,3)} ${it._new?'A new situation':'Try it again'}</p>`;
  const lab={choice:'Choose the best action',multi:'Select all that apply',dialogue:'What would you say?',order:'Put the steps in order',rank:'Rank the fixes',sort:'Sort the situations',pairs:'Match',hazards:'Hazard hunt',branch:'Mini story',fade:'Finish the sequence',locate:'Find it on the plan'}[it.type]||'Practice';
  return `<p class="tag">${ic('target',16,3)} ${it.tag||(it.hot?'Find it':lab)}</p>`;}
function head(it,el){const img=it.img&&QIMG[it.img]?`<figure class="intro-img qimg"><img loading="lazy" decoding="async" src="${QIMG[it.img][0]}" alt="${esc(QIMG[it.img][1])}"></figure>`:it.img&&QV[it.img]?`<figure class="vis qv"><svg viewBox="0 0 320 130" role="img" aria-label="${esc(QV[it.img][0])}">${QV[it.img][1]}</svg></figure>`:'';
  const img2=it.img2?(it.img2[0]==='plan'?`<figure class="vis plan-img"><img loading="lazy" decoding="async" src="${VPLAN[it.img2[1]]}" alt="ESQ emergency floor plan for the ${FLOORS[it.img2[1]].name}, showing stairwells, exit doors, the mobility rescue location and AEDs."></figure>`:QV[it.img2[1]]?`<figure class="vis qv"><svg viewBox="0 0 320 130" role="img" aria-label="${esc(QV[it.img2[1]][0])}">${QV[it.img2[1]][1]}</svg></figure>`:''):'';
  const plain=['choice','dialogue','multi'].includes(it.type)&&!it._retry&&!it.tag&&!it.hot; el.insertAdjacentHTML('beforeend',`<div class="qcard">${qmeta()}${plain?'':tagHTML(it)}${img}${img2}<h2 class="qh qq">${it.q}</h2></div>`);}
function refreshMeta(){const q=$('.qcard',pBody), on=!!q&&!PL.done; $('#pScroll').classList.toggle('isq',on); $('#pCount').style.visibility=on?'hidden':'';
  if(q){const t=document.createElement('div'); t.innerHTML=qmeta(); const a=$('.qmeta',q), b=$('.qof',q); if(a&&t.children[0]) a.replaceWith(t.children[0]); if(b&&t.children[0]) b.replaceWith(t.children[0]);}}
function qmeta(){if(!PL) return ''; const n=PL.q.filter(s=>!NONQ.includes(s.type)).length, qi=PL.q.slice(0,PL.view+1).filter(s=>!NONQ.includes(s.type)).length; if(!n) return '';
  const r=PL.first, m=PL.inter-PL.first, R_=27, C=2*Math.PI*R_, f=Math.min(1,qi/n);
  return `<div class="qmeta"><span class="qc ok"><i></i><b>${r}</b> right</span>
    <span class="qring" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="${R_}" fill="none" stroke="#E0E0E0" stroke-width="5"/><circle cx="32" cy="32" r="${R_}" fill="none" stroke="#275D38" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(C*f).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 32 32)"/></svg><b>${qi}</b></span>
    <span class="qc no"><b>${m}</b> to review<i></i></span></div><p class="qof">Question ${qi} of ${n}</p>`;}
function renderStep(){
  setBar(); const it=PL.q[PL.view]; if(!it) return finish();
  pBody.innerHTML=''; let c=PL.cache[PL.view];
  if(PL.view>0&&!PL.done){const l=PL.l, U=l&&UNITS[l.u-1]; const t=PL.kind==='episode'?'Keep Ready':l&&l.final?'Final challenge':(U?UFULL[U.n]:''); const sub=PL.kind==='episode'?`Week ${krWeekN()} episode`:l&&!l.final?`Lesson ${l.id.replace('-','.')} · ${l.title}`:'';
    pBody.insertAdjacentHTML('beforeend',`<div class="lhead" style="--uc:${l&&l.u?uc(l.u):'var(--a1)'}"><button type="button" class="lback" aria-label="Back to the previous screen">${ic('back',22,2.6)}</button><div><p class="lt">${t}</p><p class="ls">${sub}</p></div></div>`); $('.lback',pBody).onclick=()=>pPrev.onclick();}
  if(!c){const box=document.createElement('div'); box.style.cssText='display:grid;gap:16px'; PL.cache[PL.view]=c={el:box,eval:null}; pBody.appendChild(box); PL.cur=c; (R[it.type]||R.choice)(it,box);}
  else {pBody.appendChild(c.el); PL.cur=c;}
  refreshMeta();
  const answered=!!PL.res[PL.view];
  pMain.hidden=!!(it.auto&&!answered);
  pPrev.hidden=true;
  if(NONQ.includes(it.type)){pMain.disabled=false; pMain.textContent=it.type==='intro'||it.type==='episode'?'Start':it.type==='bridge'?'Start practice':'Next';}
  else if(answered){pMain.disabled=false; pMain.textContent='Next';}
  else {pMain.textContent=it.auto?'Next':(it.btn||'Submit'); pMain.disabled=!c.ready;}
  const h=$('.qh',c.el); if(h){h.tabIndex=-1; h.focus({preventScroll:true});}
  $('#pScroll').scrollTop=0;}
pMain.onclick=()=>{if(!PL) return; if(PL.done){PL.after?PL.after():closePlayer(); return;}
  const it=PL.q[PL.view];
  if(NONQ.includes(it.type)||PL.res[PL.view]){PL.view++; renderStep(); saveProg(); return;}
  if(PL.cur.eval) resolve(PL.cur.eval());};
pPrev.onclick=()=>{if(PL&&PL.view>0){PL.view--; renderStep();}};
function resolve(r){const it=PL.q[PL.view]; if(PL.res[PL.view]) return;
  const ok=!!r.ok; PL.res[PL.view]=r; const right=r.of?r.right:(ok?1:0), of=r.of||1;
  if(!it._retry){PL.right+=right; PL.of+=of; PL.inter++; if(ok) PL.first++;}
  if(it.bid&&!it._retry&&QB[it.bid]&&!QB[it.bid].id.startsWith('case-')) lbUpdate(it.bid,ok);
  if(!ok&&PL.kind==='lesson'&&(it._n||0)<2){let nx=null; if(it.bid){const l=PL.l; const alt=lessonPool(l).filter(q=>!PL.used.has(q.id)&&!q.format&&q.id!==it.bid); if(alt.length){const q=pick(alt); PL.used.add(q.id); nx=Object.assign(toItem(q),{_retry:true,_new:true,_n:(it._n||0)+1});}}
    PL.q.push(nx||Object.assign({},it,{_retry:true,_n:(it._n||0)+1,opts:it.opts?shuffle(it.opts):it.opts}));}
  PL.total=PL.q.length; setBar();
  const box=PL.cur.el; const old=$('.fb',box); if(old) old.remove();
  const title=r.title||(ok?'Good call':'What would happen');
  box.insertAdjacentHTML('beforeend',`<div class="fb ${ok?'ok':'no'}" role="status" tabindex="-1"><div class="fbh"><span class="fbi">${ok?ic('check',22,3):'<b aria-hidden="true" style="font:700 22px var(--serif)">!</b>'}</span><div><p class="fbt">${title}</p>${r.sub?`<p class="fbs">${r.sub}</p>`:''}</div></div><div class="fbb">${r.body||''}${!ok&&PL.kind==='lesson'&&(it._n||0)<2?'<p class="muted small">You\'ll get another situation like this before the lesson ends.</p>':''}</div></div>`);
  addReport(box,it); const fb=$('.fb',box); fb.focus({preventScroll:true}); fb.scrollIntoView({block:'nearest',behavior:RM?'auto':'smooth'});
  pMain.hidden=false; pMain.disabled=false; pMain.textContent=PL.view>=PL.q.length-1?'Finish':'Next question →'; pPrev.hidden=true; refreshMeta(); saveProg();}
function addReport(el,it){if(!it||!it.bid) return; const fb=$('.fb',el); if(!fb) return;
  if(!CAP.com){fb.insertAdjacentHTML('beforeend',`<p class="muted rep-row">Spot an error? Tell your team lead (question ${esc(it.bid)}).</p>`); return;}
  fb.insertAdjacentHTML('beforeend',`<p class="rep-row"><button class="link rep" type="button">Report a problem with this question</button> <span class="muted">ID ${esc(it.bid)}</span></p>`);
  $('.rep',fb).onclick=async()=>{try{const r=await CAP.com.openComposer({element:$('.qh',el)||el}); if(r&&r.opened===false) toast('Click in the page first, then try again.');}catch(e){toast("Comments aren't available here.");}};}
$('#pQuit').onclick=()=>{if(!PL) return; if(PL.done){closePlayer(); return;} saveProg();
  dialog(PL.kind==='episode'?'Leave this episode?':'Leave this lesson?',PL.kind==='lesson'?'Your place is saved. Pick up where you left off any time.':'Answers so far are saved to your review schedule.','Keep going','Leave',()=>{});
  $('#dlgNo').onclick=()=>{$('#dlg').hidden=true; closePlayer();}; $('#dlgYes').onclick=()=>{$('#dlg').hidden=true; pMain.focus();};};
const markL=(t,c)=>`<br><span class="mark-l ${c}">${t}</span>`;

/* ---------- interactions ---------- */
const R={};
const uc=n=>`var(${(UNITS[n-1]||{c:'--uf'}).c})`;
R.intro=(it,el)=>{const l=PL.l, u=UNITS[l.u-1];
  const img=l.m&&INTROIMG[l.m]?`<figure class="intro-img"><img loading="lazy" decoding="async" src="${INTROIMG[l.m][0]}" alt="${esc(INTROIMG[l.m][1])}"></figure>`:'';
  el.style.setProperty('--uc',uc(l.u));
  el.innerHTML=`<p class="tag" style="color:${uc(l.u)}">${l.final?'Final challenge':`Unit ${l.u} · ${u.short} · Lesson ${l.id.replace('-','.')}`}</p>
   <h2 class="qh">${l.title}</h2>
   <div class="goalbox"><b>After this lesson you can:</b> ${l.goal.charAt(0).toLowerCase()+l.goal.slice(1)}</div>
   <ul class="chips">${it.nl?`<li>${ic('book',16)} ${it.nl} screen${it.nl>1?'s':''} to learn</li>`:''}<li>${ic('target',16)} ${it.nq} practice item${it.nq>1?'s':''}</li><li>About ${l.final?5:Math.max(3,Math.round((it.nl*25+it.nq*30)/60))} min</li></ul>
   ${img}
   <p class="muted">${l.final?'Match the numbers, sort who to call, then work through one situation. 80% right on the first try earns the Everyday Safe badge.':'Read the cards, see how an expert would handle it, then practise. Missed something? You\'ll get another situation like it.'}</p>`;};
R.teach=(it,el)=>{const pts=typeof it.c.p==='function'?it.c.p():it.c.p, ttl=typeof it.c.t==='function'?it.c.t():it.c.t, fl=S.floor||'2', vk=it.vkey;
  const vis=LIMG[vk]?`<figure class="intro-img"><img loading="lazy" decoding="async" src="${LIMG[vk][0]}" alt="${esc(LIMG[vk][1])}"></figure>`:vk==='plan-1'?`<figure class="vis plan-img"><img loading="lazy" decoding="async" src="${VPLAN[fl]}" alt="ESQ emergency plan for the ${F().name}, showing emergency stairwells, exit doors, the mobility rescue location${fl==='4'?'':' and AED locations'}."></figure>`:VIS[vk]?`<figure class="vis" style="--c:${uc(PL.l.u)}"><svg viewBox="0 0 320 180" role="img" aria-label="${esc(VIS[vk][0])}">${VIS[vk][1]}</svg></figure>`:'';
  const xs=typeof it.c.x==='function'?it.c.x():it.c.x;
  el.innerHTML=`<p class="tag">${ic('book',16,3)} Learn · ${it.n} of ${it.of}</p><h2 class="qh">${ttl}</h2>${vis}
   <ul class="tpts">${pts.map(x=>`<li><span class="dot">${ic('check',14,3.2)}</span><span>${x}</span></li>`).join('')}</ul>
   ${xs&&xs.length?`<details class="more"><summary>More detail</summary><ul>${xs.map(x=>`<li>${x}</li>`).join('')}</ul></details>`:''}`;};
R.worked=(it,el)=>{el.innerHTML=`<p class="tag">${ic('book',16,3)} Worked example · how an expert thinks it through</p><h2 class="qh">${it.title}</h2><p class="txt">${it.text}</p>
  <ol class="wsteps">${it.steps.map(s=>`<li><b>${s[0]}</b> ${s[1]}</li>`).join('')}<li><b>Your turn.</b> Choose the next step on the next screen.</li></ol>`;};
R.bridge=(it,el)=>{el.innerHTML=`<p class="tag" style="color:var(--green)">${ic('check',16,3)} Learn · done</p><h2 class="qh">Your turn: ${it.nq} practice item${it.nq>1?'s':''}</h2><p class="muted">Keep in mind:</p><ul class="chips">${it.titles.map(t=>`<li>${t}</li>`).join('')}</ul>`;};
R.story=(it,el)=>{const m=PL.l&&PL.l.m;
  el.innerHTML=`<p class="tag">${ic('pin',16,3)} Your situation</p><div class="scene2 ${it.alarm?'alarm':''}">${ic(it.alarm?'bell':'pin',28)}<div><p class="when">${it.time}</p><h2 class="qh">${it.title}</h2></div></div><p class="txt">${it.text}</p>${(()=>{const S_=it.simg||(m&&STORYIMG[m]); return S_?`<figure class="intro-img"><img loading="lazy" decoding="async" src="${S_[0]}" alt="${esc(S_[1])}"></figure>`:'';})()}`;};
function optBtn(o,k){const b=document.createElement('button'); b.type='button'; b.className='opt'; b.dataset.key=k+1; b.setAttribute('aria-pressed','false'); b.innerHTML=`<span class="key" aria-hidden="true">${'ABCDEFGH'[k]}</span><span class="ot">${o.t}${o.sub?`<span class="sub">${o.sub}</span>`:''}</span>`; return b;}
R.choice=(it,el)=>{head(it,el); const box=document.createElement('div'); box.className='opts'+(it.type==='dialogue'?' say':''); box.setAttribute('role','group'); box.setAttribute('aria-label','Options'); let sel=null;
  it.opts.forEach((o,k)=>{const b=optBtn(o,k); b.onclick=()=>{if(PL.res[PL.view]) return; $$('.opt',box).forEach(x=>x.setAttribute('aria-pressed','false')); b.setAttribute('aria-pressed','true'); sel=k; PL.cur.ready=true; can(true);}; box.appendChild(b);});
  el.appendChild(box);
  PL.cur.eval=()=>{const o=it.opts[sel], right=it.opts.find(x=>x.ok); $$('.opt',box).forEach((x,k)=>{x.disabled=true; x.setAttribute('aria-pressed','false'); const tx=$('.ot',x);
      if(it.opts[k].ok){x.classList.add('ok'); tx.insertAdjacentHTML('beforeend',markL(k===sel?'✓ Your choice · best move':'✓ Best move','ok'));} else if(k===sel){x.classList.add('no'); tx.insertAdjacentHTML('beforeend',markL('Your choice','you'));}});
    const cq=x=>x.c||CONSEQ[x.t.replace(/<[^>]+>/g,'')]||'';
    const youC=cq(o), bestC=cq(right);
    if(o.ok) return {ok:true,title:'Good call',body:`<div class="cq good"><p class="lab">What happens</p><p>${youC||o.fb||it.fb||''}</p></div>${youC&&(o.fb||it.fb)?`<p class="why"><b>Why it works:</b> ${o.fb||it.fb}</p>`:''}`};
    return {ok:false,title:'What would happen',body:`<div class="cq"><p class="lab">You chose: ${o.t}</p><p>${youC||o.fb||''}</p>${youC&&o.fb?`<p class="why"><b>Why:</b> ${o.fb}</p>`:''}</div>
      <div class="cq good"><p class="lab">A stronger move: ${right.t}</p><p>${bestC||right.fb||''}</p></div>`};};
  const ev=PL.cur.eval;};
R.dialogue=R.choice;
R.multi=(it,el)=>{head(it,el); el.insertAdjacentHTML('beforeend','<p class="hint">Select all that apply.</p>'); const box=document.createElement('div'); box.className='opts';
  it.opts.forEach((o,k)=>{const b=optBtn(o,k); b.onclick=()=>{if(PL.res[PL.view]) return; b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true'); PL.cur.ready=$$('[aria-pressed="true"]',box).length>0; can(PL.cur.ready);}; box.appendChild(b);});
  el.appendChild(box);
  PL.cur.eval=()=>{let exact=true, nR=0; const fbs=[];
    $$('.opt',box).forEach((x,k)=>{const on=x.getAttribute('aria-pressed')==='true', o=it.opts[k]; x.disabled=true; x.setAttribute('aria-pressed','false'); const tx=$('.ot',x);
      if(o.ok){x.classList.add('ok'); if(on) nR++; else exact=false; tx.insertAdjacentHTML('beforeend',markL(on?'✓ You chose this · counts':'✓ Also counts','ok'));} else if(on){x.classList.add('no'); exact=false; tx.insertAdjacentHTML('beforeend',markL("You chose this · doesn't count",'you'));} else nR++;
      if(o.fb&&(on||o.ok)) fbs.push(`<li><b>${o.t}</b>: ${o.fb}</li>`);});
    return {ok:exact,right:nR,of:it.opts.length,title:exact?"That's right":'Almost',body:`${it.fb?`<p>${it.fb}</p>`:''}${fbs.length?`<ul>${fbs.join('')}</ul>`:''}`};};};
R.order=(it,el)=>{head(it,el); el.insertAdjacentHTML('beforeend',`<p class="hint">Tap the steps in order.${it.extra&&it.extra.length?` ${it.extra.length===1?'One step doesn\'t':'Some steps don\'t'} belong.`:''} Tap a placed step to send it back.</p>`);
  const n=it.items.length; const tiles=shuffle(it.items.map((t,k)=>({t,k})).concat((it.extra||[]).map((t,k)=>({t,k:n+k})))); let seq=[];
  const ans=document.createElement('div'); ans.className='answer'; ans.dataset.empty='Your order appears here'; ans.setAttribute('role','group'); ans.setAttribute('aria-label','Your order');
  const bank=document.createElement('div'); bank.className='tiles'; bank.setAttribute('role','group'); bank.setAttribute('aria-label','Steps to place'); el.append(ans,bank);
  function draw(){ans.innerHTML=''; seq.forEach((k,p)=>{const t=tiles.find(x=>x.k===k); const b=document.createElement('button'); b.type='button'; b.className='chip'; b.innerHTML=`<span class="n">${p+1}</span><span>${t.t}</span>`; b.setAttribute('aria-label',`Step ${p+1}: ${t.t.replace(/<[^>]+>/g,'')}. Remove`); b.onclick=()=>{if(PL.res[PL.view]) return; seq=seq.filter(x=>x!==k); draw();}; ans.appendChild(b);});
    bank.innerHTML=''; tiles.forEach((t,j)=>{const b=document.createElement('button'); b.type='button'; const used=seq.includes(t.k); b.className='chip'+(used?' used':''); b.innerHTML=`<span>${t.t}</span>`; b.dataset.key=j+1; if(used){b.disabled=true; b.setAttribute('aria-hidden','true');} b.onclick=()=>{if(PL.res[PL.view]) return; seq.push(t.k); draw(); const nx=bank.querySelector('.chip:not(.used)'); (nx||pMain).focus();}; bank.appendChild(b);});
    PL.cur.ready=seq.length>=n; can(PL.cur.ready);}
  draw();
  PL.cur.eval=()=>{let nR=0; seq.forEach((k,p)=>{if(k===p&&k<n) nR++;}); const nX=seq.filter(k=>k>=n).length; const ok=nR===n&&nX===0;
    $$('.chip',ans).forEach((c,p)=>{c.disabled=true; c.classList.add(seq[p]===p&&seq[p]<n?'ok':'no'); c.insertAdjacentHTML('beforeend',seq[p]===p&&seq[p]<n?'<span class="mark-l ok">✓</span>':'<span class="mark-l you">moved</span>');}); $$('.chip',bank).forEach(c=>c.disabled=true);
    return {ok,right:nR,of:n,title:ok?"That's the right order":nR===n?`Right order, but ${nX===1?'one step doesn\'t':'some steps don\'t'} belong`:`${nR} of ${n} in the right place`,body:`${ok?'':`<p class="ans">The right order:</p><ol>${it.items.map(t=>`<li>${t}</li>`).join('')}</ol>`}${it.extra&&it.extra.length?`<p><b>Doesn't belong:</b> ${it.extra.join('; ')}</p>`:''}<p>${it.fb||''}</p>`};};};
R.rank=(it,el)=>{head(it,el); el.insertAdjacentHTML('beforeend','<p class="hint">Strongest fix at the top. Use the arrows to move a fix up or down.</p>');
  let ord=shuffle(it.items.map((x,k)=>k)); if(ord.every((k,p)=>k===p)) ord.reverse(); const ol=document.createElement('ol'); ol.className='rk'; el.appendChild(ol); PL.cur.ready=true; can(true);
  function draw(focusK,dir){ol.innerHTML=''; ord.forEach((k,p)=>{const li=document.createElement('li'); li.innerHTML=`<span class="pos">${p+1}</span><span class="t">${it.items[k].t}</span><span class="mv"><button type="button" aria-label="Move up: ${esc(it.items[k].t.replace(/<[^>]+>/g,''))}" ${p===0?'disabled':''}>${ic('back',18,3).replace('<svg','<svg style="transform:rotate(90deg)"')}</button><button type="button" aria-label="Move down" ${p===ord.length-1?'disabled':''}>${ic('back',18,3).replace('<svg','<svg style="transform:rotate(-90deg)"')}</button></span>`;
      const [up,dn]=$$('button',li); up.onclick=()=>{if(PL.res[PL.view]||p===0) return; [ord[p-1],ord[p]]=[ord[p],ord[p-1]]; draw(k,'up'); live(`Moved to position ${p}`);}; dn.onclick=()=>{if(PL.res[PL.view]||p===ord.length-1) return; [ord[p+1],ord[p]]=[ord[p],ord[p+1]]; draw(k,'dn'); live(`Moved to position ${p+2}`);};
      ol.appendChild(li); if(focusK===k){const b=dir==='up'?(p===0?dn:up):(p===ord.length-1?up:dn); b.focus();}});}
  draw();
  PL.cur.eval=()=>{let nR=0; ord.forEach((k,p)=>{if(k===p) nR++;}); const ok=nR===ord.length; $$('li',ol).forEach((li,p)=>{li.classList.add(ord[p]===p?'ok':'no'); $$('button',li).forEach(b=>b.disabled=true);});
    return {ok,right:nR,of:ord.length,title:ok?'Right ranking':`${nR} of ${ord.length} in the right place`,body:`<p class="ans">Strongest to weakest:</p><ol>${it.items.map(x=>`<li><b>${x.t}</b> ${x.reason}</li>`).join('')}</ol>`};};};
function live(t){const lv=$('#live'); lv.textContent=''; requestAnimationFrame(()=>lv.textContent=t);}
R.sort=(it,el)=>{head(it,el); it.auto=1; const cards=shuffle(it.cards); let k=0, nR=0; const log=[];
  el.insertAdjacentHTML('beforeend',`<p class="hint">Choose where each situation goes. Every card shows the reason.</p>`);
  const box=document.createElement('div'); box.className='sortc'; el.appendChild(box);
  const lg=document.createElement('ul'); lg.className='sortlog'; lg.setAttribute('aria-label','Sorted so far'); el.appendChild(lg);
  function show(){const c=cards[k]; box.innerHTML=`<p class="cnt">Card ${k+1} of ${cards.length}</p><p class="card-t">${c.t}</p><div class="buckets" role="group" aria-label="Where does it go?">${it.buckets.map((b,j)=>`<button type="button" class="bucket" data-key="${j+1}" data-b="${j}">${b}</button>`).join('')}</div><div class="cfb" aria-live="polite"></div>`;
    $$('.bucket',box).forEach(btn=>btn.onclick=()=>{if($('.bucket[disabled]',box)) return; const b=it.buckets[+btn.dataset.b], ok=b===c.bucket; if(ok) nR++;
      $$('.bucket',box).forEach(x=>{x.disabled=true; const bb=it.buckets[+x.dataset.b]; if(bb===c.bucket) x.classList.add('ok'); else if(x===btn) x.classList.add('no');});
      btn.insertAdjacentHTML('beforeend',markL(ok?'✓ Your choice · right':'Your choice','ok'.replace('ok',ok?'ok':'you')));
      log.push({c,b,ok}); $('.cfb',box).innerHTML=`<div class="fb ${ok?'ok':'no'}"><p class="fbt">${ic(ok?'check':'help',18,3)} ${ok?'Right':`Goes to: ${c.bucket}`}</p><p>${c.fb}</p><button type="button" class="btn sm" id="sNext">${k<cards.length-1?'Next card':'See results'}</button></div>`;
      lg.insertAdjacentHTML('beforeend',`<li>${ok?ic('check',16,3):ic('help',16,3)}<span>${c.t.replace(/<[^>]+>/g,'').slice(0,90)} → <b>${c.bucket}</b></span></li>`);
      const nb=$('#sNext',box); nb.focus(); nb.onclick=()=>{k++; if(k<cards.length){show(); const f=$('.bucket',box); f&&f.focus();} else {box.remove(); resolve({ok:nR>=cards.length-1,right:nR,of:cards.length,title:`${nR} of ${cards.length} sorted right`,body:nR<cards.length?`<p>Missed ones are listed above with the right answer. ${nR>=cards.length-1?'One slip is fine here.':''}</p>`:'<p>Every situation in the right place.</p>'});}};});}
  show(); PL.cur.ready=false;};
R.branch=(it,el)=>{head(it,el); it.auto=1; const br=document.createElement('div'); br.className='br'; el.appendChild(br); let goods=0, steps=0;
  br.insertAdjacentHTML('beforeend',`<p class="txt">${it.setup}</p>`);
  const byId=id=>it.nodes.find(n=>n.id===id);
  function node(n){steps++; const d=document.createElement('div'); d.className='br'; d.innerHTML=`<p class="path">Decision ${steps}</p><h3>${n.prompt}</h3><div class="opts" role="group" aria-label="Your choice">${n.choices.map((c,j)=>`<button type="button" class="opt" data-key="${j+1}" data-c="${j}" aria-pressed="false"><span class="key">${j+1}</span><span class="ot">${c.t}</span></button>`).join('')}</div>`; br.appendChild(d);
    $$('.opt',d).forEach(b=>b.onclick=()=>{if($('.opt[disabled]',d)) return; const c=n.choices[+b.dataset.c]; if(c.good) goods++;
      $$('.opt',d).forEach(x=>{x.disabled=true; if(x!==b) x.style.opacity='.6';}); b.setAttribute('aria-pressed','true'); b.classList.add(c.good?'bgood':'bweak'); $('.ot',b).insertAdjacentHTML('beforeend',markL(c.good?'Your choice · strongest':'Your choice · weaker','you'));
      const best=n.choices.find(x=>x.good);
      d.insertAdjacentHTML('beforeend',`<div class="cons ${c.good?'good':'weak'}" tabindex="-1"><p><b>${c.good?'Good call.':'Careful. What happens:'}</b> ${c.consequence}</p>${!c.good&&best?`<p class="small"><b>Strongest choice here:</b> ${best.t}</p>`:''}<p style="margin-top:8px"><button type="button" class="btn sm">${c.next&&c.next!=='end'&&byId(c.next)?'Continue':'See how it ends'}</button></p></div>`);
      const cb=$('.cons',d); cb.focus({preventScroll:true}); cb.scrollIntoView({block:'nearest',behavior:RM?'auto':'smooth'});
      $('.cons .btn',d).onclick=e=>{e.target.remove(); const nx=c.next&&c.next!=='end'?byId(c.next):null; if(nx){node(nx); const h=$$('h3',br).pop(); h.tabIndex=-1; h.focus();} else end();};});}
  function end(){if(it.resolution) br.insertAdjacentHTML('beforeend',`<div class="cons good"><p><b>How it ends.</b> ${it.resolution}</p></div>`);
    resolve({ok:goods===steps,right:goods,of:steps,title:goods===steps?'Strong choices all the way':`${goods} of ${steps} strongest choices`,body:'<p>Every choice has a consequence. In real life you can usually recover, as long as you act quickly and get help.</p>'});}
  node(it.nodes[0]); PL.cur.ready=false;};
R.pairs=(it,el)=>{head(it,el); it.auto=1; el.insertAdjacentHTML('beforeend',`<p class="hint">${it.hint||'Choose an item on the left, then its match on the right.'}</p>`);
  const L1=shuffle(it.pairs.map((p,k)=>({t:p[0],k,lab:p[2]}))), R1=shuffle(it.pairs.map((p,k)=>({t:p[1],k})));
  const wrap=document.createElement('div'); wrap.className='pairs'; const cl=document.createElement('div'); cl.className='col'; const cr=document.createElement('div'); cr.className='col'; wrap.append(cl,cr); el.appendChild(wrap);
  let a=null,b=null,mist=0,left=it.pairs.length,keyN=1; const missed=new Set();
  function mk(side,obj,col){const btn=document.createElement('button'); btn.type='button'; btn.className='pt'; if(obj.lab){btn.innerHTML=obj.t; btn.setAttribute('aria-label',obj.lab);} else btn.textContent=obj.t; btn.dataset.key=keyN++; btn.setAttribute('aria-pressed','false');
    btn.onclick=()=>{if(btn.classList.contains('matched')) return; $$('.pt',col).forEach(x=>x.setAttribute('aria-pressed','false')); btn.setAttribute('aria-pressed','true'); if(side==='l') a={obj,btn}; else b={obj,btn}; test();}; col.appendChild(btn);}
  L1.forEach(o=>mk('l',o,cl)); R1.forEach(o=>mk('r',o,cr));
  function test(){if(!a||!b) return; const A=a,B=b; a=b=null;
    if(A.obj.k===B.obj.k){[A.btn,B.btn].forEach(x=>{x.classList.add('matched'); x.disabled=true; x.setAttribute('aria-pressed','false');}); left--; live('Matched'); if(!left) setTimeout(()=>resolve({ok:true,right:it.pairs.length-missed.size,of:it.pairs.length,title:mist?'All matched':'All matched on the first try',body:`<p>${mist?`${mist} mismatch${mist>1?'es':''} along the way.`:''} Every number is on your Safety Card.</p>`}),200);}
    else {mist++; missed.add(A.obj.k); [A.btn,B.btn].forEach(x=>{x.classList.add('bad'); x.setAttribute('aria-pressed','false'); setTimeout(()=>x.classList.remove('bad'),500);}); live('Not a match. Try again.');}}};
R.hazards=(it,el)=>{const NH=HZ.filter(h=>h.haz).length; it.btn='Check my answers';
  el.insertAdjacentHTML('beforeend',`<h2 class="qh">Spot the hazards</h2><p class="txt" style="font-size:17px">Tap the hazards you see in this meeting room. Some things are fine.</p>`);
  const flagged=new Set(); const tools=document.createElement('div'); tools.className='hztools'; tools.innerHTML=`<button type="button" class="link hzzoom" aria-pressed="false">Zoom in</button><span class="hzcount" aria-live="polite">0 flagged</span>`;
  const scroll=document.createElement('div'); scroll.className='hzscroll'; const plan=document.createElement('div'); plan.className='planimg hzplan plus';
  plan.innerHTML=`<img decoding="async" src="${HZIMG}" alt="Top-down drawing of a meeting room set up for a workshop.">`+HZ.map(h=>`<button type="button" class="hzmk" data-id="${h.id}" style="left:${h.px}%;top:${h.py}%" aria-pressed="false" aria-label="${h.n}: ${h.d}"></button>`).join('');
  scroll.appendChild(plan); el.append(tools,scroll);
  el.insertAdjacentHTML('beforeend',`<div class="hint2"><img src="img/guide2.webp" alt=""><p><b>Look around carefully.</b> Some hazards are easy to miss. There are ${NH} to find.</p></div>`);
  const det=document.createElement('details'); det.className='hzlist'; det.innerHTML='<summary>Prefer a list? Flag items by name</summary>'; const list=document.createElement('div'); list.className='hz'; det.appendChild(list); el.appendChild(det);
  HZ.forEach(h=>{const b=document.createElement('button'); b.type='button'; b.className='opt'; b.dataset.id=h.id; b.setAttribute('aria-pressed','false'); b.innerHTML=`<span class="ot"><b>${h.n}</b><span class="d">${h.d}</span></span>`; b.onclick=()=>tog(h.id); list.appendChild(b);});
  $$('.hzmk',plan).forEach(g=>g.addEventListener('click',()=>tog(g.dataset.id)));
  const zb=$('.hzzoom',tools); zb.onclick=()=>{const on=zb.getAttribute('aria-pressed')!=='true'; zb.setAttribute('aria-pressed',on); zb.textContent=on?'Zoom out':'Zoom in'; plan.classList.toggle('zoom',on);};
  const cnt=$('.hzcount',tools);
  function tog(id){if(PL.res[PL.view]) return; flagged.has(id)?flagged.delete(id):flagged.add(id); $$(`[data-id="${id}"]`,el).forEach(x=>{x.classList.toggle('on',flagged.has(id)); x.setAttribute('aria-pressed',flagged.has(id));}); cnt.textContent=`${flagged.size} flagged`; PL.cur.ready=flagged.size>0; can(PL.cur.ready);}
  const crop=h=>`<span class="hzcrop" aria-hidden="true"><img decoding="async" src="${HZIMG}" alt="" style="width:400%;left:${(50-4*h.px).toFixed(1)}%;top:${(50-3.377*h.py).toFixed(1)}%"></span>`;
  PL.cur.eval=()=>{const found=[],missed=[],wrong=[]; HZ.forEach(h=>{const f=flagged.has(h.id); const g=$(`.hzmk[data-id="${h.id}"]`,plan); g.classList.remove('on'); g.disabled=true; const b=$(`.opt[data-id="${h.id}"]`,list); b.disabled=true; b.setAttribute('aria-pressed','false');
      if(h.haz&&f){g.classList.add('r-ok'); found.push(h);} else if(h.haz){g.classList.add('r-miss'); missed.push(h);} else if(f){g.classList.add('r-wrong'); wrong.push(h);} else g.classList.add('r-fine');});
    cnt.textContent=`${found.length} of ${NH} found`; const ok=!missed.length&&!wrong.length;
    const row=(h,st,cls)=>`<li class="hzres">${crop(h)}<span class="t"><b>${h.n}</b> <span class="mark-l ${cls}">${st}</span><span class="d">${h.d}</span><span>${h.why}</span></span></li>`;
    const all=HZ.filter(h=>h.haz).map(h=>row(h,found.includes(h)?'✓ You found it':'Missed',found.includes(h)?'ok':'you')).join('');
    return {ok,right:HZ.length-missed.length-wrong.length,of:HZ.length,title:ok?'Nice work!':found.length>=NH-1?'Almost there':'Good start',sub:`You found ${found.length} of ${NH} hazards${wrong.length?` · ${wrong.length} flagged ${wrong.length>1?'items were':'item was'} fine`:''}.`,
      body:`<p class="lab2">Here's what to look for</p><ul class="hzres-l">${all}</ul>${wrong.length?`<p class="lab2">Fine as it is</p><ul class="hzres-l">${wrong.map(h=>row(h,'Not a hazard','you')).join('')}</ul>`:''}`};};};
R.checkin=(it,el)=>{const n=S.next||{t:''};
  el.innerHTML=`<p class="tag">${ic('check',16,3)} Last time you chose a next step</p><h2 class="qh">“${esc(n.t)}”</h2><p class="lead">How did it go?</p><div class="opts" role="group" aria-label="How did it go">${[['yes','I did it'],['not',"Not yet. I'll try this week"],['stuck','I got stuck']].map(([v,t],k)=>`<button type="button" class="opt" data-ci="${v}" aria-pressed="${n.status===v}"><span class="key">${k+1}</span><span class="ot">${t}</span></button>`).join('')}</div><p class="muted" id="ciMsg" aria-live="polite"></p>`;
  $$('[data-ci]',el).forEach(b=>b.onclick=()=>{if(!S.next) return; S.next.status=b.dataset.ci; save(); $$('[data-ci]',el).forEach(x=>x.setAttribute('aria-pressed',x===b));
    $('#ciMsg',el).textContent={yes:'Doing it at work is what this is for. Well done.',not:"No problem. It stays on your list and we'll ask again next week.",stuck:S.next.lesson&&S.next.lesson.startsWith('4')?'Talk it through with your lead or your HR Partner. For personal support, the EFAP Immediate Resources page is there for you.':'Ask your lead or Floor Warden. The Safety Card has every contact.'}[b.dataset.ci];});};
R.episode=(it,el)=>{const e=it.e, w=weekTheme();
  el.innerHTML=`<p class="tag">${ic('target',16,3)} Keep Ready · Week ${krWeekN()}${it.mode==='catchup'?' · catch-up':''}</p><h2 class="qh">${it.mode==='catchup'?'Welcome back':w?esc(w.title):'This week at ESQ'}</h2>
   <div class="scene2">${ic('pin',26)}<div><p class="when">${e.time} · ${e.where}</p><p class="txt">${e.text}</p></div></div>
   <ul class="chips"><li>${ic('target',16)} ${it.nq} question${it.nq>1?'s':''}</li><li>About 3 min</li>${it.mix.map(m=>`<li>${m}</li>`).join('')}</ul>
   <p class="muted">${it.mode==='catchup'?'It\'s been a while, so this one starts with the most important things to keep fresh.':'A mix of questions you\'ve seen and some you haven\'t. Each answer explains the reason.'}</p>`;};
