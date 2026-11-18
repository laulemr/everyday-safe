/* ===== part 4: completion, Keep Ready, screens ===== */
const krWeekN=()=>Object.keys(S.ep).length+(S.ep['w'+WEEK()]?0:1);
const anyDone=()=>LESSONS.some(l=>S.done[l.id]);
const nextLesson=()=>{const ip=LESSONS.find(l=>S.prog[l.id]&&!S.done[l.id]); if(ip) return ip; const e=ESSENTIALS.map(LBY).find(l=>!S.done[l.id]); if(e) return e; return LESSONS.find(l=>!S.done[l.id])||(!S.done.final?FINALL:null);};
function lessonRecap(l){if(l.final) return MBY('final').recap; if(l.m){const r=MBY(l.m).recap; return typeof r==='function'?r():r;}
  return (l.cards||[]).map(([s,k])=>{const c=LEARN[s][k]; const p=typeof c.p==='function'?c.p():c.p; return p[0];});}
function finish(){PL.done=true; pMain.hidden=false; $('#pBar').style.width='100%'; $('#pCount').textContent=''; pPrev.hidden=true;
  const acc=PL.of?Math.round(PL.right/PL.of*100):100; S.lastVisit=DAY();
  if(PL.kind==='episode') return finishEpisode(acc);
  const l=PL.l; delete S.prog[l.id]; const pass=!l.final||acc>=80;
  if(pass) S.done[l.id]=true; S.acc[l.id]=Math.max(S.acc[l.id]||0,acc); if(l.final) S.finalBest=Math.max(S.finalBest||0,acc);
  const got=[]; const add=b=>{if(b) got.push(b);};
  add(earn('first')); if(ESSENTIALS.every(id=>S.done[id])) add(earn('essentials'));
  UNITS.forEach(u=>{if(unitL(u.n).every(x=>S.done[x.id])) add(earn('u'+u.n));}); if(l.final&&pass) add(earn('ready')); if(retainedN()>=25) add(earn('ret25'));
  save();
  const mis=l.mis&&!S.missions[l.mis]?MISSIONS.find(m=>m.id===l.mis):null, Ld=l.story?ULES[l.story]:null, nx=nextLesson();
  const nAdd=lessonPool(l).length;
  pBody.innerHTML=`<div class="done-h"><p class="tag" style="color:${pass?'var(--green)':'var(--amber)'}">${ic(pass?'check':'help',16,3)} ${l.final?(pass?'Everyday Safe badge':'Challenge finished'):'Lesson complete'}</p>
    <h2 class="qh" tabindex="-1">${l.final?(pass?"You've earned Everyday Safe.":'Almost there.'):'You can now '+l.goal.charAt(0).toLowerCase()+l.goal.slice(1)}</h2></div>
   <div class="card"><div class="row2"><span class="icb">${ic('target',22)}</span><div class="t"><b>Right first time: ${l.final?`${PL.right} of ${PL.of}`:`${PL.first} of ${PL.inter}`}</b><span class="muted small">${l.final?acc:Math.round(PL.first/Math.max(PL.inter,1)*100)}%${l.final?' · The Everyday Safe badge takes 80% or more':''}</span></div></div>
    <p class="muted small">${l.final?(pass?'Keep it that way with Keep Ready each week.':'Replay the challenge when you\'re ready. Your Safety Card has every number.'):`Finishing a lesson is a start. ${nAdd?`Its ${nAdd} questions now come back in Keep Ready, `:'Questions come back in Keep Ready, '}and each one counts as <b>Retained</b> once you get it right on two separate days.`}</p></div>
   ${got.map(b=>`<div class="card"><div class="row2"><span class="icb">${ic(b.i,22)}</span><div class="t"><span class="eyebrow">Badge earned</span><b>${b.n}</b><span class="muted small">${b.d}</span></div></div></div>`).join('')}
   <div class="card recap"><h3>Remember</h3><ul>${lessonRecap(l).map(r=>`<li>${r}</li>`).join('')}</ul></div>
   ${mis?`<div class="card"><p class="eyebrow">${ic('pin',16)} Try it in the building</p><b>${mis.t}</b><p class="muted">${typeof mis.d==='function'?mis.d():mis.d}</p><div><button type="button" class="btn sec sm" data-gomis>Open field missions</button></div></div>`:''}
   ${Ld?`<div class="card"><h3>My next step this week</h3><div class="opts" role="group" aria-label="My next step">${Ld.commit.map((c,k)=>`<button type="button" class="opt" data-commit="${k}" aria-pressed="${!!(S.next&&S.next.t===c)}"><span class="ot">${c}</span></button>`).join('')}</div><p class="muted small">Your next Keep Ready episode will ask how it went.</p></div>`:''}
   ${Ld&&Ld.reflect?`<div class="card"><h3>Think about it</h3><label for="refl">${Ld.reflect}</label><textarea id="refl" rows="3"></textarea><p class="muted small">Nothing you type here is saved or shared.</p></div>`:''}
   ${l.final?`<div class="card"><h3>How ready do you feel now for an emergency at ESQ?</h3><div class="scale" id="c1">${[1,2,3,4,5].map(v=>`<button type="button" aria-pressed="${S.conf1===v}" data-v="${v}" aria-label="${v} of 5">${v}</button>`).join('')}</div><div class="scale-ends"><span>Not at all</span><span>Completely</span></div></div>`:''}
   <div><button type="button" class="btn sec" id="doneHome">Back to Home</button></div>`;
  $$('[data-commit]',pBody).forEach(b=>b.onclick=()=>{S.next={t:Ld.commit[+b.dataset.commit],lesson:l.id,day:DAY(),status:null}; save(); $$('[data-commit]',pBody).forEach(x=>x.setAttribute('aria-pressed',x===b)); toast('Saved. Keep Ready will ask how it went.');});
  $$('#c1 button',pBody).forEach(b=>b.onclick=()=>{S.conf1=+b.dataset.v; save(); $$('#c1 button',pBody).forEach(x=>x.setAttribute('aria-pressed',x===b)); toast('Saved');});
  const gm=$('[data-gomis]',pBody); if(gm) gm.onclick=()=>{closePlayer(); go('me','misH');};
  $('#doneHome').onclick=()=>{closePlayer(); go('home');};
  const nxt=nextLesson(); if(nxt&&nxt.id!==l.id&&unlocked(nxt)){pMain.textContent='Next: '+nxt.title; PL.after=()=>{closePlayer(); startLesson(nxt.id);};} else {pMain.textContent='Back to Home'; PL.after=()=>{closePlayer(); go('home');};}
  pMain.disabled=false; $('.qh',pBody).focus({preventScroll:true}); $('#pScroll').scrollTop=0;}

function krPlan(){if(!BANK) return null; const P0=pool(); if(!P0.length) return {mode:'locked',ids:[]};
  const t=DAY(), gap=S.lastVisit!=null?t-S.lastVisit:0, w=weekTheme(), inT=q=>w&&w.topics.includes(q.topic)?1:0, st=q=>qstate(q.id), byT=(a,b)=>TIER[a.tier]-TIER[b.tier];
  const P=P0;
  const due=P.filter(q=>st(q)==='due').sort((a,b)=>byT(a,b)||S.lb[a.id].d-S.lb[b.id].d), miss=P.filter(q=>st(q)==='practice').sort(byT);
  const unseen=shuffle(P.filter(q=>st(q)==='unseen')).sort((a,b)=>inT(b)-inT(a)||byT(a,b));
  const fresh_=q=>['unseen','due','practice'].includes(st(q))?0:1;
  const integ=shuffle(P.filter(q=>q.format&&['sort','branching','order','rank'].includes(q.format))).sort((a,b)=>fresh_(a)-fresh_(b));
  const rest=P.filter(q=>['learning','retained'].includes(st(q))).sort((a,b)=>S.lb[a.id].d-S.lb[b.id].d);
  const out=[]; let slots=5; const cost=q=>q.format==='branching'?2:1; const add=q=>{if(q&&!out.includes(q)&&cost(q)<=slots){out.push(q); slots-=cost(q); return true;} return false;};
  const mode=gap>14?'catchup':(!due.length&&!miss.length?(unseen.length?'nothingdue':'allseen'):'normal');
  const take=(arr,n)=>{let k=0; for(const q of arr){if(k>=n||slots<=0) break; if(add(q)) k++;}};
  if(mode==='catchup') take([...miss,...due].filter(q=>q.tier==='A'),3);
  take(due,2); take(miss,1); take(unseen,1); take(integ,1);
  [...due,...miss,...unseen,...rest].forEach(q=>{if(slots>0) add(q);});
  const c={due:0,practice:0,unseen:0,mixed:0}; out.forEach(q=>{if(q.format&&['sort','branching','order','rank'].includes(q.format)) c.mixed++; else if(c[st(q)]!=null) c[st(q)]++;});
  const mix=[c.due&&`${c.due} due`,c.practice&&`${c.practice} to practise`,c.unseen&&`${c.unseen} new to you`,c.mixed&&`${c.mixed} mixed scenario`].filter(Boolean);
  return {mode,ids:out.map(q=>q.id),mix,nDue:due.length+miss.length,nNew:unseen.length};}
function startEpisode(){if(!BANK){toast('Loading questions…'); loadBank().then(startEpisode).catch(()=>toast("Couldn't load the questions.")); return;}
  const p=krPlan(); if(!p||!p.ids.length){toast('Finish a lesson first. Its questions start your Keep Ready.'); return;}
  const items=p.ids.map(id=>toItem(QB[id])).filter(Boolean);
  const steps=[{type:'episode',e:epiOf(),mode:p.mode,nq:items.length,mix:p.mix}];
  if(S.next&&!S.next.status&&S.next.day<DAY()) steps.push({type:'checkin'});
  openPlayer({kind:'episode',steps:steps.concat(items),picks:p.ids,ep:p,before:retainedN()});}
function finishEpisode(acc){const k='w'+WEEK(); const e=S.ep[k]||{n:0,acc:0}; S.ep[k]={n:e.n+1,acc:Math.max(e.acc,acc)};
  const tot=Object.values(S.ep).reduce((a,b)=>a+b.n,0); const got=[]; if(tot>=4){const b=earn('kr4'); if(b) got.push(b);} if(retainedN()>=25){const b=earn('ret25'); if(b) got.push(b);}
  save(); kpiPush();
  const ids=PL.picks, topics=[...new Set(ids.map(id=>QB[id]&&QB[id].topic).filter(Boolean))].map(topicName), newN=PL.ep.mix.find(x=>/new/.test(x)), ret=retainedN(), dRet=ret-PL.before;
  const nd=(()=>{const t=DAY(); const ds=pool().map(q=>S.lb[q.id]).filter(r=>r&&r.d>t).map(r=>r.d); return ds.length?dayName(Math.min(...ds)):null;})();
  const w=weekTheme(), nxt=EPIS[(WEEK()+1)%EPIS.length], wN=BANK.weeks[(WEEK()+1)%BANK.weeks.length];
  pBody.innerHTML=`<div class="done-h"><p class="tag" style="color:var(--green)">${ic('check',16,3)} Episode complete</p><h2 class="qh" tabindex="-1">${PL.first} of ${PL.inter} right first time</h2></div>
   <div class="card"><p><b>You practised:</b> ${topics.map(esc).join(', ')}.</p><p class="muted">${newN?newN.replace('new to you','question'+(/^1 /.test(newN)?'':'s')+' new to you')+'. ':''}Retained now: <b>${ret}</b>${dRet>0?` (+${dRet})`:''}. ${nd?`Next review due ${nd}.`:''}</p>
    <p class="muted small">Missed one? It comes back tomorrow in a new mix. No streaks to keep, and nothing is lost if you skip a week.</p></div>
   ${got.map(b=>`<div class="card"><div class="row2"><span class="icb">${ic(b.i,22)}</span><div class="t"><span class="eyebrow">Badge earned</span><b>${b.n}</b></div></div></div>`).join('')}
   ${w?`<div class="card"><p class="eyebrow">${ic('pin',16)} One thing to try this week</p><b>${esc(w.mission.t)}</b><p class="muted">${esc(w.mission.detail)}</p></div>`:''}
   ${(S.pulse[k]||[]).length?'':pulseHTML()}
   <div class="card flat"><p class="eyebrow">Next week</p><p><b>${wN?esc(wN.title):''}</b> · ${esc(nxt.text.split('. ')[0])}${/[.?!”]$/.test(nxt.text.split('. ')[0])?'':'.'}</p><p class="muted small">Same time next week?</p></div>`;
  bindPulse(pBody); pMain.textContent='Back to Home'; pMain.disabled=false; PL.after=()=>{closePlayer(); go('home');}; $('.qh',pBody).focus({preventScroll:true}); $('#pScroll').scrollTop=0;}
function dayName(d){const t=new Date(d*864e5); return new Date(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()).toLocaleDateString('en-CA',{weekday:'short',month:'short',day:'numeric'});}
const PULSE=[['stairs','Walked to my second-nearest stairwell'],['alertus','Checked my Alertus icon for a green check'],['report','Reported a near miss or hazard'],['checkin','Checked in with Security when working late'],['none','None of these yet']];
function pulseHTML(){const cur=S.pulse['w'+WEEK()]||[]; return `<div class="card"><h3>Since last week, at work, have you…</h3><p class="muted small">Pick any. Saved without your name, as a weekly team total.</p><div class="opts" role="group" aria-label="Since last week">${PULSE.map(([k,t])=>`<button type="button" class="opt" data-pulse="${k}" aria-pressed="${cur.includes(k)}"><span class="ot">${t}</span></button>`).join('')}</div></div>`;}
function bindPulse(root){$$('[data-pulse]',root).forEach(b=>b.onclick=()=>{const w='w'+WEEK(); let cur=(S.pulse[w]||[]).slice(); const k=b.dataset.pulse;
  if(cur.includes(k)) cur=cur.filter(x=>x!==k); else {cur.push(k); cur=k==='none'?['none']:cur.filter(x=>x!=='none');}
  S.pulse[w]=cur; save(); $$('[data-pulse]',root).forEach(x=>x.setAttribute('aria-pressed',cur.includes(x.dataset.pulse))); clearTimeout(bindPulse.t); bindPulse.t=setTimeout(kpiPush,1500);});}

/* ---------- navigation ---------- */
P.home='<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h4.5v-6h3v6H18V9.5"/>'; P.menu='<path d="M4 7h16M4 12h16M4 17h16"/>';
P.watch='<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M12 13.5l3 2M10 2.5h4M12 2.5V6M18.5 6.5l1.5-1.5"/>';
P.bldg='<path d="M4 21V8l8-4 8 4v13"/><path d="M9 21v-5h6v5M8 10h2M14 10h2M8 13h2M14 13h2"/>';
const TABS=[['home','Home','home'],['learn','Learn','book'],['kr','Keep Ready','watch'],['building','Building','bldg'],['more','More','menu']];
const RAIL=TABS.concat([['card','Safety Card','card']]);
const ALIAS={today:'home',path:'learn',me:'more'};
let tab='home';
function drawNav(){const b=(id,l,i)=>`<button type="button" class="navb" data-tab="${id}" ${tab===id?'aria-current="page"':''}>${ic(i,24)}<span>${l}</span></button>`;
  $('#bnav').innerHTML=TABS.map(x=>b(...x)).join(''); $('#railNav').innerHTML=RAIL.map(x=>b(...x)).join(''); $$('[data-tab]').forEach(x=>x.onclick=()=>go(x.dataset.tab));
  $('#hCard').innerHTML=`${ic('cross',16,2.4)}<span>Safety Card</span>`; $('#hCard').setAttribute('aria-current',tab==='card'?'page':'false'); $('#hCard').onclick=()=>go('card'); $('#hMore').onclick=()=>go('more');}
function go(t,focusId){t=ALIAS[t]||t; tab=t; RAIL.forEach(([id])=>$('#tab-'+id).hidden=id!==t); render(); window.scrollTo(0,0);
  const f=focusId&&document.getElementById(focusId); if(f){f.tabIndex=-1; f.scrollIntoView({block:'start'}); f.focus({preventScroll:true});}}
function render(){drawNav(); try{({home:drawHome,learn:drawPath,kr:drawKR,building:drawBuilding,more:drawMe,card:drawCard})[tab]();}catch(e){console.error(e);}}
function softRender(){const a=document.activeElement; if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return; if(player.hidden&&$('#team').hidden) render();}
const UNITN=l=>l.final?'Final challenge':`Unit ${l.u} · ${l.id.replace('-','.')}`;
const CHEV=()=>`<span class="chev">${ic('back',20).replace('<svg','<svg style="transform:rotate(180deg)"')}</span>`;
const ARROW=' <span aria-hidden="true">→</span>';
function levelProg(){const L_=level(); if(L_===0) return {a:ESSENTIALS.filter(id=>S.done[id]).length,b:ESSENTIALS.length,u:'essentials'};
  if(L_===1) return {a:LESSONS.filter(l=>S.done[l.id]).length,b:LESSONS.length,u:'lessons'};
  if(L_===2){const r=retainedN(); return {a:Math.min(r,25)+(S.done.final?1:0),b:26,u:S.done.final?'retained':'retained + final'};} return {a:1,b:1,u:''};}
function ringSVG(f){const R_=26,C=2*Math.PI*R_; return `<svg class="ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="${R_}" fill="none" stroke="var(--line)" stroke-width="8"/><circle cx="32" cy="32" r="${R_}" fill="none" stroke="var(--green)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(C*f).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 32 32)"/></svg>`;}
function unitLight(n){const u=UNITS[n-1], s=unitStats(n), ld=unitL(n).filter(l=>S.done[l.id]).length/unitL(n).length, r=s.all?s.retained/s.all:0, v=.4*ld+.6*r; return v>=.75?'lit':v>=.25?'half':'glass';}
const lit5=()=>`<span class="lit5" aria-hidden="true">${UNITS.map(u=>{const v=BANK?unitLight(u.n):'glass'; return `<i class="${v==='lit'?'on':v==='half'?'half':''}"></i>`;}).join('')}</span>`;
const litN=()=>BANK?UNITS.filter(u=>unitLight(u.n)==='lit').length:0;
function krCardHTML(big){if(!anyDone()){const first=ESSENTIALS.map(LBY).find(l=>!S.done[l.id])||LBY('1-1');
    return `<div class="hcard"><div class="row2"><span class="watch">${ic('watch',52,2)}</span><div class="t"><b>Start with the essentials</b><span class="muted">5 short lessons · about 4 minutes a day</span></div></div><button type="button" class="btn wide" data-start="${first.id}">Start: ${first.title}${ARROW}</button><p class="muted small">Keep Ready, your weekly 3-minute episode, starts after your first lesson.</p></div>`;}
  if(!BANK) return `<div class="hcard"><div class="row2"><span class="watch">${ic('watch',52,2)}</span><div class="t"><b>Keep Ready</b><span class="muted">Loading your questions…</span></div></div></div>`;
  const p=krPlan(), wk=S.ep['w'+WEEK()], e=epiOf(), w=weekTheme(), n=p.ids.length;
  if(wk&&wk.n) return `<div class="hcard"><div class="row2"><span class="watch" style="color:var(--green)">${ic('check',48,2.4)}</span><div class="t"><b>Keep Ready: done this week</b><span class="muted">${p.nDue?`${p.nDue} question${p.nDue>1?'s are':' is'} ready if you'd like extra practice`:'Your next episode is ready next week'}</span></div></div><button type="button" class="btn sec wide" data-kr>Practise again${ARROW}</button></div>`;
  return `<div class="hcard"><div class="row2"><span class="watch">${ic('watch',52,2)}</span><div class="t"><b>${p.mode==='catchup'?'Welcome back: Keep Ready':'Keep Ready'}</b><span class="muted">3 minutes · ${n} question${n===1?'':'s'}</span></div></div>
    ${big?`<div class="scene2">${ic('pin',24)}<div><p class="when">${e.time} · ${e.where}${w?` · ${esc(w.title)}`:''}</p><p>${e.text}</p></div></div>`:''}
    <button type="button" class="btn wide" data-kr>Start this week's episode${ARROW}</button></div>`;}
function bindCommon(el){$$('[data-start]',el).forEach(b=>b.onclick=()=>startLesson(b.dataset.start,false,b.hasAttribute('data-resume'))); $$('[data-kr]',el).forEach(b=>b.onclick=startEpisode); $$('[data-go]',el).forEach(b=>b.onclick=()=>go(b.dataset.go,b.dataset.focus));
  $$('[data-gomis]',el).forEach(b=>b.onclick=()=>go('more','misH')); $$('[data-team]',el).forEach(b=>b.onclick=()=>openTeam());}

function krPanel(){if(!anyDone()) return `<span class="kri" aria-hidden="true">${ic('lock',20,2.4)}</span><div class="t"><b>Keep Ready</b><span>A 3-minute weekly review. Unlocks after your first lesson.</span></div>`;
  if(!BANK) return `<div class="t"><b>Keep Ready</b><span>Loading your questions…</span></div>`;
  const p=krPlan(), wk=S.ep['w'+WEEK()], n=p.ids.length;
  if(wk&&wk.n) return `<div class="t"><b>Keep Ready ✓</b><span>Done this week${p.nDue?` · ${p.nDue} ready for extra practice`:''}</span></div><button type="button" class="go sec" data-kr>Practise</button>`;
  return `<div class="t"><b>${p.mode==='catchup'?'Welcome back':'Keep Ready'}</b><span>This week · 3 min · ${n} question${n===1?'':'s'}</span></div><button type="button" class="go sec" data-kr>Start</button>`;}
function heroCTA(nx,L_,lp){const started=anyDone()||Object.keys(S.prog||{}).length>0;
  const mid=!!(nx&&S.prog[nx.id]&&S.prog[nx.id].pos>0&&!S.done[nx.id]);
  const k=!started?'Start your journey':mid?'Welcome back':nx?'Continue your journey':'Your journey';
  const prog=L_<3?`${lp.a} of ${lp.b} ${lp.u}`:'Top level';
  const next=nx?(mid?`Pick up where you left off: ${nx.title}`:nx.final?'Next: final challenge':`Next: ${nx.title}`):'Every lesson done';
  const go=nx&&unlocked(nx);
  return `<button type="button" class="hj" ${go?`data-start="${nx.id}"${mid?' data-resume':''}`:'data-go="more"'} aria-label="${k}. Level ${L_+1}, ${LEVELS[L_][0]}. ${prog}. ${next}.">
    <span class="hk">${k}</span><span class="hl">${LEVELS[L_][0]}</span><span class="hp">Level ${L_+1} · ${prog}</span>
    <span class="hn"><span>${next}</span>${ARROW}</span>${ringSVG(lp.b?lp.a/lp.b:1)}</button>`;}
function drawHome(){const el=$('#homeBody'); const now=new Date(), hr=now.getHours(), nx=nextLesson(), L_=level(), lp=levelProg(); const h=[];
  const bg=hr<11?1:hr<16?2:5;
  h.push(`<div class="hero3"><div class="htx"><p class="d">${now.toLocaleDateString('en-CA',{weekday:'long',month:'long',day:'numeric'})}</p><h1 id="homeH">${hr<12?'Good morning':hr<17?'Good afternoon':'Good evening'}${S.name?', '+esc(S.name):''}</h1></div><img class="hg" src="img/team2.webp" alt="" width="900" height="757"><div class="hcard3">${heroCTA(nx,L_,lp)}</div></div>`);
  h.push(`<button type="button" class="tile2 bt wide" data-go="building"><span class="k">Your building</span><span class="v">${litN()} of 5 lit</span><span class="s">Each unit lights up part of ESQ</span><img src="img/enterprise-square-illustration.webp" alt=""></button>`);
  const up=[];
  if(false) up.push(`<button type="button" class="li2" data-start="${nx.id}" ${unlocked(nx)?'':'disabled'}><span class="ic2" style="background:color-mix(in srgb,${uc(nx.u)} 16%,#fff);color:${uc(nx.u)}">${ic(nx.icon,22)}</span><span class="t"><b>${nx.title}</b><span>${S.prog[nx.id]?'Continue · ':''}${UNITS[nx.u-1]?UNITS[nx.u-1].short+' · ':''}lesson ${nx.id.replace('-','.')}</span></span>${CHEV()}</button>`);
  const mis=MISSIONS.find(m=>!S.missions[m.id]&&LESSONS.some(l=>l.mis===m.id&&S.done[l.id]));
  if(mis) up.push(`<button type="button" class="li2" data-gomis><span class="ic2" style="background:#EAF1EC;color:var(--moss)">${ic(mis.i,22)}</span><span class="t"><b>${mis.t}</b><span>A small action in the building</span></span>${CHEV()}</button>`);
  if(up.length) h.push(`<section><h2 class="sec2">Up next</h2><div class="list2">${up.join('')}</div></section>`);
  h.push(`<section><h2 class="sec2">This week</h2><div class="krp solo">${krPanel()}</div></section>`);
  if(S.next&&!S.next.status) h.push(`<div class="panel"><p class="k2">Your next step</p><p><b>“${esc(S.next.t)}”</b></p><div class="seg" role="group" aria-label="How did it go">${[['yes','I did it'],['not','Not yet'],['stuck','I got stuck']].map(([v,t])=>`<button type="button" data-ci2="${v}" aria-pressed="false">${t}</button>`).join('')}</div></div>`);
  el.innerHTML=h.join(''); bindCommon(el);
  $$('[data-ci2]',el).forEach(b=>b.onclick=()=>{S.next.status=b.dataset.ci2; save(); toast(b.dataset.ci2==='yes'?'Well done. That\'s what this is for.':b.dataset.ci2==='not'?'It stays on your list.':'Ask your lead or Floor Warden. The Safety Card has every contact.'); drawHome();});}
const drawToday=drawHome;

function drawKR(){const el=$('#krBody'); const h=[krCardHTML(true)];
  if(BANK&&anyDone()){const P_=pool(), c=countStates(P_), w=weekTheme(), eps=Object.values(S.ep).reduce((a,b)=>a+b.n,0), nxt=EPIS[(WEEK()+1)%EPIS.length];
    h.push(`<div class="hcard"><h2 style="font-size:19px">Your questions</h2><p class="muted small">From the lessons you've done: ${P_.length} of ${BANK.questions.length} questions in the bank. Finish more lessons to add theirs.</p><div class="states">${[['retained','Retained'],['due','Due'],['practice','Needs practice'],['learning','Learning'],['unseen','Unseen']].map(([k,t])=>`<div class="st"><b>${c[k]}</b><span>${t}</span></div>`).join('')}</div>
      <details class="more"><summary>How each week's five are picked</summary><ul><li>Two that are <b>due</b>, life-safety ones first.</li><li>One you <b>missed</b> last time, in a new mix.</li><li>One that's <b>new to you</b>, from a lesson you've done.</li><li>One <b>mixed scenario</b>: a sort, a sequence or a short story.</li><li>Right on two separate days, at growing gaps, makes a question <b>Retained</b>. Back after a long break? You get a catch-up that starts with the most important ones.</li></ul></details></div>`);
    if(w) h.push(`<div class="hcard"><p class="eyebrow">${ic('pin',16)} This week's theme</p><h2 style="font-size:20px">${esc(w.title)}</h2><p class="muted">${esc(w.why)}</p><p><b>One thing to try:</b> ${esc(w.mission.t)}. <span class="muted">${esc(w.mission.detail)}</span></p></div>`);
    h.push(`<div class="hcard flat"><p class="eyebrow">Next week</p><p>${esc(nxt.text)}</p><p class="muted small">${eps} episode${eps===1?'':'s'} so far. No streaks to keep: skip a week and nothing is lost.</p></div>`);}
  el.innerHTML=h.join(''); bindCommon(el);}

function drawBuilding(){const el=$('#bBody'); if(!BANK){el.innerHTML='<p class="muted">Loading…</p>'; return;}
  const ust=UNITS.map(u=>{const s=unitStats(u.n), v=unitLight(u.n), pct=x=>s.all?x/s.all*100:0;
    return `<li><div class="l1"><b>${u.short}: ${u.title} <span class="pill ${v==='lit'?'ok':v==='half'?'due':''}">${v==='lit'?'Lit':v==='half'?'Partly lit':'Not lit yet'}</span></b><span class="muted small">${s.retained} retained · ${s.due+s.practice} due · ${s.all-s.unseen} seen of ${s.all}</span></div><span class="bar" role="img" aria-label="${u.short}: ${s.retained} retained, ${s.due+s.practice} due, ${s.learning} learning, ${s.unseen} unseen, of ${s.all}"><i style="width:${pct(s.retained)}%"></i><i class="due" style="width:${pct(s.due+s.practice)}%"></i><i class="seen" style="width:${pct(s.learning)}%"></i></span></li>`;}).join('');
  el.innerHTML=`<img class="bhero" src="img/enterprise-square-illustration.webp" alt="Illustration of Enterprise Square on Jasper Avenue: the historic stone building with a glass tower behind it, an LRT entrance and people on the street.">
   <div class="hcard"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h2 style="font-size:20px">${litN()} of 5 areas lit</h2>${lit5()}</div>
    <p class="muted small">Each area stands for a unit: the stairwells for getting out, the offices for preventing hazards, the Security desk for getting help, the team room for speaking up, and the street and LRT for heading home.</p>
    <ul class="ulist">${ust}</ul>
    <p class="legend"><span><i style="background:var(--green)"></i>Retained</span><span><i style="background:#FFB600"></i>Due or needs practice</span><span><i style="background:#6CC24A"></i>Learning</span><span><i style="background:var(--line)"></i>Unseen</span></p>
    <details class="more"><summary>What lights an area?</summary><ul><li>Finishing the unit's lessons lights it partly.</li><li>Retaining its questions in Keep Ready (right on two separate days) lights it fully.</li><li>Lights never switch off. Questions just come due again.</li></ul></details></div>`;}

let OPENU=null, LTAB='path';
const UMIN={1:20,2:15,3:20,4:25,5:10};
const UBG={1:'linear-gradient(135deg,#F6E7C4,#DDEAF0)',2:'linear-gradient(135deg,#E8EFDF,#F4E9D2)',3:'linear-gradient(135deg,#F3E3CF,#E6E2D8)',4:'linear-gradient(135deg,#E4EEDC,#F2EAD6)',5:'linear-gradient(135deg,#F6D9A8,#E9B98C)'};
const UALT={1:'A colleague with a shoulder bag opening the glass doors into the building lobby.',2:'A colleague working on a laptop at her desk.',3:'A colleague on the phone, looking concerned.',4:'Three colleagues talking around a small table.',5:'A colleague heading home at the end of the day.'};
function drawPath(){const el=$('#pathBody'); const nx=nextLesson();
  $('#pathH').textContent='Your workday'; const ph=$('#tab-learn .ph p'); if(ph) ph.textContent='Five units, morning to evening. Open any lesson, in any order.';
  const st=n=>{const ls=unitL(n); return {d:ls.filter(l=>S.done[l.id]).length,n:ls.length};};
  const lbtn=l=>{const d=S.done[l.id], p=S.prog[l.id]&&!d, lk=!unlocked(l);
    return `<li><button type="button" class="lbtn ${d?'done':p?'prog':''} ${lk?'locked':''}" data-start="${l.id}" style="--uc:${uc(l.u)}"><span class="num">${d?ic('check',18,3.2):l.final?ic(lk?'lock':'trophy',18):l.id.replace('-','.')}</span><span class="t"><b>${l.title}</b><span>${d?`Done${S.acc[l.id]!=null?` · ${S.acc[l.id]}% first try`:''}`:p?'In progress · pick up where you left off':lk?'Unlocks after Units 1–4':l.goal}</span></span><span class="sr">${d?'Done':p?'In progress':lk?'Locked':'Not started'}</span></button></li>`;};
  const unit=u=>{const s=st(u.n), open=OPENU?OPENU.has(u.n):(nx&&nx.u===u.n), full=s.d===s.n, pct=s.n?s.d/s.n*100:0;
    const flat=[1,2,3,4,5].includes(u.n), art=flat?`<img class="scn" src="img/u${u.n}-scene.webp" alt="" loading="lazy" decoding="async">`:`<span class="bg" style="background-image:url(img/bg${u.n}.webp)"></span><img class="ch ch${u.n}" src="img/u${u.n}.webp" alt="" loading="lazy" decoding="async">`;
    return `<li class="su"><button type="button" class="scard u2" aria-expanded="${!!open}" aria-controls="ul${u.n}" data-u="${u.n}">
        <span class="c"><span class="n">Unit ${u.n} · ${u.time}</span><span class="tl"><b>${u.short}</b><span class="us">${u.title}</span></span>
        <span class="ml"><span class="m">${s.n} lessons · ${UMIN[u.n]} min</span>
          <span class="state${full?' full':''}"><span class="pb" aria-hidden="true"><i style="width:${pct}%"></i></span><span class="lft">${full?`${ic('check',14,3.2)} Complete`:`${s.n-s.d} left`}</span><span class="sr">, ${s.d} of ${s.n} lessons done</span></span>
          <span class="tog" aria-hidden="true">${ic('back',16,2.6).replace('<svg','<svg style="transform:rotate(-90deg)"')}</span></span></span>
        <span class="art${flat?' flat':''}" aria-hidden="true">${art}</span></button>
      <ul class="lessons" id="ul${u.n}" ${open?'':'hidden'}>${unitL(u.n).map(lbtn).join('')}</ul></li>`;};
  const fl=!unlocked(FINALL);
  const fin=`<li class="su"><button type="button" class="scard fin" data-start="final" ${fl?'aria-disabled="true"':''}><span class="c"><span class="n">Final challenge</span><b>Who to call, fast</b><span class="us">${S.done.final?`Passed · ${S.finalBest}% first try`:fl?`Unlocks after Units 1–4 · ${LESSONS.filter(l=>l.u<=4&&!S.done[l.id]).length} lessons to go`:'Open now · about 5 min'}</span></span><span class="tro">${ic(fl?'lock':'trophy',40,1.8)}</span></button></li>`;
  const pathP=`<ol class="sl">${UNITS.map(unit).join('')}${fin}</ol>`;
  const expP=`<div class="cpaths">${CPATHS.map((c,ci)=>`<div class="hcard cpath-c" style="--uc:var(--a${ci%5+1})"><h2 style="font-size:19px">${c.t}</h2><p class="muted small">${c.why} · ${c.ls.filter(id=>S.done[id]).length} of ${c.ls.length} done</p><ul class="lessons" style="padding:0">${c.ls.map(id=>lbtn(LBY(id))).join('')}</ul></div>`).join('')}</div>`;
  el.innerHTML=`<div class="ltabs" role="tablist" aria-label="Learning path views"><button type="button" role="tab" id="lt-path" aria-selected="${LTAB==='path'}" aria-controls="lp-path" tabindex="${LTAB==='path'?0:-1}">Path</button><button type="button" role="tab" id="lt-exp" aria-selected="${LTAB==='exp'}" aria-controls="lp-exp" tabindex="${LTAB==='exp'?0:-1}">Explore</button></div>
   <div role="tabpanel" id="lp-path" aria-labelledby="lt-path" ${LTAB==='path'?'':'hidden'}>${pathP}</div>
   <div role="tabpanel" id="lp-exp" aria-labelledby="lt-exp" ${LTAB==='exp'?'':'hidden'}><p class="muted" style="margin-bottom:12px">The same lessons, in the order that fits your work.</p>${expP}</div>`;
  $$('[data-start]',el).forEach(b=>b.onclick=()=>startLesson(b.dataset.start,false,b.hasAttribute('data-resume')));
  $$('.scard[data-u]',el).forEach(b=>b.onclick=()=>{const on=b.getAttribute('aria-expanded')!=='true'; b.setAttribute('aria-expanded',on); $('#ul'+b.dataset.u).hidden=!on; OPENU=new Set($$('.scard[data-u]',el).filter(x=>x.getAttribute('aria-expanded')==='true').map(x=>+x.dataset.u));});
  const tabs=$$('[role="tab"]',el); tabs.forEach((t,i)=>{t.onclick=()=>{LTAB=t.id==='lt-path'?'path':'exp'; drawPath(); $('#'+t.id).focus();}; t.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault(); tabs[(i+1)%2].click();}};});}

function drawCard(){const el=$('#cardBody'); const f=F(), meta=(BANK&&BANK.meta)||{};
  const ext=NUMS.filter(n=>!n[2]&&!/ClikFix: general/.test(n[0]));
  el.innerHTML=`<div class="urgent">
    <div class="call em"><span class="icb" style="background:var(--red);color:#fff">${ic('phone',22)}</span><div class="t"><span class="em-l">Emergency: police, fire, ambulance</span><span class="n">911</span><span class="small">Address: 10230 Jasper Avenue, between 102 and 103 Streets</span></div><div class="callacts"><a class="iconbtn" href="tel:911" aria-label="Call 911">${ic('phone',20)}</a></div></div>
    <div class="call"><span class="icb">${ic('shield',22)}</span><div class="t"><b>ESQ Security, 24/7</b><span class="n">780-428-1541</span><span class="small muted">Call right after 911 so they can bring the AED and guide responders.</span></div><div class="callacts"><a class="iconbtn" href="tel:7804281541" aria-label="Call ESQ Security">${ic('phone',20)}</a><button type="button" class="iconbtn" data-cp="780-428-1541" aria-label="Copy ESQ Security number">${ic('copy',20)}</button></div></div>
    <p class="phrase"><b>Need Security without saying so?</b> Call 780-428-1541 and say: “Can you bring me a coffee? I'm in [your suite].”</p></div>
   <div class="card"><h2>What to do</h2><ul class="tpts">
    <li><span class="dot">${ic('bell',14,3)}</span><span><b>Alarm:</b> everyone leaves. Stairs only, exit at the main floor, meet at the upper LRT platform. Wait for the All Clear.</span></li>
    <li><span class="dot">${ic('flame',14)}</span><span><b>Fire:</b> leave, close the door, pull the alarm, call 911, take the stairs.</span></li>
    <li><span class="dot">${ic('heart',14,3)}</span><span><b>Medical:</b> 911 first and stay on the line, then ESQ Security.</span></li>
    <li><span class="dot">${ic('help',14,3)}</span><span><b>Can't use the stairs:</b> go to the elevator lobby on your floor and wait for responders. Alone? Call 911 or use a help station.</span></li></ul></div>
   <div class="card"><h2>Your floor: ${f.name}</h2><div class="facts">${FACTS().map(([i,t,v])=>`<div class="fact">${ic(i,22)}<div><b>${t}</b><p class="muted">${v}</p></div></div>`).join('')}</div>
    <figure class="vis plan-img"><img loading="lazy" decoding="async" src="${VPLAN[S.floor||'2']}" alt="ESQ emergency floor plan for the ${f.name}."></figure>
    <p class="small"><a href="https://drive.google.com/file/d/18MFX1pu35_FlgygDhEtGm8uNQgxAWO91/view" target="_blank" rel="noopener">Full-size floor plans (PDF)</a> · <button type="button" class="link" data-go="me">Change your floor</button></p></div>
   <div class="card"><h2>Other numbers</h2><div class="numlist">${ext.map(([l,n])=>`<div class="numrow"><span>${l}</span><b>${n}</b><button type="button" class="iconbtn" data-cp="${n}" aria-label="Copy ${n}">${ic('copy',18)}</button></div>`).join('')}</div></div>
   <div class="card"><h2>Support</h2><ul class="tpts">
    <li><span class="dot">${ic('help',14,3)}</span><span>Someone needs support now: <b>EFAP Immediate Resources</b> page for staff.</span></li>
    <li><span class="dot">${ic('shield',14)}</span><span>Bullying or harassment, confidentially: the <b>Office of Safe Disclosure and Human Rights</b>, or your <b>HR Partner</b>.</span></li>
    <li><span class="dot">${ic('book',14,3)}</span><span>Report an incident or near miss: <a href="https://www.ualberta.ca/human-resources-health-safety-environment/environment-and-safety/report-an-incident/index.html" target="_blank" rel="noopener">U of A incident report</a>. Serious incidents: 780-492-5555.</span></li>
    <li><span class="dot">${ic('card',14,3)}</span><span>Questions: hse.info@ualberta.ca · workplace.wellbeing@ualberta.ca</span></li></ul></div>
   <button type="button" class="btn sec" id="copyAll">${ic('copy',18)} Copy the whole card</button>
   <div class="srcs muted"><p><b style="color:var(--ink)">In a real emergency, call 911</b> and follow building staff and your Floor Warden. ${esc(meta.reviewedBy&&meta.reviewedOn?`Reviewed by ${meta.reviewedBy} on ${meta.reviewedOn}.`:(meta.reviewNote||'Awaiting review by U of A HSE and ESQ Security.'))}</p>
    <ul><li><a href="https://drive.google.com/file/d/15jb5GztSjwXIh5BVmhjPSYKwoO0fYSh6/view" target="_blank" rel="noopener">Fire Safety and Emergency Procedures for Enterprise Square (2025)</a></li><li><a href="https://drive.google.com/file/d/1pEwP-uuBC5bAG_k37Ozas5FScKYJSWdE/view" target="_blank" rel="noopener">ESQ Tenant Safety Orientation (2024)</a></li><li><a href="https://sites.google.com/ualberta.ca/enterprise-sq-intranet/esq-community/health-safety" target="_blank" rel="noopener">ESQ intranet: Health and Safety</a></li></ul></div>`;
  $$('[data-cp]',el).forEach(b=>b.onclick=()=>copyText(b.dataset.cp)); $$('[data-go]',el).forEach(b=>b.onclick=()=>go(b.dataset.go,'floorH'));
  $('#copyAll').onclick=()=>copyText(['ESQ SAFETY CARD','Emergency: 911 (10230 Jasper Avenue)','ESQ Security, 24/7: 780-428-1541','Safety phrase to Security: "Can you bring me a coffee? I\'m in [suite]."',...FACTS().map(([,t,v])=>`${t}: ${v}`),...ext.map(([l,n])=>`${l}: ${n}`)].join('\n'));}

function unitStats(n){const ids=new Set(unitL(n).map(l=>l.id)); const qs=BANK?BANK.questions.filter(q=>ids.has(lessonOfQ(q))):[]; return Object.assign(countStates(qs),{all:qs.length});}
function buildingSVG(){const lv=UNITS.map(u=>{const s=unitStats(u.n), ld=unitL(u.n).filter(l=>S.done[l.id]).length/unitL(u.n).length; const r=s.all?s.retained/s.all:0; const v=.4*ld+.6*r; return v>=.75?'lit':v>=.25?'half':'glass';});
  const cls=k=>lv[k];
  const win=(x,y,c)=>`<rect x="${x}" y="${y}" width="14" height="18" rx="2" class="${c}"/>`;
  let s=`<svg class="bld" viewBox="0 0 320 232" role="img" aria-label="ESQ building. ${UNITS.map((u,k)=>`${u.short}: ${({lit:'lit up',half:'partly lit',glass:'not lit yet'})[lv[k]]}`).join('. ')}.">`;
  s+=`<rect x="0" y="0" width="320" height="200" fill="var(--bg2)"/><rect x="0" y="200" width="320" height="32" fill="var(--line)"/>`;
  s+=`<rect x="56" y="30" width="208" height="170" class="wall"/>`;
  [0,1,2,3].forEach(i=>s+=`<line x1="56" x2="264" y1="${70+i*40}" y2="${70+i*40}" stroke="var(--line2)" stroke-width="1.5"/>`);
  ['4','3','2','Main'].forEach((t,i)=>s+=`<text x="30" y="${55+i*40}" text-anchor="middle">${t}</text>`); s+=`<text x="30" y="219" text-anchor="middle">Concourse</text>`;
  [58,244].forEach(x=>{s+=`<rect x="${x}" y="32" width="18" height="166" class="${cls(0)}" opacity=".9"/>`; for(let k=0;k<8;k++) s+=`<path d="M${x+2} ${190-k*20}h7v-6h7" fill="none" stroke="var(--ink)" stroke-width="1.4" opacity=".55"/>`;});
  [[40,1],[80,1],[120,1]].forEach(([y],i)=>{for(let x=86;x<=226;x+=24){if(i===1&&x>=150) continue; s+=win(x,y,cls(1));}});
  s+=`<rect x="150" y="80" width="90" height="26" rx="3" class="${cls(3)}"/><text x="195" y="97" text-anchor="middle" style="fill:var(--ink)">Team room</text>`;
  s+=`<rect x="138" y="168" width="54" height="22" rx="3" class="${cls(2)}"/><text x="165" y="183" text-anchor="middle" style="fill:var(--ink)">Security</text>`;
  s+=`<rect x="90" y="168" width="30" height="32" class="glass"/><rect x="200" y="168" width="40" height="32" class="glass"/>`;
  s+=`<rect x="84" y="206" width="150" height="18" rx="6" class="${cls(4)}"/><text x="159" y="219" text-anchor="middle" style="fill:var(--ink)">LRT</text><path d="M292 200v-58" stroke="var(--ink)" stroke-width="3"/><circle cx="292" cy="138" r="8" class="${cls(4)}"/>`;
  return s+'</svg>';}

function drawMe(){const el=$('#meBody'); const L_=level();
  const done=MISSIONS.filter(m=>S.missions[m.id]).length;
  el.innerHTML=`<button type="button" class="cardbtn" data-go="card"><span class="icb" style="background:var(--red-t);color:var(--red)">${ic('card',22)}</span><span class="t"><b>Safety Card</b><span class="muted small">Every number and what to do, in order of urgency</span></span>${CHEV()}</button>
   <div class="card"><p class="eyebrow">${ic('shield',16)} Level ${L_+1}</p><h2>${LEVELS[L_][0]}</h2><p class="muted small">${L_<3?`Next: <b>${LEVELS[L_+1][0]}</b> · ${LEVELS[L_+1][1]}.`:'The highest level. Keep it current with Keep Ready.'} Levels never go down.</p></div>
   <div class="card"><h2>What should we call you?</h2><p class="muted small">Optional. Used only for your greeting, and it stays on this device.</p><div style="display:flex;gap:8px"><label class="sr" for="nmIn">Your first name</label><input type="text" id="nmIn" maxlength="40" autocomplete="given-name" placeholder="First name" value="${esc(S.name||'')}"><button type="button" class="btn sm" id="nmSave">Save</button></div></div>
   <div style="display:grid;gap:10px"><h2 id="misH">Field missions · ${done} of ${MISSIONS.length}</h2><p class="muted small" style="margin-top:-4px">Small real actions in the building. You mark them done yourself.</p><div class="missions">${MISSIONS.map(m=>{const d=S.missions[m.id];
     let acts=''; if(!d){if(m.kind==='copy') acts=`<button type="button" class="btn sm" data-m="save">${ic('copy',18)} Copy number</button>`; if(m.kind==='alertus') acts=`<button type="button" class="btn sm sec" data-m="alertus" data-a="ok">Green check</button><button type="button" class="btn sm sec" data-m="alertus" data-a="x">Red X</button><button type="button" class="btn sm sec" data-m="alertus" data-a="none">I can't see it</button>`; if(m.kind==='input') acts=`<label class="sr" for="wIn">Floor Warden's name</label><input type="text" id="wIn" placeholder="Floor Warden's name" value="${esc(S.warden||'')}"><button type="button" class="btn sm" data-m="warden">Save</button>`; if(m.kind==='confirm') acts=`<button type="button" class="btn sm sec" data-m="${m.id}">I did it</button>`;}
     const note=d?(m.id==='warden'&&S.warden?`Your Floor Warden: ${esc(S.warden)}`:m.id==='alertus'&&S.alertusNote?ALN[S.alertusNote]:'Done'):(typeof m.d==='function'?m.d():m.d);
     return `<div class="mis ${d?'done':''}"><span class="icb">${ic(d?'check':m.i,22)}</span><div class="t"><b>${m.t}</b><p class="muted small">${note}</p>${acts?`<div class="acts">${acts}</div>`:''}</div></div>`;}).join('')}</div></div>
   <div style="display:grid;gap:10px"><h2>Badges · ${BADGES.filter(b=>S.badges[b.id]).length} of ${BADGES.length}</h2><div class="badges">${BADGES.map(b=>{const on=!!S.badges[b.id]; return `<div class="bdg ${on?'':'off'}"><span class="bi">${ic(on?b.i:'lock',20)}</span><b>${b.n}</b><small>${b.d}</small><small>${on?'Earned '+new Date(S.badges[b.id]).toLocaleDateString('en-CA',{month:'short',day:'numeric'}):'Not yet'}</small></div>`;}).join('')}</div></div>
   <div class="card"><h2>Readiness</h2><p class="muted small">How ready you felt, from 1 to 5, and how you did. Feeling ready and getting it right aren't the same thing, so both are shown.</p><p>At the start: <b>${S.conf0||'–'}</b> · After the final challenge: <b>${S.conf1||'–'}</b> · Final challenge, first try: <b>${S.finalBest!=null?S.finalBest+'%':'not taken yet'}</b></p></div>
   <div class="card"><h2 id="floorH">Your floor</h2><p class="muted small">Used for your nearest AED, help station and floor plan.</p><div class="seg">${Object.entries(FLOORS).map(([k,f])=>`<button type="button" aria-pressed="${S.floor===k}" data-f="${k}">${f.name}</button>`).join('')}</div></div>
   <div class="card" id="syncCard"></div>
   <div class="card"><h2>For team leads and facilitators</h2><p class="muted small">A launch note, a 10-minute huddle script, anonymous team totals, and the quarterly team challenge.</p><div class="seg"><button type="button" id="leadsBtn">Open the leads guide</button><button type="button" id="teamBtn">Run a team challenge</button></div></div>
   <div class="card"><h2>Start over</h2><p class="muted small">Clears your lessons, review schedule, missions and badges everywhere they're synced.</p><div><button type="button" class="btn warn sm" id="resetBtn">Restart from the beginning</button></div></div>`;
  $$('[data-m]',el).forEach(b=>b.onclick=()=>{const id=b.dataset.m;
    if(id==='save') copyText('780-428-1541'); if(id==='alertus') S.alertusNote=b.dataset.a; if(id==='warden'){const v=$('#wIn').value.trim(); if(!v){toast('Type a name first'); $('#wIn').focus(); return;} S.warden=v.slice(0,60);}
    S.missions[id]=DAY(); const n=Object.keys(S.missions).length; const bd=earn('field')||(n>=5?earn('field5'):null); save(); kpiPush(); toast(bd?`${ic('pin',18)} Badge earned: ${bd.n}`:`${ic('check',18)} Mission done`); drawMe(); const h=$('#misH'); h.tabIndex=-1; h.focus({preventScroll:true});});
  $$('[data-f]',el).forEach(b=>b.onclick=()=>{S.floor=b.dataset.f; save(); drawMe(); toast('Floor updated'); const nb=$(`[data-f="${S.floor}"]`); nb&&nb.focus();});
  $('#leadsBtn').onclick=openLeads; bindCommon(el); $('#nmSave').onclick=()=>{S.name=$('#nmIn').value.trim().slice(0,40); save(); toast(S.name?`${ic('check',18)} Hi, ${esc(S.name)}`:'Name cleared');}; $('#teamBtn').onclick=()=>openTeam();
  $('#resetBtn').onclick=()=>dialog('Restart from the beginning?','This clears your lessons, review schedule, missions and badges, and takes you back to the start.','Restart','Cancel',()=>{S=fresh(); S.epoch=Date.now(); save(); flushSync(); onboard(0); render();});
  drawSync();}
