/* ===== part 3b: instructional patterns (Unit 1) =====
   Demonstrate → Guide → Apply (procedures) · Explore → Locate → Retrieve (spatial) · Compare → Explain → Transfer (discrimination) */
const IMG=k=>QIMG[k]||STORYIMG[k]||INTROIMG[k]||LIMG[k]||null;
const figure=(k,cls='intro-img')=>{const m=IMG(k); return m?`<figure class="${cls}"><img decoding="async" src="${m[0]}" alt="${esc(m[1])}"></figure>`:'';};

/* Positions of symbols on the official ESQ emergency procedure plans (percent of image width/height), read from the plans themselves. */
const PLANS={
 C:{legend:[0,23,21.5,59],items:[['exit',20.6,21.6],['exit',21,63.6],['exit',21,71.8],['exit',74.8,23.3],['exit',75.2,52.7],['exit',75.2,59.6],['exit',42.4,87],['noexit',19.5,80.9],['wheel',50,56.1]]},
 '1':{legend:[0,33,13.8,73],items:[['exit',15.3,25.9],['exit',15.7,48.3],['exit',15.2,60.5],['exit',15.2,68.3],['exit',87.3,4.4],['exit',89.3,48.6],['exit',86.5,60.3],['exit',44.3,88.3],['exit',72,88.3],['wheel',51.7,58.9],['aed',54,62.5]]},
 '2':{legend:[0,21,20.4,60],items:[['exit',21.9,22.9],['exit',21.9,55.3],['exit',22.4,69.9],['exit',65.5,2.6],['exit',81.5,45.4],['exit',82,56.3],['exit',47.8,88.1],['aed',72.2,36.4],['aed',49.3,73.5],['wheel',50.3,52],['noexit',74.3,1.5]]},
 '3':{legend:[0,29,19,57.5],items:[['exit',20.7,26.5],['exit',20.7,59.2],['exit',20.5,71.9],['exit',63.7,6.1],['exit',76.1,27],['exit',77.2,59],['exit',48.3,80.4],['aed',64.6,29.9],['wheel',48.9,58]]},
 '4':{legend:[0,27,23.5,47],items:[['exit',20.3,22.3],['exit',19.4,59.6],['exit',54.2,23.4],['exit',85.1,23.6],['exit',85,59.4],['exit',41.5,73.6],['wheel',49.1,58.3]]}};
const KIND={exit:{n:'Emergency stairwell',sym:'exit',why:'A red EXIT sign with an arrow marks an emergency stairwell. Use the nearest one, and know a second in case smoke blocks it.'},
 wheel:{n:'Mobility rescue location',sym:'wheel',why:'The blue wheelchair sign is the elevator lobby, near the centre of every floor. Anyone who can\'t use the stairs waits here with their helpers for responders.'},
 aed:{n:'AED',sym:'aed',why:'The red heart with a lightning bolt is an AED. ESQ Security brings one when you call them after 911.'},
 noexit:{n:'Roll shutter: no exit',sym:'noexit',why:'A red NO EXIT sign marks a roll shutter that closes during an alarm. It is not a way out.'}};
const planImg=f=>`<img src="${VPLAN[f]}" alt="Official ESQ emergency procedure plan for the ${FLOORS[f].name}." loading="lazy" decoding="async">`;

/* Demonstrate: an approved model, step by step, with the decision cue for each step */
R.model=(it,el)=>{el.innerHTML=`<p class="tag">${ic('book',16,3)} Watch it done · ${it.kicker||'the approved steps'}</p><h2 class="qh">${it.title}</h2>${it.text?`<p class="txt">${it.text}</p>`:''}
  <ol class="model">${it.steps.map((s,k)=>`<li><div class="mb">${s.img?figure(s.img,'intro-img mimg'):''}<div class="mrow"><span class="mn">${k+1}</span><p class="ma">${s.act}</p></div><p class="mc"><b>Why:</b> ${s.cue}</p></div></li>`).join('')}</ol>
  ${it.note?`<p class="phrase">${it.note}</p>`:''}${it.more&&it.more.length?`<details class="more"><summary>More detail</summary><ul>${it.more.map(x=>`<li>${x}</li>`).join('')}</ul></details>`:''}`;};

/* Explain: two situations side by side, with the cue that tells them apart */
R.compare=(it,el)=>{const col=c=>`<div class="cmp-c${c.bad?' bad':''}">${c.img?figure(c.img,'intro-img'):''}<p class="eyebrow">${c.k}</p><h3>${c.h}</h3><ul class="tpts">${c.pts.map(x=>`<li><span class="dot${c.bad?' bad':''}">${ic(c.bad?'x':'check',14,3.2)}</span><span>${x}</span></li>`).join('')}</ul></div>`;
  el.innerHTML=`<p class="tag">${ic('book',16,3)} Compare</p><h2 class="qh">${it.title}</h2><div class="cmp">${col(it.a)}${col(it.b)}</div><p class="phrase"><b>The cue:</b> ${it.cue}</p>`;};

/* Guide: a partly completed sequence. Given steps are fixed; the learner places the rest. */
R.fade=(it,el)=>{head(it,el); const n=it.items.length, given=new Set(it.given);
  el.insertAdjacentHTML('beforeend',`<p class="hint">The first ${it.given.length===1?'step is':it.given.length+' steps are'} done for you. Tap the remaining steps in order. Tap a placed step to send it back.</p>`);
  const slots=it.items.map((t,k)=>given.has(k)?k:null); const missing=shuffle(it.items.map((t,k)=>k).filter(k=>!given.has(k)));
  const ans=document.createElement('ol'); ans.className='fade'; ans.setAttribute('aria-label','Sequence'); const bank=document.createElement('div'); bank.className='tiles'; bank.setAttribute('role','group'); bank.setAttribute('aria-label','Steps to place'); el.append(ans,bank);
  function draw(){ans.innerHTML=''; slots.forEach((k,p)=>{const li=document.createElement('li');
      if(given.has(p)) li.innerHTML=`<span class="n">${p+1}</span><span>${it.items[p]}</span><span class="mark-l ok" style="margin:0 0 0 auto">Given</span>`, li.className='given';
      else if(k==null) li.innerHTML=`<span class="n">${p+1}</span><span class="muted">Empty</span>`, li.className='empty';
      else {const b=document.createElement('button'); b.type='button'; b.className='chip'; b.innerHTML=`<span class="n">${p+1}</span><span>${it.items[k]}</span>`; b.setAttribute('aria-label',`Step ${p+1}: ${it.items[k].replace(/<[^>]+>/g,'')}. Remove`); b.onclick=()=>{if(PL.res[PL.view]) return; slots[p]=null; draw();}; li.appendChild(b);}
      ans.appendChild(li);});
    bank.innerHTML=''; missing.forEach((k,j)=>{if(slots.includes(k)) return; const b=document.createElement('button'); b.type='button'; b.className='chip'; b.dataset.key=j+1; b.innerHTML=`<span>${it.items[k]}</span>`; b.onclick=()=>{if(PL.res[PL.view]) return; const p=slots.findIndex((x,q)=>x==null&&!given.has(q)); if(p<0) return; slots[p]=k; draw(); const nx=bank.querySelector('.chip'); (nx||pMain).focus();}; bank.appendChild(b);});
    PL.cur.ready=slots.every(x=>x!=null); can(PL.cur.ready);}
  draw();
  PL.cur.eval=()=>{let nR=0, nF=0; slots.forEach((k,p)=>{if(given.has(p)) return; nF++; if(k===p) nR++;}); const ok=nR===nF;
    $$('.chip',ans).forEach(c=>c.disabled=true); [...ans.children].forEach((li,p)=>{if(given.has(p)) return; const c=$('.chip',li); if(c){c.classList.add(slots[p]===p?'ok':'no'); c.insertAdjacentHTML('beforeend',slots[p]===p?'<span class="mark-l ok">✓</span>':'<span class="mark-l you">moved</span>');}});
    return {ok,right:nR,of:nF,title:ok?'That\'s the right order':`${nR} of ${nF} in the right place`,body:`${ok?'':`<p class="ans">The approved order:</p><ol>${it.items.map(t=>`<li>${t}</li>`).join('')}</ol>`}<p>${it.fb}</p>`};};};

/* Explore: the real plan, annotated. Learners can switch floors and highlight each kind of symbol. */
R.explore=(it,el)=>{let f=S.floor&&PLANS[S.floor]?S.floor:'2';
  function draw(){const P=PLANS[f]; const kinds=[...new Set(P.items.map(x=>x[0]))]; let n=0;
    el.innerHTML=`<p class="tag">${ic('path',16,3)} Explore · your floor plan</p><h2 class="qh">${it.title}</h2><p class="txt">${it.text}</p>
     <div class="seg" role="group" aria-label="Floor">${Object.keys(PLANS).map(k=>`<button type="button" data-fl="${k}" aria-pressed="${k===f}">${FLOORS[k].name}</button>`).join('')}</div>
     <div class="hztools"><button type="button" class="link pzoom" aria-pressed="false">Zoom in</button><span class="hzcount">${FLOORS[f].name}${S.floor===f?' · your floor':''}</span></div>
     <div class="hzscroll"><div class="planwrap">${planImg(f)}${P.items.map(([k,x,y])=>`<span class="pmk k-${k}" style="left:${x}%;top:${y}%" aria-hidden="true">${++n}</span>`).join('')}</div></div>
     <ul class="plegend">${kinds.map(k=>{const nums=P.items.map((x,i)=>x[0]===k?i+1:0).filter(Boolean); return `<li><button type="button" class="pkind" data-k="${k}" aria-pressed="false"><span class="psym">${SYM[KIND[k].sym]}</span><span class="t"><b>${KIND[k].n}</b> <span class="muted small">· ${nums.length===1?'marker '+nums[0]:nums.length+' markers'}</span><span class="small">${KIND[k].why}</span></span></button></li>`;}).join('')}
      ${!kinds.includes('aed')?`<li class="muted small" style="padding:4px 2px">No AED on this floor. Nearest: ${FLOORS[f].aed}.</li>`:''}</ul>
     <p class="muted small">Tap a symbol above to highlight it on the plan. ${PLANNOTE[f]||''}</p>`;
    $$('[data-fl]',el).forEach(b=>b.onclick=()=>{f=b.dataset.fl; draw(); $(`[data-fl="${f}"]`,el).focus();});
    $$('.pkind',el).forEach(b=>b.onclick=()=>{const on=b.getAttribute('aria-pressed')!=='true'; $$('.pkind',el).forEach(x=>x.setAttribute('aria-pressed','false')); b.setAttribute('aria-pressed',on); $$('.pmk',el).forEach(m=>m.classList.toggle('hl',on&&m.classList.contains('k-'+b.dataset.k))); $$('.pmk',el).forEach(m=>m.classList.toggle('dim',on&&!m.classList.contains('k-'+b.dataset.k)));});
    const zb=$('.pzoom',el); zb.onclick=()=>{const on=zb.getAttribute('aria-pressed')!=='true'; zb.setAttribute('aria-pressed',on); zb.textContent=on?'Zoom out':'Zoom in'; $('.planwrap',el).classList.toggle('zoom',on);};}
  draw();};

/* Locate: the legend is hidden; tap the spot on the plan, or answer from a list instead */
R.locate=(it,el)=>{it.btn='Check my answer'; const f=it.floor==='mine'?(S.floor&&PLANS[S.floor]?S.floor:'2'):it.floor; const P=PLANS[f], T=P.items.filter(x=>x[0]===it.kind); let pin=null, listSel=null;
  head(Object.assign({},it,{q:it.q.replace('{floor}',FLOORS[f].name)}),el);
  el.insertAdjacentHTML('beforeend',`<div class="hint2"><img src="img/guide2.webp" alt=""><p><b>The legend is hidden.</b> Tap the plan where you'd look. Zoom in if the symbols are small.</p></div>
    <div class="hztools"><button type="button" class="link pzoom" aria-pressed="false">Zoom in</button><span class="hzcount" aria-live="polite">${FLOORS[f].name}</span></div>
    <div class="hzscroll"><div class="planwrap loc">${planImg(f)}<span class="pmask" style="left:${P.legend[0]}%;top:${P.legend[1]}%;width:${P.legend[2]-P.legend[0]}%;height:${P.legend[3]-P.legend[1]}%">Legend hidden</span></div></div>
    <details class="hzlist"><summary>Prefer a list? Answer in words instead</summary><div class="opts" role="group" aria-label="Where would you look?">${it.list.map((o,k)=>`<button type="button" class="opt" data-li="${k}" aria-pressed="false"><span class="key">${k+1}</span><span class="ot">${o.t}</span></button>`).join('')}</div></details>`);
  const wrap=$('.planwrap',el), img=$('img',wrap);
  wrap.addEventListener('click',e=>{if(PL.res[PL.view]) return; const r=img.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width*100, y=(e.clientY-r.top)/r.height*100; if(x<0||y<0||x>100||y>100) return;
    pin={x,y,w:r.width,h:r.height}; listSel=null; $$('[data-li]',el).forEach(b=>b.setAttribute('aria-pressed','false'));
    let p=$('.ppin',wrap); if(!p){p=document.createElement('span'); p.className='ppin'; wrap.appendChild(p);} p.style.left=x+'%'; p.style.top=y+'%'; live('Spot marked. Press Check.'); PL.cur.ready=true; can(true);});
  $$('[data-li]',el).forEach(b=>b.onclick=()=>{if(PL.res[PL.view]) return; listSel=+b.dataset.li; pin=null; const p=$('.ppin',wrap); if(p) p.remove(); $$('[data-li]',el).forEach(x=>x.setAttribute('aria-pressed',x===b)); PL.cur.ready=true; can(true);});
  const zb=$('.pzoom',el); zb.onclick=()=>{const on=zb.getAttribute('aria-pressed')!=='true'; zb.setAttribute('aria-pressed',on); zb.textContent=on?'Zoom out':'Zoom in'; wrap.classList.toggle('zoom',on);};
  PL.cur.eval=()=>{let ok;
    if(pin){const R__=0; const R_=Math.max(0.055*pin.w,24); ok=T.some(([k,x,y])=>Math.hypot((x-pin.x)/100*pin.w,(y-pin.y)/100*pin.h)<=R_);}
    else {ok=!!it.list[listSel].ok; $$('[data-li]',el).forEach((b,k)=>{b.disabled=true; if(it.list[k].ok) b.classList.add('ok'); else if(k===listSel) b.classList.add('no');});}
    $('.pmask',wrap).remove(); T.forEach(([k,x,y])=>wrap.insertAdjacentHTML('beforeend',`<span class="pring" style="left:${x}%;top:${y}%" aria-hidden="true"></span>`)); const p=$('.ppin',wrap); if(p) p.classList.add(ok?'ok':'no');
    $$('[data-li]',el).forEach(b=>b.disabled=true);
    const right=it.list.find(o=>o.ok);
    return {ok,title:ok?'Found it!':'Not quite there',sub:ok?KIND[it.kind].n:`The rings show where to look`,body:`<p>${ok?'':`The rings on the plan show ${T.length>1?`all ${T.length}`:'where it is'}. `}${it.fb||KIND[it.kind].why}</p>${!ok&&!pin?`<p class="ans">In words: ${right.t}</p>`:''}`};};};

/* Retrieve in the real world: a field mission inside the lesson. Self-reported, never required. */
R.mission=(it,el)=>{el.innerHTML=`<p class="tag">${ic('pin',16,3)} Check it in the building</p><h2 class="qh">${it.title}</h2><p class="txt">${it.text}</p><div class="missions">${it.ids.map(id=>{const m=MISSIONS.find(x=>x.id===id), d=S.missions[id];
    return `<div class="mis ${d?'done':''}"><span class="icb">${ic(d?'check':m.i,22)}</span><div class="t"><b>${m.t}</b><p class="muted small">${typeof m.d==='function'?m.d():m.d}</p><div class="acts">${d?'<span class="pill ok">Done</span>':`<button type="button" class="btn sm sec" data-mi="${id}">I did it</button>`}</div></div></div>`;}).join('')}</div><p class="muted small">At your desk now? Try it before you move on. Not at ESQ today? It waits for you under More → Field missions.</p>`;
  $$('[data-mi]',el).forEach(b=>b.onclick=()=>{S.missions[b.dataset.mi]=DAY(); const bd=earn('field'); save(); kpiPush(); toast(bd?`${ic('pin',18)} Badge earned: ${bd.n}`:`${ic('check',18)} Mission done`); b.replaceWith(Object.assign(document.createElement('span'),{className:'pill ok',textContent:'Done'}));});};

/* ---------- Unit 1 lesson flows ---------- */
QIMG.faint=['img/faint.webp','One colleague calls for help on the phone with a hand on the shoulder of a seated participant, who holds their head and feels dizzy. Another colleague steps in to help. A first aid kit sits on a nearby table.'];
QIMG.firedoor=['img/fire-door.webp','Walking away, a colleague pushes the copy room door shut behind her, closing off a small fire in a recycling bin inside.'];
QIMG.firepull=['img/fire-pull.webp','On her way out, a colleague pulls the handle of a fire alarm pull station on the wall.'];
QIMG.firecall=['img/fire-call.webp','On the phone with a 911 dispatcher, a colleague points to the room on a wall floor plan where the fire is, while smoke seeps under a closed door down the hall.'];
QIMG.firestairs=['img/fire-stairs.webp','A colleague walks down an emergency stairwell, holding the handrail.'];
INTROIMG.mobility=['img/intro-mobility2.webp','A colleague pushes a teammate in a wheelchair past the stairwell door to the elevator lobby, marked with a wheelchair sign.'];
QIMG.escalator=['img/escalator-faster.webp','One colleague points toward the escalators as a way out while another looks on, unsure.'];
QIMG.smokestair=['img/smoke-stair2.webp','Smoke fills the window of a closed stairwell door. An arrow points down the hallway to another exit door.'];
QIMG.missing=['img/missing3.webp','A muster point sign on the LRT station platform, with a thought bubble wondering about a colleague still in the washroom.'];
QIMG.route3f=['img/route-3f.webp','Cutaway of a building: an alarm sounds in a top-floor meeting room, and a green arrow runs from the room down the hall, into the stairwell, out the ground floor exit and to the muster point sign outside.'];
delete INTROIMG.room;
QIMG.extinguisher=['img/extinguisher-q.webp','A small fire smoulders in a wastebasket next to a photocopier, with a fire extinguisher in a wall cabinet and an alarm station nearby.'];
QIMG.kitchfire=['img/kitchenette-fire.webp','Flames and thick smoke rise from a toaster in an empty office kitchenette. A fire extinguisher and a fire alarm are on the wall beside the open door.'];
QIMG.unwell=['img/unwell.webp','A participant sits on a stool looking unwell while a colleague stands nearby, concerned.'];
QIMG.deskrow=['img/deskrow-illustration.webp','A colleague at a desk in the middle of a long row studies a floor plan showing two escape routes, one at each end.'];
QIMG.mob1=['img/mob1.webp','A colleague on crutches talks with her manager in his office.'];
QIMG.thinking=['img/thinking.webp','A colleague at their desk pauses to think, surrounded by question marks.'];
QIMG.gear=['img/desk-find.webp','An empty desk with a computer, notebook and mug, surrounded by question marks.'];
QIMG.mob2=['img/mob2.webp','A Floor Warden in a yellow vest, holding a clipboard, introduces a colleague on crutches to the two coworkers who will help her.'];
QIMG.mob3=['img/mob3.webp','As the alarm sounds, a colleague on crutches walks with her two helpers toward the elevator lobby.'];
QIMG.mob4=['img/mob4.webp','In the elevator lobby, the colleague with crutches sits on a bench while her two helpers stay beside her, waiting for responders.'];
QIMG.mobq2=['img/mobq2.webp','A colleague on crutches wonders who to tell, standing near an open office door, with two coworkers nearby.'];
QIMG.mobq4=['img/mobq4.webp','Working late, a colleague with crutches and a knee brace is alone in the office as the alarm sounds, near the stairwell door.'];
QIMG.mobq1=['img/mobq1.webp','A colleague on crutches looks unsure as she talks with a coworker beside a calendar and the stairwell door.'];
QIMG.grab=['img/grab.webp','The alarm bell rings. A colleague, still on the phone, hurries away from the desk, grabbing a winter coat.'];
const MS=(m,img)=>{const s=MBY(m).steps.find(x=>x.img===img); return s?Object.assign({},s):null;};
const teachS=(src,k,n,of)=>({type:'teach',c:LEARN[src][k],vkey:src+'-'+k,n,of});
const bridgeS=(n,titles)=>({type:'bridge',nq:n,titles});
const BQ=id=>QB[id]?toItem(QB[id]):null;
const EVAC=["Grab keys, wallet and coat","Go to the nearest stairwell","Hold the push bar 15 seconds","Exit at the main floor","Meet at the upper LRT platform","Wait for the All Clear"];
const FIRE=["Leave the area and warn people nearby","Close the door behind you","Pull the nearest fire alarm","Call 911 with the address and the fire's location","Evacuate by the stairs"];
const L11=()=>[
 {type:'model',kicker:'Demonstrate',title:'Priya gets out: desk to All Clear',text:"Tuesday, 2:47 PM. Priya is on a call when the strobes flash. Watch what she does, and the cue behind each move.",
  steps:[{img:'grab',act:"Ends her call and grabs her keys, wallet, coat and good shoes.",cue:"At ESQ, an alarm means everyone leaves. Drills are random, so every alarm is real. She may be outside a while in Edmonton weather."},
   {img:'evac',act:"Heads to the nearest emergency stairwell, not the elevator or escalator, and closes the stairwell door behind her.",cue:"Elevators return to the main floor and stop. ESQ has 8 emergency stairwells."},
   {img:'pushbar',act:"The stairwell door beeps but stays shut. She keeps holding the push bar for 15 seconds.",cue:"The delay is built in. The beeping is normal."},
   {img:'levels',act:"Leaves at the main floor exit, not the concourse.",cue:"Shutters close the LRT entrance and the pedway during an alarm. If the exit is locked, she pulls the blue pull station."},
   {img:'outside',act:"Walks to the muster point: the upper platform of the Bay/Enterprise Square LRT station.",cue:"Standing by the doors would block people leaving and responders arriving. She uses the 103 Street entrance to the station."},
   {img:'quiet',act:"Waits for the All Clear sign and the PA announcement before going back in.",cue:"A quiet alarm doesn't mean it's safe. Floor Wardens wear red caps and vests. She tells one if someone may still be inside."}],
  more:LEARN.evac[1].x.concat(LEARN.evac[2].x)},
 {type:'fade',img:'alarm',q:"Your turn, with help. Finish Priya's route.",items:EVAC,given:[0,1],fb:"Desk to All Clear in six steps. Stairs only, main floor exit, upper LRT platform, then wait for the All Clear."},
 bridgeS(5,['Stairs, not elevators','Hold the bar 15 seconds','Main floor exit','Upper LRT platform','Wait for the All Clear']),
 {type:'story',alarm:1,simg:['img/escalator-story.webp','Two colleagues stop near the escalators and look up as a wall alarm sounds. One reaches toward the escalators.'],time:'Thursday · 10:20 AM',title:'A different morning',text:"Now it's you. You're with two colleagues near the escalators when the alarm sounds. Things don't go to plan."},
 MS('evac','escalator'),MS('evac','smokestair'),MS('evac','quiet'),MS('evac','missing'),
 {type:'order',img:'route3f',q:"New situation: you're in a 3rd-floor meeting room when the alarm sounds. Put your whole route in order, on your own.",items:EVAC,fb:"Same route from anywhere in ESQ. Smoke in your stairwell? Use another one or a crossover section."}];
const L12=()=>{const mine=S.floor&&PLANS[S.floor]?S.floor:'2', other=mine==='3'?'2':'3';
 const aedList=f=>[{t:FLOORS[f].aed,ok:1},...[...new Set(Object.values(FLOORS).map(x=>x.aed))].filter(a=>a!==FLOORS[f].aed).slice(0,2).map(t=>({t,ok:0}))];
 const steps=[
 {type:'explore',title:'Read the real plan',text:"This is the official emergency procedure plan posted on your floor. Tap each symbol to see where it is. Check another floor too."},
 MBY('plan').steps.find(s=>s.type==='pairs'),
 {type:'locate',floor:'mine',kind:'exit',q:"Plan for the {floor}. Tap any emergency stairwell.",list:[{t:"A red EXIT sign with an arrow, along the outside walls",ok:1},{t:"An orange striped bar beside a door",ok:0},{t:"The blue wheelchair sign in the middle of the floor",ok:0}],fb:"Red EXIT arrows mark the emergency stairwells, along the outside walls. Know at least two from your desk."},
 {type:'locate',floor:'mine',kind:'wheel',q:"Tap the mobility rescue location on the {floor}.",list:[{t:"The elevator lobby, near the centre of the floor (blue wheelchair sign)",ok:1},{t:"Inside the nearest stairwell",ok:0},{t:"Beside the main floor exit",ok:0}]}];
 if(PLANS[mine].items.some(x=>x[0]==='aed')) steps.push({type:'locate',floor:'mine',kind:'aed',q:"Tap an AED on the {floor}.",list:aedList(mine)});
 else if(PLANS[mine].items.some(x=>x[0]==='noexit')) steps.push({type:'locate',floor:'mine',kind:'noexit',q:"Tap the spot on the {floor} that is NOT a way out during an alarm.",list:[{t:"The red NO EXIT sign: a roll shutter that closes during an alarm",ok:1},{t:"A red EXIT arrow",ok:0},{t:"The blue wheelchair sign",ok:0}]});
 steps.push(MS('plan','deskrow'));
 steps.push({type:'story',simg:['img/unwell.webp','A participant sits on a stool looking unwell while a colleague stands nearby, concerned.'],time:'Wednesday · 1:00 PM',title:'Another floor',text:`You're running a workshop on the ${FLOORS[other].name}, a floor you don't know well. A participant feels unwell.`},
  {type:'locate',floor:other,kind:'aed',q:"Tap the AED on the {floor} plan.",list:aedList(other),fb:`The red heart with a lightning bolt marks the AED. On the ${FLOORS[other].name}: ${FLOORS[other].aed}. Call 911 first, then ESQ Security, who will bring an AED.`},
  {type:'choice',img:'faint',q:"The participant says they feel faint. Who do you call first?",opts:shuffle([{t:"911, then ESQ Security at 780-428-1541",ok:1,fb:"911 gets help moving. Security brings first aid and the AED, holds an elevator and guides paramedics to your room.",c:"Paramedics are on the way, and Security arrives with the AED and knows exactly which room to bring them to."},{t:"Security first, and let them decide whether to call 911",ok:0,fb:"If someone may need medical help, call 911 first. Then call Security.",c:"Minutes pass before anyone calls for an ambulance."},{t:"Go back to your own floor to get the AED you know",ok:0,fb:"Stay with the person. The AED on this floor is closer, and Security will bring one.",c:"The participant is left alone, and you lose time on a floor you don't know."}])},
  {type:'mission',title:'Now find them for real',text:"A plan only helps if you've walked it. These take a couple of minutes from your desk.",ids:['stairs','aed']});
 return steps.filter((s,i,a)=>s&&a.indexOf(s)===i);};
const L13=()=>[
 {type:'model',kicker:'Demonstrate',title:'Jae finds a fire',text:"Monday, 3:05 PM. Walking past the copy room, Jae sees smoke and a small flame coming from a recycling bin. Here's the approved response.",
  steps:[{img:'firebin',act:"Leaves the area and warns people nearby.",cue:"Never risk your life for a fire. If in doubt, get out."},
   {img:'firedoor',act:"Closes the door behind her.",cue:"A closed door holds back fire and smoke."},
   {img:'firepull',act:"Pulls the nearest fire alarm.",cue:"The alarm gets everyone moving. It also calls the fire department automatically, 24/7."},
   {img:'firecall',act:"Calls 911 with the address, 10230 Jasper Avenue, and where the fire is.",cue:"911 gets the fire department to the right spot."},
   {img:'firestairs',act:"Evacuates by the stairs.",cue:"Same route as any alarm: stairs, main floor exit, upper LRT platform."}],
  note:"An extinguisher? Only if the fire is small, you're trained, it's safe, and you have a clear way out."},
 {type:'compare',title:'Finding a fire is not the same as hearing the alarm',
  a:{k:'You discover a fire',img:'firebin',h:'You may be the only one who knows',pts:['Leave and warn people nearby','Close the door','Pull the alarm and call 911','Evacuate by the stairs']},
  b:{k:'You hear the alarm',img:'alarm',h:'The building is already warning everyone',pts:['Grab keys, wallet and coat','Go to the nearest stairwell','Exit at the main floor','Wait at the muster point for the All Clear']},
  cue:"Did you see the fire, or did the building tell you? If you found it, you raise the alarm. If the alarm is already sounding, you get out."},
 {type:'sort',q:"Found a fire, or heard the alarm? Sort each situation by your first move.",buckets:["I found a fire: alert, alarm, 911","The alarm is sounding: evacuate"],cards:[
   {t:"Smoke and a small flame are coming from a recycling bin in the copy room.",bucket:"I found a fire: alert, alarm, 911",fb:"You're the first to know. Leave, close the door, pull the alarm, call 911."},
   {t:"Strobes flash and a bell rings while you're on a call.",bucket:"The alarm is sounding: evacuate",fb:"Everyone leaves. End the call, grab your keys, wallet and coat, and take the stairs."},
   {t:"A wastebasket fire starts spreading while you're nearby.",bucket:"I found a fire: alert, alarm, 911",fb:"Get clear, close the door, pull the fire alarm, call 911."},
   {t:"The alarm sounds in the middle of your workshop.",bucket:"The alarm is sounding: evacuate",fb:"Point everyone to the nearest stairwell and leave together."},
   {t:"The alarm goes quiet after a minute, and someone says it's probably a drill.",bucket:"The alarm is sounding: evacuate",fb:"Drills are random. Treat every alarm as real and wait outside for the All Clear."}]},
 {type:'fade',img:'firebin',q:"Your turn, with help. Finish Jae's response.",items:FIRE,given:[0],fb:"Leave and warn, close the door, pull the alarm, call 911, evacuate."},
 teachS('fire',0,1,2),teachS('fire',2,2,2),
 bridgeS(4,['Found it? Alarm and 911','Heard it? Get out','Extinguisher only if trained and safe']),
 MS('fire','extinguisher'),MS('fire','gear'),MS('fire','helpstation'),
 {type:'order',img:'kitchfire',q:"New situation, on your own: you smell smoke and see flames in the kitchenette. Put your response in order.",items:FIRE,fb:"Same five moves wherever you find a fire in ESQ."}];
const L14=()=>[
 {type:'model',kicker:'Watch how it works',title:"Priya's plan, before and during an alarm",text:"Priya sprained an ankle and will be on crutches for six weeks. Here's what happens, and who does what.",
  steps:[{img:'mob1',act:"Priya tells her manager, privately, that she'll need help on the stairs for a while.",cue:"Anyone who needs help on stairs counts, permanent or temporary. It's up to her to speak up. No one asks in a group."},
   {img:'mob2',act:"The Floor Warden assigns her two helpers, and Security is told.",cue:"Security can then brief the fire department when it arrives."},
   {img:'mob3',act:"The alarm sounds. Her two helpers go to her, and together they go to the elevator lobby on her floor.",cue:"The elevator lobby, marked with the blue wheelchair sign, is the designated area on every floor. Elevators aren't used to evacuate."},
   {img:'mob4',act:"They wait there until emergency responders arrive or Security gives the All Clear.",cue:"Responders come to the elevator lobby. Helpers never take her down the stairs."}]},
 bridgeS(4,['Tell your manager or Floor Warden','Two helpers','Elevator lobby, then wait']),
 Object.assign({},MBY('mobility').steps.filter(s=>s.type==='choice')[0],{img:'mobq1'}), Object.assign({},MBY('mobility').steps.filter(s=>s.type==='choice')[1],{img:'mobq2'}),
 Object.assign(BQ('mobility-f01')||{type:'story',time:'',title:'',text:''},{tag:'Mini story · your choices change what happens'}),
 Object.assign(MS('mobility','alone')||{},{img:''})];
LBY('1-1').flow=L11; LBY('1-2').flow=L12; LBY('1-3').flow=L13; LBY('1-4').flow=L14;
LBY('1-4').bank=[];

/* What happens next: the consequence of each choice (shown before the reason). Keyed by option text. */
const CONSEQ={
 "Take the escalators together":"Escalators aren't an evacuation route. You'd head away from the protected stairwells and lose time turning back.",
 "Take the nearest emergency stairwell, and take your colleague with you":"Within seconds you're both in a stairwell built for this, and you close the door behind you.",
 "Wait for an elevator":"It never comes. During an alarm the elevators return to the main floor and stop, so you lose minutes waiting.",
 "Use another stairwell or a crossover section, and close the door behind you":"You reach clear air in another stairwell, and the closed door keeps the smoke from following you.",
 "Cover your mouth and keep going down, since it's the shortest way":"The smoke gets thicker as you go and can overcome you in a few breaths. You'd have to turn back with less time and less air.",
 "Take the elevator instead":"It won't come. During an alarm the elevators return to the main floor and stop.",
 "Go back in once it's quiet":"You'd be back inside before staff have checked and reset the building. If the danger isn't over, you're now inside it.",
 "Wait for the All Clear signs outside and the public address (PA) announcement":"You go back in only once Security or a Floor Warden confirms it's safe.",
 "Go back when the fire trucks leave":"Trucks leaving doesn't mean the building is reset. You could walk back in before the All Clear.",
 "Tell your Floor Warden or Security right away":"Responders now know someone may be inside and where to look, and they go in with the right equipment.",
 "Go back in to find them":"You'd be heading back into danger without protection, and responders could end up searching for two people instead of one.",
 "Only if you're trained, it's safe, and you have a clear way out":"Either you put out a small fire safely, or you leave, close the door and pull the alarm. Either way, you're safe.",
 "Yes, always try to put it out first":"If the fire is bigger than it looks, or you're not trained, it can grow while you fight it and cut off your way out.",
 "No, only Security may use extinguishers":"A small fire you're trained to handle keeps growing while you wait for someone else.",
 "Connects you straight to ESQ Security":"You reach the Security desk directly, even without a phone.",
 "Sounds the fire alarm":"You'd be looking for the wrong thing in a hurry. The red pull station sounds the alarm; the help station reaches Security.",
 "Calls 911 automatically":"You'd wait for help that hasn't been called. The help station connects you to Security, who can call for help.",
 "At least two stairwells, in case one is blocked":"If smoke blocks your usual stairwell, you already know where to go instead.",
 "Just the closest one":"If that stairwell is blocked, you'd be working out another way out in the moment, with no plan.",
 "No. Anyone who needs help getting down the stairs counts, even for a short time":"Priya tells her manager, gets two helpers, and has a plan in place before any alarm.",
 "Yes. The plan is only for permanent disabilities":"Priya has no helpers. When the alarm sounds, she's left to manage the stairs on crutches, or wait with no one knowing she's there.",
 "Only if she uses a wheelchair":"Priya skips the plan, and when the alarm sounds no one knows she needs help.",
 "Her manager or the Floor Warden":"The Floor Warden assigns two helpers, and Security can brief the fire department when it arrives.",
 "No one. Security checks every floor during an alarm":"Nobody plans for her. In an alarm, responders don't know someone on your floor is waiting for help.",
 "The fire department, by calling 911 now":"911 is for emergencies, not planning. Priya still has no helpers on her floor.",
 "Go to the elevator lobby, call 911 with your floor and location, and wait":"Responders know exactly where you are, and that's where they come.",
 "Wait at your desk":"Responders look in the elevator lobby, so it takes them longer to find you.",
 "Try the stairs slowly, holding the rail":"On an injured knee, in a stairwell, you risk a fall with no one around to help.",
 "Tell them firmly to calm down":"Confronting an agitated person can make them angrier, and they're still between you and the door.",
 "Call Security at 780-428-1541 and use the safety phrase":"It sounds like an everyday request, so the visitor stays calm, and an officer is on the way right away.",
 "Message your team chat for help":"Your message may sit unread for minutes, and no one has called Security yet.",
 "Stand your ground and reason with them":"Staying close keeps you within reach of someone who is escalating.",
 "Get to a safe place, warn others, lock the door behind you, then call 911 and Security":"You put distance and a locked door between you, others are warned, and help is on its way."};
