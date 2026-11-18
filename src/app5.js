/* ===== part 5: team challenge, sync, leads, onboarding, boot ===== */
const TEAM=[
 {q:'Q1',t:'Navigate ESQ',why:'Floor plans, routes and who needs help on the stairs.',items:['plan-05','evac-f01','mobility-f01'],act:'Walk to your second-nearest stairwell together after this meeting.'},
 {q:'Q2',t:'Hazard Detectives',why:'Find hazards, choose the strongest fix, and decide what to report.',items:['hazards-f01','hazmgmt-13','incidents-f01'],act:'Each of us checks one cord, power bar or blocked exit near our desks this week.'},
 {q:'Q3',t:'The Decision Room',why:'Who to call, and the words that keep speaking up safe.',items:['mix-f01','psych-23','care-23'],act:"Save ESQ Security's number, and thank one person this week for raising a concern."},
 {q:'Q4',t:'A Day at ESQ',why:'One evening that connects getting out, helping each other and heading home.',items:['case-late','final-f01'],act:"If you'll work late this season, check in with Security and plan your way home."}];
let TM=null;
function openTeam(qi){if(!BANK){toast('Loading questions…'); loadBank().then(()=>openTeam(qi)).catch(()=>toast("Couldn't load the questions.")); return;}
  TM={qi:qi==null?null:qi,i:0,rev:{},sc:null,prev:document.activeElement}; $('#team').hidden=false; setInert(true); document.body.style.overflow='hidden'; $('#tQuit').innerHTML=`${ic('x',20,2.6)}<span>Exit</span>`; teamRender();}
function closeTeam(){$('#team').hidden=true; setInert(false); document.body.style.overflow=''; const p=TM&&TM.prev; TM=null; render(); if(p&&p.focus&&document.contains(p)) p.focus();}
function teamScreens(t){const sc=[{k:'intro'}]; t.items.forEach((id,r)=>{const q=QB[id]; if(!q) return; const it=toItem(q); if(it.type==='branch'){sc.push({k:'setup',it,r}); it.nodes.forEach((n,j)=>sc.push({k:'node',it,n,j,r}));} else sc.push({k:'item',it,r});}); sc.push({k:'debrief'}); return sc;}
const LET='ABCDEFGH';
function teamRender(){const b=$('#tBody'), m=$('#tMain'), pv=$('#tPrev');
  if(TM.qi==null){const cur=Math.floor(new Date().getMonth()/3);
    $('#tTitle').textContent='Quarterly team challenge'; $('#tCount').textContent=''; pv.hidden=true; m.hidden=true;
    b.innerHTML=`<h2 class="tq" tabindex="-1">Quarterly team challenge</h2><p class="lead">15–20 minutes, projected on a screen. The team talks each round through, then you reveal the answer. No individual scores, and no one's personal answers are shown.</p><div class="qgrid">${TEAM.map((t,k)=>`<button type="button" class="qcard" data-q="${k}"><span class="eyebrow">${t.q}${k===cur?' · this quarter':''}</span><b style="font-size:22px">${t.t}</b><span class="muted">${t.why}</span></button>`).join('')}</div>`;
    $$('[data-q]',b).forEach(x=>x.onclick=()=>{TM.qi=+x.dataset.q; TM.sc=teamScreens(TEAM[TM.qi]); TM.i=0; TM.rev={}; teamRender();}); $('.tq',b).focus(); return;}
  const t=TEAM[TM.qi], s=TM.sc[TM.i], rv=!!TM.rev[TM.i], rounds=t.items.length; m.hidden=false; pv.hidden=false;
  $('#tTitle').textContent=`${t.q} · ${t.t}`; $('#tCount').textContent=s.r!=null?`Round ${s.r+1} of ${rounds}`:'';
  const disc='<p class="disc"><b>Talk it through:</b> what would you do, and why? Agree as a group before you reveal.</p>';
  let h='';
  if(s.k==='intro') h=`<p class="eyebrow">${t.q} · team challenge</p><h2 class="tq">${t.t}</h2><p class="lead">${t.why}</p><ol class="tlist"><li>${rounds} rounds. Read each situation aloud.</li><li>Discuss in pairs or as a group, then agree on an answer.</li><li>Reveal, and talk about why.</li><li>Finish with one action for this week.</li></ol>`;
  else if(s.k==='debrief') h=`<p class="eyebrow">Debrief</p><h2 class="tq">One action this week</h2><p class="disc">${t.act}</p><ol class="tlist"><li>What surprised us?</li><li>What would make the right move easier here at ESQ?</li></ol><p class="muted">Want to keep it fresh? Everyone's weekly Keep Ready episode practises the same skills, privately.</p>`;
  else if(s.k==='setup') h=`<p class="eyebrow">Mini story · ${s.it.title}</p><h2 class="tq">${s.it.setup}</h2><p class="disc">Three decisions follow. For each one, agree on what you'd do.</p>`;
  else if(s.k==='node'){const best=s.n.choices.find(c=>c.good); h=`<p class="eyebrow">${s.it.title} · decision ${s.j+1}</p><h2 class="tq">${s.n.prompt}</h2><ul class="tlist">${s.n.choices.map((c,k)=>`<li class="${rv&&c.good?'ok':''}"><span><b>${LET[k]}.</b> ${c.t}${rv&&c.good?' <b>✓ strongest choice</b>':''}</span>${rv?`<span class="why">${c.consequence}</span>`:''}</li>`).join('')}</ul>${rv?'':disc}`;}
  else {const it=s.it;
    if(['choice','multi','dialogue'].includes(it.type)) h=`<p class="eyebrow">${it.type==='dialogue'?'What would you say?':it.type==='multi'?'Select all that apply':'Choose the best action'}</p><h2 class="tq">${it.q}</h2>${it.img2&&it.img2[0]==='plan'?`<figure class="vis plan-img"><img src="${VPLAN[it.img2[1]]}" alt="ESQ emergency floor plan."></figure>`:''}<ul class="tlist">${it.opts.map((o,k)=>`<li class="${rv&&o.ok?'ok':''}"><span><b>${LET[k]}.</b> ${o.t}${rv&&o.ok?' <b>✓</b>':''}</span>${rv&&o.fb?`<span class="why">${o.fb}</span>`:''}</li>`).join('')}</ul>${rv?(it.fb&&it.type==='multi'?`<p class="disc">${it.fb}</p>`:''):disc}`;
    else if(it.type==='sort') h=`<p class="eyebrow">Sort it · ${it.buckets.join(' · ')}</p><h2 class="tq">${it.q}</h2><ul class="tlist">${it.cards.map(c=>`<li class="${rv?'ok':''}"><span>${c.t}${rv?` → <b>${c.bucket}</b>`:''}</span>${rv?`<span class="why">${c.fb}</span>`:''}</li>`).join('')}</ul>${rv?'':disc}`;
    else if(it.type==='order'){const tl=TM.sh&&TM.sh[TM.i]||(TM.sh=TM.sh||{},TM.sh[TM.i]=shuffle(it.items.concat(it.extra||[]))); h=`<p class="eyebrow">Put the steps in order</p><h2 class="tq">${it.q}</h2>${rv?`<ol class="tlist">${it.items.map(x=>`<li class="ok">${x}</li>`).join('')}</ol>${it.extra.length?`<p class="disc"><b>Doesn't belong:</b> ${it.extra.join('; ')}</p>`:''}<p class="disc">${it.fb}</p>`:`<ul class="tlist">${tl.map((x,k)=>`<li><span><b>${LET[k]}.</b> ${x}</span></li>`).join('')}</ul>${disc}`}`;}
    else if(it.type==='rank'){const tl=TM.sh&&TM.sh[TM.i]||(TM.sh=TM.sh||{},TM.sh[TM.i]=shuffle(it.items)); h=`<p class="eyebrow">Rank the fixes, strongest first</p><h2 class="tq">${it.q}</h2>${rv?`<ol class="tlist">${it.items.map(x=>`<li class="ok"><span>${x.t}</span><span class="why">${x.reason}</span></li>`).join('')}</ol>`:`<ul class="tlist">${tl.map((x,k)=>`<li><span><b>${LET[k]}.</b> ${x.t}</span></li>`).join('')}</ul>${disc}`}`;}
  }
  b.innerHTML=h; const needRev=(s.k==='item'||s.k==='node')&&!rv;
  m.textContent=needRev?'Reveal':TM.i===TM.sc.length-1?'Finish':'Next'; pv.textContent=TM.i===0?'Change theme':'Back';
  const f=$('.tq',b); if(f){f.tabIndex=-1; f.focus({preventScroll:true});} b.parentElement.scrollTop=0;}
$('#tMain').onclick=()=>{if(!TM||TM.qi==null) return; const s=TM.sc[TM.i]; if((s.k==='item'||s.k==='node')&&!TM.rev[TM.i]){TM.rev[TM.i]=1; teamRender(); live('Answer revealed'); return;} if(TM.i>=TM.sc.length-1){closeTeam(); return;} TM.i++; teamRender();};
$('#tPrev').onclick=()=>{if(!TM) return; if(TM.i===0){TM.qi=null; teamRender(); return;} TM.i--; teamRender();};
$('#tQuit').onclick=()=>closeTeam();

/* ---------- sync (private per-person storage on claude.ai) ---------- */
var CAP={db:null,user:null,com:null,uid:null,admin:false};
function stripS(o){const c=JSON.parse(JSON.stringify(o)); delete c.warden; delete c.name; return c;}
var syncT=null, syncBusy=false, syncAgain=false, syncState='local';
function syncSoon(){if(!CAP.uid) return; clearTimeout(syncT); syncT=setTimeout(syncPush,2500);}
function flushSync(){if(syncT){clearTimeout(syncT); syncT=null; syncPush();}}
addEventListener('pagehide',flushSync);
async function syncPush(){syncT=null; if(!CAP.uid) return; if(syncBusy){syncAgain=true; return;} syncBusy=true;
  try{const ref=CAP.db.doc('data/users/'+CAP.uid+'/progress');
    try{const d=await ref.get(); const r=d.exists?d.data():null; let rem=null; try{rem=r&&typeof r.s==='string'?coerceS(JSON.parse(r.s)):null;}catch(e){rem=null;}
      if(rem){rem._t=+r.t||rem._t||0; const before=JSON.stringify(stripS(S)); const m=mergeS(S,rem); if(JSON.stringify(stripS(m))!==before){S=m; try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){} softRender();}}}catch(e){if(e&&e.code==='invalid_argument') throw e;}
    await ref.set({v:2,t:S._t||Date.now(),s:JSON.stringify(stripS(S))}); setSync('on');}
  catch(e){if(e&&e.code==='invalid_argument'){CAP.uid=null; setSync('ro');} else setSync('err');}
  syncBusy=false; if(syncAgain){syncAgain=false; syncPush();}}
async function syncPull(){if(!CAP.uid||(PL&&!player.hidden)) return;
  try{const d=await CAP.db.doc('data/users/'+CAP.uid+'/progress').get(); const r=d.exists?d.data():null; let rem=null; try{rem=r&&typeof r.s==='string'?coerceS(JSON.parse(r.s)):null;}catch(e){rem=null;}
    if(!rem){syncPush(); return;}
    rem._t=+r.t||rem._t||0; const before=JSON.stringify(stripS(S)); const m=mergeS(S,rem); const after=JSON.stringify(stripS(m));
    if(after!==before){const firstSeen=!S.onboarded&&m.onboarded, wasReset=S.onboarded&&!m.onboarded; S=m; try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){} if(wasReset){onboard(0); return;} if(firstSeen) closeOnb(); else softRender(); toast(ic('check',18)+' Progress synced from your account');}
    if(r.v!==2||JSON.stringify(stripS(rem))!==after) syncPush(); else setSync('on');}
  catch(e){setSync('err');}}
function setSync(s){syncState=s; const el=$('#syncSt'); if(el) el.innerHTML=syncLine();}
function syncLine(){return ({on:`${ic('check',16,3)} Synced to your claude.ai account. Sign in on any device to pick up where you left off.`,
  local:STORE_OK?`${ic('lock',16)} Saved in this browser only. Sign in to claude.ai to sync, or use a progress code below.`:`${ic('x',16,3)} Not saved: this browser view blocks storage. Copy a progress code before you leave.`,
  ro:`${ic('lock',16)} This page can't save to your account, so progress is saved in this browser only.`,
  err:`${ic('x',16,3)} Couldn't reach your account just now. Progress is still saved in this browser and will sync next time.`})[syncState];}
const B64={enc:s=>btoa(String.fromCharCode(...new TextEncoder().encode(s))),dec:s=>new TextDecoder().decode(Uint8Array.from(atob(s),c=>c.charCodeAt(0)))};
function progressCode(){const o=stripS(S); ['kw','pulse','_t'].forEach(k=>delete o[k]); return 'ESQ2.'+B64.enc(JSON.stringify(o));}
function readCode(txt){const m=String(txt||'').trim().replace(/\s+/g,''); if(!/^ESQ[12]\./.test(m)) return null; try{const o=JSON.parse(B64.dec(m.slice(5))); return o&&typeof o==='object'&&o.done&&typeof o.done==='object'?o:null;}catch(e){return null;}}
function drawSync(){const el=$('#syncCard'); if(!el) return;
  el.innerHTML=`<h2>Save and sync</h2><p class="muted small" id="syncSt" role="status">${syncLine()}</p>
   <details class="pcode"><summary>Your data</summary><p class="muted small">Saved: lessons done, first-try scores, your review schedule, missions, readiness ratings and next-step choices. Where: this browser and, if you're signed in, your private claude.ai storage (Anthropic). The app owner can't see it. Each week an unnamed tally (episodes, missions, "since last week" answers) is saved for team totals. Your Floor Warden's name and anything you type in reflections never leave this device.</p>${CAP.uid?'<button type="button" class="btn sec sm" id="delSync">Delete my synced data</button>':''}</details>
   <details class="pcode"><summary>Move to another device with a progress code</summary><p class="muted small">Copy your code here, then paste it on the other device.</p><button type="button" class="btn sec sm" id="pcCopy">${ic('copy',18)} Copy my progress code</button><label for="pcIn" class="lbl">Paste a code to restore</label><textarea id="pcIn" rows="3" spellcheck="false" autocomplete="off"></textarea><div><button type="button" class="btn blue sm" id="pcGo">Restore progress</button></div></details>`;
  const ds=$('#delSync'); if(ds) ds.onclick=()=>dialog('Delete your synced data?',"This removes your progress from your claude.ai storage and this week's unnamed tally. Progress in this browser stays.",'Delete synced data','Cancel',async()=>{try{await CAP.db.doc('data/users/'+CAP.uid+'/progress').delete(); if(S.kw) await CAP.db.doc('kpi/'+S.kw.id).delete(); CAP.uid=null; setSync('local'); toast('Synced data deleted. Sync is off until you reload.');}catch(e){toast("Couldn't delete right now. Try again.");}});
  $('#pcCopy').onclick=()=>{const c=progressCode(); copyText(c); const t=$('#pcIn'); if(t&&!t.value){t.value=c; t.select();}};
  $('#pcGo').onclick=()=>{const o=readCode($('#pcIn').value); if(!o){toast("That doesn't look like an Everyday Safe progress code."); $('#pcIn').focus(); return;}
    dialog('Replace your progress?','Your progress on this device will be replaced with the progress in the code.','Replace progress','Cancel',()=>{const w=S.warden, nm=S.name; delete o.kw; S=coerceS(o.v===2?Object.assign(fresh(),o):o); S.warden=w; S.name=nm; S.epoch=Date.now(); save(); flushSync(); render(); toast(ic('check',18)+' Progress restored');});};}
async function initCaps(){let tries=0; while(!(window.claude&&typeof window.claude.use==='function')&&tries<20){await new Promise(r=>setTimeout(r,150)); tries++;}
  if(!(window.claude&&typeof window.claude.use==='function')) return;
  try{const [db,user,com]=await Promise.all([claude.use('db'),claude.use('user'),claude.use('comments')].map(p=>p.catch(()=>null)));
    CAP.db=db; CAP.user=user; CAP.com=com; if(user){try{CAP.admin=!!(await user.canEdit());}catch(e){}}
    if(db&&user){let id=null; try{id=await user.id();}catch(e){} if(id){CAP.uid=id; setSync('on'); await syncPull();}}
    if(!CAP.uid) setSync('local'); softRender();}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden') flushSync(); else syncPull();});
addEventListener('pageshow',e=>{if(e.persisted) syncPull();});

/* anonymous weekly totals: no names, ids or scores */
function kpiKey(){const w=WEEK(); if(!S.kw||S.kw.w!==w){let id; try{id='k'+Array.from(crypto.getRandomValues(new Uint32Array(3))).join('');}catch(e){id='k'+String(Math.random()).slice(2,14);} S.kw={w,id};} return S.kw;}
let kpiBusy=false, kpiAgain=false;
async function kpiPush(){if(!CAP.db||!CAP.uid) return; if(kpiBusy){kpiAgain=true; return;} kpiBusy=true; const k=kpiKey(), w='w'+k.w; save();
  const P_=S.pulse[w]||[], wk0=k.w*7-3; const misW=Object.values(S.missions).filter(d=>d>=wk0&&d<wk0+7).length;
  const d={w:k.w,v:1,rounds:Math.min((S.ep[w]||{}).n||0,2),weekly:0,mission:misW?1:0,cases:0,stairs:P_.includes('stairs')||(S.missions.stairs>=wk0)?1:0,alertus:P_.includes('alertus')?1:0,report:P_.includes('report')?1:0,checkin:P_.includes('checkin')?1:0};
  try{await CAP.db.doc('kpi/'+k.id).set(d);}catch(e){} kpiBusy=false; if(kpiAgain){kpiAgain=false; kpiPush();}}
async function drawInsights(el){if(!el) return; if(!CAP.admin||!CAP.db){el.innerHTML=''; return;} el.innerHTML='<p class="muted">Loading team totals…</p>';
  try{const now=WEEK(); const snap=await CAP.db.collection('kpi').where('w','>=',now-5).get(); const by={};
    snap.docs.forEach(d=>{const x=d.data(); if(!x||x.v!==1||typeof x.w!=='number'||!/^k\d{8,40}$/.test(d.id||'')) return; const g=by[x.w]||(by[x.w]={n:0,r1:0,mission:0,report:0,stairs:0}); g.n++; if((+x.rounds||0)>=1) g.r1++; ['mission','report','stairs'].forEach(k=>g[k]+=x[k]?1:0);});
    const lbl=i=>i===0?'This week':i===1?'Last week':`${i} weeks ago`;
    const rows=[0,1,2,3,4,5].map(i=>{const g=by[now-i]; if(!g) return `<tr><th scope="row">${lbl(i)}</th><td colspan="4" class="muted">No activity</td></tr>`; if(g.n<3) return `<tr><th scope="row">${lbl(i)}</th><td colspan="4" class="muted">Fewer than 3 people, so totals are hidden</td></tr>`; return `<tr><th scope="row">${lbl(i)}</th><td>${g.n}</td><td>${g.r1}</td><td>${g.mission}</td><td>${g.report}</td></tr>`;}).join('');
    el.innerHTML=`<div class="tscroll"><table class="ktab"><caption class="sr">Anonymous weekly totals</caption><thead><tr><th scope="col">Week</th><th scope="col">People</th><th scope="col">Did a Keep Ready episode</th><th scope="col">Did a field mission</th><th scope="col">Reported a hazard</th></tr></thead><tbody>${rows}</tbody></table></div><p class="muted small">Approximate and self-reported. Counts come from people signed in to claude.ai and are stored without names. Engagement isn't evidence of readiness, so pair these with HSE near-miss reports and Security check-in logs.</p>`;}
  catch(e){el.innerHTML='<p class="muted">Couldn\'t load team totals right now.</p>';}}

/* ---------- leads guide ---------- */
const APP_URL='https://claude.ai/artifact/9CANNBmq7e2eU3UQ6t4Z3U';
function leadsHTML(){const w=weekTheme(), meta=(BANK&&BANK.meta)||{};
  const kick=`Hi team, we're using Everyday Safe, short practice on staying safe at work: emergencies at Enterprise Square, hazards, your rights, and speaking up as a team. Start with the five first-week essentials (about 4 minutes a day), then do the 3-minute Keep Ready episode once a week. Your answers are private to you; the app keeps only unnamed weekly team totals. ${APP_URL}`;
  const hud=w?`Safety huddle, 10 minutes (${w.title})\n1. Scenario (2 min): ${w.huddle.scenario}\n2. Discuss (5 min): ${w.huddle.q1} ${w.huddle.q2}\n3. Commit (3 min): ${w.mission.t}. ${w.mission.detail}`:'';
  leadsHTML.kick=kick; leadsHTML.hud=hud;
  return `<h2 id="ldH" class="qh" tabindex="-1">For team leads</h2><p>Everyday Safe works best as a team habit, not a one-time course.</p>
   <div class="card"><h3>Launch in three steps</h3><ol><li><b>Send a kickoff note.</b> <button type="button" class="link" id="cpKick">Copy a ready-made note</button></li><li><b>Run a 10-minute huddle</b> at your next team meeting (below).</li><li><b>Book the quarterly team challenge:</b> 15–20 minutes, projected, no individual scores. <button type="button" class="link" id="ldTeam">Open it</button></li></ol></div>
   ${w?`<div class="card"><h3>This week's huddle: ${esc(w.title)}</h3><ol><li><b>Scenario (2 min):</b> ${esc(w.huddle.scenario)}</li><li><b>Discuss (5 min):</b> ${esc(w.huddle.q1)} ${esc(w.huddle.q2)}</li><li><b>Commit (3 min):</b> ${esc(w.mission.t)}.</li></ol><div><button type="button" class="btn sec sm" id="cpHud">${ic('copy',18)} Copy the huddle script</button></div></div>`:''}
   <div class="card"><h3>Check in, don't check up</h3><ul><li>Ask: "Did you try this week's action? Anything get in the way?"</li><li>Never ask for scores or screenshots. Scores stay private to each person.</li><li>Never ask in a group who would need help on the stairs. People tell their manager or Floor Warden privately.</li></ul></div>
   <div class="card"><h3>Team totals</h3>${CAP.admin?'<div id="insights"></div>':'<p class="muted small">Unnamed weekly totals show here for people with edit access.</p>'}</div>
   <div class="card"><h3>About the content</h3><p class="muted small">Question bank version ${esc(String(meta.version||''))}. ${esc(meta.reviewedBy&&meta.reviewedOn?`Reviewed by ${meta.reviewedBy} on ${meta.reviewedOn}.`:(meta.reviewNote||'Not yet reviewed by subject-matter experts.'))} Spot an error? After answering any question, use "Report a problem with this question".</p></div>`;}
let leadsPrev=null;
function openLeads(){const p=$('#leads'); leadsPrev=document.activeElement; $('#leadsX').innerHTML=`${ic('x',20,2.6)}<span>Close</span>`; $('#leadsIn').innerHTML=leadsHTML(); p.hidden=false; setInert(true); document.body.style.overflow='hidden';
  $('#cpKick').onclick=()=>copyText(leadsHTML.kick); const h=$('#cpHud'); if(h) h.onclick=()=>copyText(leadsHTML.hud); $('#ldTeam').onclick=()=>{closeLeads(); openTeam();};
  if(CAP.admin) drawInsights($('#insights')); $('#ldH').focus();}
function closeLeads(){const p=$('#leads'); if(p.hidden) return; p.hidden=true; setInert(false); document.body.style.overflow=''; if(leadsPrev&&leadsPrev.focus&&document.contains(leadsPrev)) leadsPrev.focus();}
$('#leadsX').onclick=closeLeads;

/* ---------- onboarding ---------- */
let ob=0;
function onboard(k){ob=k; const o=$('#onb'); o.hidden=false; setInert(true); document.body.style.overflow='hidden';
  $('#onbBar').style.width=((k+1)/3*100)+'%'; $('#onbBack').innerHTML=ic('back',22,2.6); $('#onbBack').style.visibility=k?'visible':'hidden';
  const B=$('#onbBody'), Fo=$('#onbFoot');
  if(k===0){B.innerHTML=`<span class="icb" style="width:64px;height:64px;border-radius:8px;background:var(--green);color:var(--on)">${MARK.replace('width="22" height="22"','width="40" height="40"')}</span><h1 id="onbH" tabindex="-1">Know your building. Practise the decisions that matter.</h1><p class="lead">Short, practical lessons on what to do in an emergency at Enterprise Square, then a 3-minute Keep Ready episode each week to keep it fresh.</p><ul class="tpts"><li><span class="dot">${ic('path',14,3)}</span><span>5 units that follow a workday, 26 short lessons. Open any of them.</span></li><li><span class="dot">${ic('target',14,3)}</span><span>Over 200 questions in a bank, so each week brings new situations.</span></li><li><span class="dot">${ic('card',14,3)}</span><span>A Safety Card with every number, always one tap away.</span></li></ul><p class="muted small">Built from ESQ's emergency procedures and U of A safety guidance. In a real emergency, call 911. Your progress is saved in this browser and, if you're signed in to claude.ai, in your private claude.ai storage. No one else sees it.</p>`;
    Fo.innerHTML=`<button type="button" class="btn sec" id="obCard">Open the Safety Card</button><button type="button" class="btn" id="obNext">Start with the essentials</button>`;
    $('#obCard').onclick=()=>{S.onboarded=true; save(); closeOnb('card');}; $('#obNext').onclick=()=>onboard(1);}
  if(k===1){B.innerHTML=`<h1 id="onbH" tabindex="-1">Which floor do you work on?</h1><p class="lead">So we can point you to your nearest AED, help station and floor plan.</p><div class="opts">${Object.entries(FLOORS).map(([f,x],j)=>`<button type="button" class="opt" data-of="${f}" aria-pressed="${S.floor===f}"><span class="key">${j+1}</span><span class="ot">${x.name}</span></button>`).join('')}</div>`;
    Fo.innerHTML=`<button type="button" class="btn sec" id="obSkip">Skip</button><button type="button" class="btn" id="obNext" ${S.floor?'':'disabled'}>Continue</button>`;
    $$('[data-of]',B).forEach(b=>b.onclick=()=>{S.floor=b.dataset.of; save(); $$('[data-of]',B).forEach(x=>x.setAttribute('aria-pressed',x===b)); $('#obNext').disabled=false;});
    $('#obSkip').onclick=()=>onboard(2); $('#obNext').onclick=()=>onboard(2);}
  if(k===2){B.innerHTML=`<h1 id="onbH" tabindex="-1">How ready do you feel for an emergency at ESQ right now?</h1><p class="lead">Optional. There's no wrong answer, and we'll ask again after the final challenge.</p><div class="scale" id="c0">${[1,2,3,4,5].map(v=>`<button type="button" aria-pressed="${S.conf0===v}" data-v="${v}" aria-label="${v} of 5">${v}</button>`).join('')}</div><div class="scale-ends"><span>Not at all</span><span>Completely</span></div>`;
    Fo.innerHTML=`<button type="button" class="btn" id="obNext">Start the first lesson</button>`;
    $$('#c0 button',B).forEach(b=>b.onclick=()=>{S.conf0=+b.dataset.v; save(); $$('#c0 button',B).forEach(x=>x.setAttribute('aria-pressed',x===b));});
    $('#obNext').onclick=()=>{S.onboarded=true; save(); closeOnb(); startLesson('1-1');};}
  const h=$('#onbH'); h&&h.focus({preventScroll:true});}
function closeOnb(t){$('#onb').hidden=true; setInert(false); document.body.style.overflow=''; go(t||'today');}
$('#onbBack').onclick=()=>{if(ob>0) onboard(ob-1);};

/* ---------- keyboard ---------- */
const openOv=()=>['dlg','player','team','leads','onb'].map(id=>$('#'+id)).find(x=>!x.hidden);
document.addEventListener('keydown',e=>{const ov=openOv();
  if(e.key==='Escape'){if(!$('#dlg').hidden){$('#dlgNo').click(); return;} if(!$('#leads').hidden){closeLeads(); return;} if(!$('#team').hidden){closeTeam(); return;}}
  if(e.key==='Tab'&&ov){const f=$$('button,[href],input,textarea,select,summary,[tabindex]:not([tabindex="-1"])',ov).filter(x=>!x.disabled&&x.offsetParent!==null&&!x.closest('[hidden]')); if(!f.length) return; const a=f[0], z=f[f.length-1];
    if(!ov.contains(document.activeElement)){e.preventDefault(); a.focus(); return;} if(e.shiftKey&&document.activeElement===a){e.preventDefault(); z.focus();} else if(!e.shiftKey&&document.activeElement===z){e.preventDefault(); a.focus();} return;}
  if(ov!==player||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&!e.target.closest('.opts,.tiles,.answer,.rk,.buckets,.pairs,.seg,.planwrap,.hzscroll')){if(e.key==='ArrowLeft'&&PL&&PL.view>0&&!PL.done){e.preventDefault(); pPrev.onclick(); return;} if(e.key==='ArrowRight'&&!pMain.hidden&&!pMain.disabled&&PL&&(PL.res[PL.view]||NONQ.includes((PL.q[PL.view]||{}).type))){e.preventDefault(); pMain.click(); return;}}
  if(e.key==='Enter'&&!e.target.closest('button,a,summary')){e.preventDefault(); if(!pMain.disabled) pMain.click(); return;}
  if(/^[1-9]$/.test(e.key)&&!e.altKey&&!e.ctrlKey&&!e.metaKey){const c=$$('[data-key]',pBody).filter(b=>!b.disabled&&b.dataset.key===e.key&&b.offsetParent!==null); const t=c[c.length-1]; if(t){t.click(); e.preventDefault();}}});

/* ---------- boot ---------- */
document.documentElement.lang='en-CA'; document.documentElement.dataset.theme='light'; $('#topMark').innerHTML=ic('shield',24,2.2); $('#railMark').innerHTML=ic('shield',20,2.2); $('#dlg').addEventListener('click',e=>{if(e.target.id==='dlg') $('#dlgNo').click();});
render(); if(!S.onboarded) onboard(0);
loadBank().then(()=>{if(location.hash==='#team'&&S.onboarded) openTeam();}).catch(()=>{});
initCaps();
