/* ===== Units 2–5: lessons rebuilt on the instructional patterns ===== */
/* Observe: a short modelled conversation (not a question) */
R.convo=(it,el)=>{el.innerHTML=`<p class="tag">${ic('help',16,3)} ${it.kicker||'Watch the conversation'}</p><h2 class="qh">${it.title}</h2>${it.text?`<p class="txt">${it.text}</p>`:''}
  <div class="convo">${it.lines.map(l=>`<div class="cl${l.me?' me':''}"><p class="who">${l.who}</p><p class="say">${l.say}</p>${l.note?`<p class="cn"><b>Notice:</b> ${l.note}</p>`:''}</div>`).join('')}</div>${it.cue?`<p class="phrase"><b>What made it work:</b> ${it.cue}</p>`:''}`;};
NONQ.push('convo');

/* Consequences for the curated unit 2–5 choices, by module and step index */
const CQM={
 room:{2:{"Report both to ClikFix (1-866-254-5349) with the room number":"Facilities removes the banner and the heater before anyone arrives, and the sprinklers can do their job.",
   "Leave a note on the door for whoever booked the room tomorrow":"Whoever finds it tomorrow may not know who to call. The banner and heater are still there when 30 people walk in.",
   "Tell the ESQ Security desk on your way out":"Security takes the message, but building repairs go through ClikFix, so it may not reach the right people before the session."},
  3:{"In the corridor beside the exit, out of everyone's way":"If the alarm sounds, the cart is in the route people need to get out.",
   "Inside the room, along a wall away from the door":"Coffee is ready, and the way out stays clear.",
   "On the stairwell landing":"The stairwell is an escape route. In an alarm, people would have to squeeze past it on the stairs."},
  4:{"Reset it and stagger the two":"The cause hasn't been checked, so the problem comes back, maybe in the middle of your session.",
   "Stop using the device that tripped it and call ClikFix":"Someone qualified finds out why it tripped, and the circuit is safe for your session.",
   "Call Security":"Security doesn't repair circuits. You lose time before the problem reaches ClikFix."},
  5:{"Point out the nearest emergency stairwells":"If the alarm sounds, 30 people already know which way to go.",
   "Leave it to the Floor Warden":"The Floor Warden may not be in your room. Visitors who don't know ESQ head for the elevators.",
   "Read the emergency booklet aloud":"It takes minutes and people tune out. They still don't know which door to use."},
  6:{"Report it to Security":"Security deals with it. ESQ is non-smoking, and careless smoking is a major cause of fires.",
   "Ask them to finish it outside, and leave it at that":"It may happen again tomorrow, and no one who can act on it knows."}},
 notfire:{1:{"Evacuate everyone right away":"You lead 20 people into dim stairwells with no alarm and no reason to leave. If you need to go, the alarm will sound.",
   "Turn off equipment, keep the group in place, and wait for building management":"The emergency lights hold, equipment is protected when power comes back, and you get clear instructions.",
   "Take the group down in the elevator":"With the power out, the elevator could stop between floors with your group inside."},
  2:{"Send everyone home before it hits":"People end up outside or on the roads just as the storm arrives.",
   "Move away from the windows and take cover in a stairwell or under sturdy furniture if glass may break":"If the glass breaks, no one is near it, and heads and necks are protected.",
   "Stay put and watch the conditions":"Watching from the window puts you right where breaking glass would land."},
  3:{"Leave to get home before it gets worse":"You walk out into the hazardous release you were told to shelter from.",
   "Stay in, close doors and windows, keep calls short, and watch U of A updates":"Outside air stays out, phone lines stay free, and you'll know when it's safe."},
  4:{"Call ClikFix with your name and location, and if it's safe, unplug nearby equipment and move things away":"Facilities stops the leak, and nothing electrical is sitting in the water.",
   "Mop it up and carry on":"The leak keeps going under the sink, and the water can reach cords and outlets.",
   "Call 911":"No one is in danger, so 911 isn't the right line. The water keeps spreading while you wait."},
  5:{"Stay put or arrange to stay nearby, and keep calls to family short":"You stay safe and warm, and phone lines stay free for emergencies.",
   "Drive home quickly before it gets worse":"You're on icy roads in the dark, the very risk the procedure is meant to avoid."}},
 medical:{2:{"Security has to approve the ambulance":"No approval is needed. Believing it could make someone wait before calling 911.",
   "They bring first aid and an AED, hold an elevator, and guide paramedics to you":"Paramedics come straight to your floor instead of searching the building.",
   "So the incident gets logged":"Logging can wait. Calling Security gets first aid, an AED and paramedics to your colleague faster."},
  4:{"Call 911, keep people away, then call Security":"Paramedics are on the way, no one else breathes the fumes, and Security secures the area.",
   "Open the windows and mop it up":"You stay in the fumes, and so does everyone helping you."}},
 coffee:{3:{"Call you back to confirm":"A callback could tip off the visitor. Security acts on the phrase alone.",
   "Send an officer right away and put other staff on standby":"An officer is on the way within moments, and backup is ready.",
   "Transfer your call to 911":"Security handles it and sends an officer. If it turns threatening, you call 911 yourself."}},
 threats:{3:{"Open it to see whose it is":"If it's dangerous, you've just disturbed it, with your hands on it.",
   "Don't touch it. Tell Security where it is, what it looks like and why it seems off":"Security can assess it safely and bring in police, and no one disturbs it.",
   "Move it out of the way":"Moving it could set it off, and responders no longer know where it was."}},
 alerts:{1:{"The MyUAlberta app, email and X":"You hear about the North Campus emergency wherever you are.",
   "The ESQ public address (PA) system and Alertus":"Those are for ESQ incidents only. You'd hear nothing about North Campus."},
  2:{"Updates by email or on the U of A website":"You know it's really over, and whether there's anything to do next.",
   "A call from your manager":"That call may never come, and you'd be acting on old information.",
   "The Alertus icon turns green":"The green check only means Alertus is connected. It says nothing about the emergency."},
  3:{"There's an active emergency":"You'd react to an emergency that isn't happening, while real alerts still can't reach you.",
   "Your computer can't reach the Alertus server. Log an IST ticket":"IST fixes the connection, and the next alert reaches your screen.",
   "Alertus is updating. It will clear on its own":"It may not. Until it's fixed, an emergency alert won't reach your screen."},
  4:{"No need to report it":"The shelf stays as it is, and next time the box may land on someone.",
   "Submit a U of A incident report as a near miss, and tell your supervisor":"The shelf gets fixed before anyone gets hurt."},
  5:{"Call or text ETS Transit Watch: 780-442-4900":"ETS, who are responsible for the LRT, send help to the platform.",
   "Call ESQ Security":"Security's authority stops at the doors. They'd have to pass it on, so help takes longer."}},
 late:{2:{"Just your name":"Security knows you're in the building, but not where, how to reach you, or when to check on you.",
   "Your name, exact location, phone number and when you'll leave":"If something happens, Security knows exactly where you are and when to check on you."},
  3:{"Head home":"Responders may search the building for you, putting themselves at risk.",
   "Tell Security you're out":"Responders know you're safe and don't go looking for you."},
  4:{"Ask Security for a Safe Walk":"Someone walks with you to your car. It's free within two blocks.",
   "Call 911 for an escort":"911 is for emergencies and doesn't provide escorts. You'd still be walking alone."},
  5:{"Ask them what they're looking for":"You're now face to face, alone and after hours, with someone who may be up to something.",
   "Stay at a distance and call Security at 780-428-1541":"An officer checks it out, and you stay out of reach."},
  6:{"Call Security, tell them they need to leave because they're trespassing, then call 911 and stay on the line":"Security and police are on the way, and the person knows they have to leave.",
   "Physically guide them out":"Touching them can escalate things quickly, and you could get hurt."},
  7:{"Hang up and block the number":"The threat is still out there, and no one who can act on it knows.",
   "Tell Security right away":"Security can assess the threat, keep watch, and bring in police if needed."}},
 downtown:{1:{"Call ESQ Security and let them handle it":"Minutes pass before anyone calls 911, and with an overdose, minutes matter.",
   "Call 911, and get a naloxone kit from the ESQ Security desk or ask someone to":"Paramedics are on the way, and naloxone can help while you wait.",
   "Keep walking. It's outside the building":"Someone who is barely breathing may not survive without help."},
  2:{"Call 211 and press 3 for Crisis Diversion":"A crisis team comes to help them, and 911 stays free for emergencies.",
   "Call 911":"They're not in danger, so 911 isn't the right line. Crisis Diversion is built for this.",
   "Ask them firmly to move along":"Someone confused may not understand you, and they still don't get help."},
  3:{"Stop and explain you don't carry cash, then keep walking":"Stopping keeps you close to someone who is already blocking your way.",
   "Move to a safe place and call police non-emergency: 780-423-4567":"You're out of reach, and police can follow up."},
  4:{"Ask them for their ID":"You're confronting a stranger alone, after hours, with no backup.",
   "Don't confront them. Call Security and describe them":"Security finds and checks on them, and you stay safe."},
  5:{"Call police non-emergency: 780-423-4567 (or #377 from a cell)":"Police can respond, and 911 stays free for emergencies.",
   "Call 911":"No one is in danger, so 911 isn't the right line. Police non-emergency handles this.",
   "Ask them to leave":"You'd be confronting someone alone, outside Security's authority."},
  6:{"Submit a U of A incident report":"The U of A knows what happened and can follow up with you.",
   "Nothing. The police have it":"The U of A never hears about it, so no one follows up with you or watches for a pattern near the building."}}};
(function(){const strip=s=>String(s).replace(/<[^>]+>/g,'').trim();
  for(const [m,byI] of Object.entries(CQM)){const mod=MBY(m); if(!mod) continue;
    for(const [i,map] of Object.entries(byI)){const s=mod.steps[+i]; if(!s||!s.opts) continue; s.opts.forEach(o=>{const c=map[strip(o.t)]; if(c&&!o.c) o.c=c;});}}})();

QIMG.coffeecall=['img/coffee-call.webp','At her desk, a colleague calmly calls on the desk phone while a visitor standing nearby shouts and gestures at her.'];
QIMG.coffeesay=['img/coffee-say.webp','Seated at her desk, a colleague speaks calmly into the phone, beside a floor plan with her suite highlighted, while a visitor nearby keeps shouting.'];
QIMG.coffeedetail=['img/coffee-detail.webp','Still on the phone at her desk, a colleague stays calm and keeps the conversation casual while the shouting visitor stands between her desk and the open office door.'];
QIMG.coffeelock=['img/coffee-lock.webp','A colleague has locked herself in an office and calls for help, while in the hallway outside the visitor shouts at the locked door and another colleague steers coworkers away down the corridor.'];
STORYIMG.coffee=['img/visitor-story.webp','In an office, an agitated visitor shouts and gestures at a colleague standing by her desk. The visitor is between her and the office door.'];
QIMG.visitor=STORYIMG.coffee;
QIMG.buildcall=['img/coffee-build.webp','Seated at her desk, a colleague calls on the desk phone while an agitated visitor shouts between her and the office door.'];
QIMG.sechears=['img/security-hears.webp','A colleague at her desk calmly talks on the desk phone while working on her laptop.'];
STORYIMG.room=['img/room-story.webp','A meeting room set up with rows of chairs facing a projector screen, a coffee urn on a side table, a fire extinguisher on the wall and the door to the hallway propped open under an exit sign.'];
QIMG.lunchroom=['img/lunchroom.webp','In the lunchroom, one colleague calls 911 while another helps a colleague who has slumped over the table.'];
QIMG.lunchroom2=['img/lunchroom2.webp','The caller gives the location details while writing them on a notepad; a colleague stays beside the unwell person.'];
QIMG.lunchroom3=['img/lunchroom3.webp','The caller listens to the 911 dispatcher while another colleague stays beside the unwell person.'];
QIMG.lunchroom4=['img/lunchroom4.webp','After the 911 call, a colleague calls ESQ Security while another remains with the unwell person.'];
QIMG.report5=['img/report5.webp','After the emergency, a colleague completes an incident report on a clipboard with coworkers nearby.'];
QIMG.kitchenette=['img/kitchenette.webp','In the kitchenette, a colleague has slumped over the table while a coworker calls for help.'];
QIMG.ambulance=['img/ambulance2.webp','An ambulance rests on the roadway outside the building as a paramedic walks toward the entrance.'];
QIMG.aed=['img/aed2.webp','An older colleague shows an AED mounted inside a green wall cabinet beside the elevators.'];
QIMG.spill=['img/spill2.webp','A chemical container has spilled onto the tiled floor; one colleague feels dizzy while another calls 911 and keeps away.'];
QIMG.entrance=['img/entrance.webp','Near the main entrance, a visitor lies on the tiled floor while a colleague calls 911 and another signals for help.'];
QIMG.entrance911=['img/entrance911.webp','A colleague gives the entrance location to the 911 dispatcher while another staff member keeps the doorway clear.'];
QIMG.callsec=['img/callsec.webp','A colleague makes a calm phone call while seated, next to five blank answer tiles.'];
/* helpers */
const MI=(m,i)=>{const s=MBY(m)&&MBY(m).steps[i]; return s?Object.assign({},s):null;};
const CH=o=>Object.assign({type:'choice'},o,{opts:shuffle(o.opts)});
const QF=(id,given,extra)=>{const q=QB[id]; if(!q||!q.order) return null; return Object.assign({type:'fade',q:escR(q.q).replace(/\s*One step doesn(?:'|&#39;|&#x27;|’)t belong\.?/,''),items:q.order.steps.map(escR),given,fb:escR(q.order.fb||'')},extra||{});};
const UST=id=>{const st=ULES[id].story; return {type:'story',time:st.time,title:st.title,text:st.text};};
const MSN=(ids,text)=>({type:'mission',title:'Now check it for real',text:text||'A couple of minutes, from your desk.',ids});

/* ---------- Unit 2 · At your desk ---------- */
const L21=()=>[ // Compare → Explain → Transfer
 MI('room',0),
 {type:'compare',title:'Fix it now, or report it?',
  a:{k:'You can fix it safely, right now',img:'room-0',h:'Fix it',pts:['Close a stairwell door that has been wedged open','Restack boxes well below a sprinkler','Move a cart off the stairwell landing','Clear the path to an extinguisher']},
  b:{k:"You can't, or it isn't yours to touch",img:'room-2',h:'Report it',pts:['A banner tied to sprinkler pipes: ClikFix','A space heater or a tripped breaker: ClikFix','An exit light that is out: ClikFix, 1-866-254-5349','Someone smoking inside: Security']},
  cue:"Can you fix it safely, right now? Then fix it. If not, or it isn't yours to touch, report it before you leave, with the room number."},
 teachS('room',1,1,2),teachS('room',2,2,2),
 MI('room',1),
 MI('room',2),MI('room',3),MI('room',4),MI('room',5),MI('room',6),
 {type:'story',time:'New place',title:'Your morning walk',text:"Same habits, different spot. You walk past the stairwell on your floor on the way to your desk."},
 BQ('hazards-f02'),BQ('hazards-07'),
 MSN(['cords'])];

const L22=()=>[ // Problem → Model → Solve
 UST('u-control'),
 teachS('u-control',0,1,2),teachS('u-control',1,2,2),
 {type:'model',kicker:'Watch an expert weigh the options',title:'Three fixes for the printer cord',text:"Your team suggests three fixes. Here's how an expert sizes up each one against the hierarchy of controls.",
  steps:[{act:'Move the printer so no cord crosses the walkway.',cue:"Elimination. The hazard is gone, so no one has to remember anything. This is the strongest fix."},
   {act:'Cover the cord with a rubber cord protector strip.',cue:"Engineering. It separates feet from the cord, but the cord is still there. A good backup if the printer can't move."},
   {act:'Put up a bright "Watch your step" sign.',cue:"Administrative. It relies on people noticing and remembering. Two people have already tripped, so a sign alone isn't enough."},
   {act:'Pick the highest one you can, then reassess.',cue:"Walk the route again with the fix in place. Is the walkway clear now? Then the risk is acceptable."}]},
 BQ('hazmgmt-13'),
 ...workedSteps('u-control'),
 {type:'story',time:'New case',title:'The top shelf',text:"A box slid off the top shelf of a tall storage cabinet and landed where a colleague had been standing a second earlier. Nobody was hurt. Your turn to be the expert."},
 BQ('hazmgmt-f01'),BQ('hazmgmt-07'),BQ('hazmgmt-10')];

const L23=()=>[ // Compare → Explain → Transfer
 teachS('hidden',0,1,2),
 {type:'compare',title:'One you can see, one you can\'t',
  a:{k:'A hazard you can see',h:'A cord across the walkway',pts:['Identify: someone could trip','Assess: likely, and a fall could hurt','Control: reroute it, then check it worked']},
  b:{k:"A hazard you can't see",h:'Three late nights, then heavy tables at 7 AM',pts:['Identify: fatigue makes mistakes and injuries more likely','Assess: heavy lifting on very little sleep','Control: tell your supervisor so plans can change']},
  cue:"Fatigue, stress, working alone and bullying don't show up on a walk-through, but they hurt people too. Run them through the same cycle: identify, assess, control."},
 BQ('psych-01'),BQ('hazmgmt-34'),BQ('psych-44'),
 teachS('hidden',1,2,2),
 {type:'compare',title:'Contractors: hazards travel both ways',
  a:{k:'Their work affects you',h:"A contractor's ladder narrows your route",pts:['Looks unsafe? Tell your supervisor','Respect their work area','Attend their site orientation if asked']},
  b:{k:'Your work affects them',h:'Your workshop runs beside their work area',pts:['Share your hazards with them too','Crowds, carts and timing all count','Hiring them yourself? Check prequalification first']},
  cue:"Whoever spots the overlap says so. Contractor hazards go through your supervisor, and you share yours with them."},
 BQ('hazmgmt-30'),BQ('hazmgmt-31'),BQ('hazmgmt-32')];

const L24=()=>[ // conditional decision modelling
 MI('notfire',0),
 {type:'model',kicker:'If this happens, do this',title:"It's not a fire. What now?",text:"Each event has its own first move. Watch for the cue that tells you which one you're in.",
  steps:[{act:'<b>Power cut:</b> turn off equipment, keep people where they are, and wait for building instructions.',cue:"Emergency and exit lights run on a generator for up to 24 hours. If you need to leave, the alarm will sound."},
   {act:'<b>Severe weather:</b> move away from windows. If glass may break, take cover in a stairwell or under sturdy furniture.',cue:"Report it to Security and follow building staff. Protect your head and neck."},
   {act:'<b>Shelter in place:</b> stay inside, close doors and windows, and follow U of A updates.',cue:"The danger is outside, so leaving puts you in it. Keep calls short."},
   {act:'<b>Water leak:</b> call ClikFix (1-866-254-5349) with your name and location. If it\'s safe, power down nearby equipment.',cue:"Water and electricity together are the danger. Move belongings away and follow building staff."},
   {act:'<b>Dangerous roads:</b> plan to stay put or arrange somewhere nearby.',cue:"Driving in it is the bigger risk. Keep calls to family short."}]},
 MI('notfire',1),BQ('notfire-f01'),
 MI('notfire',2),MI('notfire',3),MI('notfire',4),MI('notfire',5),
 {type:'story',time:'New situation',title:'A drip in the meeting room',text:"Halfway through a session, you notice water dripping from the ceiling."},
 BQ('notfire-07'),BQ('notfire-04')];

/* ---------- Unit 3 · When something happens ---------- */
const L31=()=>[ // Demonstrate → Guide → Apply
 {type:'model',kicker:'Demonstrate',title:'Sam is first on scene',text:"Wednesday, 12:10 PM. In the staff lunchroom, a colleague slumps over and doesn't respond. Sam is the first one there. Watch the order.",
  steps:[{img:'lunchroom',act:'Calls 911 and asks for an ambulance.',cue:"911 first. It gets the ambulance moving."},
   {img:'lunchroom2',act:'Gives the address, 10230 Jasper Avenue (between 102 and 103 Streets), plus name, phone, unit and exact location.',cue:"Paramedics need the building and the exact spot inside it."},
   {img:'lunchroom3',act:'Stays on the line until the dispatcher hangs up.',cue:"Don't put 911 on hold to call someone else. Finish that call first."},
   {img:'lunchroom4',act:'Then calls ESQ Security at 780-428-1541: an ambulance is coming, and here is exactly where.',cue:"Security brings first aid and an AED, holds an elevator, and meets paramedics at the street."},
   {img:'report5',act:'Once things are stable, tells the supervisor and submits a U of A incident report.',cue:"Reporting comes last, once help is on the way."}]},
 QF('medical-f01',[0,1],{img:'kitchenette'}),
 bridgeS(3,['911 first, with the address','Stay on the line','Then Security: first aid, AED, elevator']),
 Object.assign(MI('medical',0),{simg:['img/kitchenette.webp','In the kitchenette, a colleague has slumped over the table while a coworker calls for help.']}),MI('medical',2),MI('medical',3),MI('medical',4),
 {type:'story',simg:['img/entrance.webp','Near the main entrance, a visitor lies on the floor, not responding, while a colleague calls 911.'],time:'New situation',title:'At the main entrance',text:"A visitor collapses near the main entrance. A colleague is already on the phone with 911."},
 Object.assign(BQ('medical-05')||{},{img:'entrance'}),Object.assign(BQ('medical-02')||{},{img:'entrance911'}),
 MSN(['aed'])];

const L32=()=>[ // situation demonstration + branch
 {type:'model',kicker:'Demonstrate',title:'Ana asks for a coffee',text:"A visitor at the desk in Ana's suite is getting louder and won't sit down. Ana stays calm and picks up the phone.",
  steps:[{img:'coffeecall',act:'Calls ESQ Security at 780-428-1541.',cue:"Saying \"I'm calling security\" out loud could make things worse."},
   {img:'coffeesay',act:'Says, "Can you bring me a coffee?" and then her suite.',cue:"It sounds like an everyday request. Security knows it means: send someone now."},
   {img:'coffeedetail',act:'Adds more detail only if she can do it without raising suspicion.',cue:"The phrase and the suite are enough. An officer comes right away, and others are put on standby."},
   {img:'coffeelock',act:"If the visitor turns threatening, she doesn't confront them. She gets to a safe place, warns others, locks the door, then calls 911 and Security.",cue:"Distance and a locked door come first."}]},
 Object.assign(MI('coffee',0)||{},{simg:STORYIMG.coffee}),MI('coffee',1),Object.assign(MI('coffee',2)||{},{img:'buildcall'}),MI('coffee',3),MI('coffee',4),
 {type:'compare',title:'Two reasons to get out',
  a:{k:'Fire alarm',img:'alarm',h:'Get out, with your things',pts:['Grab keys, wallet and coat','Nearest stairwell, main floor exit','Wait at the muster point']},
  b:{k:'Possible gunfire',h:'Get out, hide, fight only as a last resort',pts:["Leave your things. Warn others, but don't wait",'Can\'t get out? Lock, block, lights off, silent','Once safe: 911, then Protective Services, 780-492-5050']},
  cue:"Both start with getting out. In a fire you take your coat to the muster point. With a threat you leave everything and get away from the sound."},
 MI('coffee',5),
 Object.assign(BQ('security-f01')||{type:'story',time:'',title:'',text:''},{tag:'Mini story · your choices change what happens'}),
 BQ('security-07')];

const L33=()=>[ // Compare → Explain → Transfer
 MI('threats',0),
 {type:'compare',title:'A caller or a package?',
  a:{k:'A threat by phone',h:'Keep them talking',pts:["Stay calm and don't interrupt",'Ask when, where, what it looks like and who they are',"Don't hang up. From another phone: 911, then Security"]},
  b:{k:'A suspicious package',img:'package',h:"Don't touch it",pts:["Don't open or move it",'Tell Security where it is, what it looks like and why it seems off','Then call police non-emergency: 780-423-4567']},
  cue:"A caller is a source of information, so you gather it. A package is a source of danger, so you leave it alone and report it."},
 MI('threats',1),MI('threats',2),MI('threats',3),
 BQ('threats-f01'),BQ('threats-07'),
 {type:'story',time:'Mixed day',title:'Who do you call first?',text:"Calls, packages, collapses and leaks. Sort a mixed set, the way they'd really arrive."},
 BQ('mix-f01')];

const L34=()=>[ // guided software walkthrough
 {type:'model',kicker:'Walk through it',title:'Where alerts reach you',text:"U of A Protective Services sends emergency alerts several ways. Here's which ones reach you, and where.",
  steps:[{act:'At ESQ, on your U of A computer: a full-screen Alertus message.',cue:"Alertus and the PA system are used only for incidents that affect ESQ."},
   {act:"In the building: a spoken message on the public address (PA) system.",cue:"PA is the building's speaker system."},
   {act:'Anywhere: the MyUAlberta app, your U of A email, the U of A website and X.',cue:"These cover every campus. Install the app so alerts reach you away from ESQ."},
   {act:'Check the Alertus icon at the bottom right of your screen. A green check means it works.',cue:"A red X often means you're on Wi-Fi or the wrong VPN setting. Log an IST ticket."},
   {act:"When it's over, the update comes by email or on the U of A website.",cue:"No one calls each desk, and the icon colour has nothing to do with the emergency."}]},
 BQ('alerts-f01'),
 MI('alerts',0),MI('alerts',1),MI('alerts',3),MI('alerts',2),
 {type:'story',time:'New situation',title:'Working from home',text:"It's a home day, and you're on your personal laptop."},
 BQ('alerts-08'),BQ('alerts-05'),
 MSN(['alertus'])];

const L35=()=>[ // contrasting cases
 UST('u-report'),
 teachS('u-report',0,1,2),
 {type:'compare',title:'Nobody got hurt. Report it anyway?',
  a:{k:'Near miss',h:'A box lands where you just stood',pts:['Nobody hurt, nothing damaged','It could have hurt someone, so it is an incident','Tell your supervisor and report it the same day']},
  b:{k:'Damage, no injury',h:'A coat rack tips and cracks a monitor',pts:['Nobody hurt, but something is damaged','Tell your supervisor','Report it on the U of A incident form']},
  cue:"Don't ask \"Was anyone hurt?\" Ask \"Could it have hurt someone, or did it damage something?\" If yes, report it."},
 MI('alerts',4),BQ('incidents-f01'),
 teachS('u-report',1,2,2),
 ...workedSteps('u-report'),
 BQ('incidents-02'),BQ('incidents-11'),
 {type:'story',time:'New situation',title:'At the service desk',text:"Not every incident is a box or a cord."},
 BQ('incidents-09')];

const L36=()=>{const S6=QB['incidents-f02']?QB['incidents-f02'].order.steps:[]; const cues=["People first. Get first aid or medical help right away.","Keep others from getting hurt, and leave things as they are so you can see what happened.","As soon as it's safe to step away.","Serious means likely hospital care, an uncontrolled fire or flood, or a structure failure. Also call 780-492-5555.","Getting back to work safely is part of the process."];
 return [
 {type:'model',kicker:'Demonstrate',title:'A cut during setup, start to finish',text:"Tuesday, 8:40 AM. Setting up a workshop, Priya trips over a stack of boxes and cuts her forearm on a table edge. Here's the full timeline.",
  steps:S6.map((t,k)=>({act:escR(t),cue:cues[k]||''}))},
 teachS('u-report',2,1,2),teachS('u-report',3,2,2),
 QF('incidents-f02',[0,1]),
 BQ('incidents-31'),BQ('incidents-32'),
 {type:'story',time:'New place',title:'At a North Campus meeting',text:"You're in a North Campus building, not ESQ, when a colleague collapses."},
 BQ('emergprep-02'),BQ('emergprep-05')];};

/* ---------- Unit 4 · With your team ---------- */
const L41=()=>[ // behaviour modelling
 UST('u-care'),
 teachS('u-care',0,1,2),teachS('u-care',1,2,2),
 {type:'convo',title:'How Lee stops it',text:"Same scene, another office. Lee sees a colleague about to stand on a wheeled chair.",
  lines:[{who:'Lee',me:1,say:'"Hang on a sec, that chair could roll out from under you."',note:'Stops it now, kindly, before anyone gets hurt.'},
   {who:'Colleague',say:'"It\'s fine, it\'s just one box."'},
   {who:'Lee',me:1,say:'"Let me grab a step stool. I\'ll hold it while you reach."',note:'Offers the right tool instead of a lecture.'},
   {who:'Lee',me:1,say:'"Should we move those boxes to a lower shelf, so nobody has to reach up there?"',note:'Fixes the hazard, so it doesn\'t come back.'}],
  cue:'See it, stop it, fix it. Kind, quick and practical, and no title needed.'},
 BQ('care-05'),
 {type:'compare',title:'Bystander or Safety Champion?',
  a:{k:'Bystander',bad:1,h:'"Someone else will say something"',pts:['Notices the hazard and says nothing','Waits for HSE or a manager','The next person gets hurt']},
  b:{k:'Safety Champion',h:'"Hold on, let me help"',pts:['Stops unsafe work right away','Alerts the person kindly','Fixes it, or reports it']},
  cue:"You don't need a title to be a Safety Champion. The difference is acting in the moment."},
 ...workedSteps('u-care'),
 BQ('care-06'),BQ('care-01'),BQ('care-30')];

const L42=()=>[ // Observe → Interpret → Respond
 teachS('u-care',3,1,1),
 {type:'convo',title:'The Friday social',text:"The team is planning its Friday get-together.",
  lines:[{who:'Amira',say:'"I usually skip the Friday social. It\'s always at the pub, and I don\'t drink."'},
   {who:'Colleague',say:'"Oh, you can just get a soda!"',note:"Well meant, but it asks Amira to fit the plan rather than changing it."},
   {who:'You',me:1,say:'"Thanks for saying so. Let\'s mix it up: a café or a lunch spot some weeks. Any favourites?"',note:'Thanks her, changes the plan, and invites her in.'}],
  cue:"Cultural safety means no one has to mask who they are. Notice who an arrangement leaves out, then change the arrangement, not the person."},
 {type:'compare',title:'Two responses to a difference',
  a:{k:'Asks them to fit in',bad:1,h:'"Just get a soda"',pts:['Treats the difference as their problem','They keep opting out, quietly','The team never notices who is missing']},
  b:{k:'Changes the arrangement',h:'"Let\'s mix it up"',pts:['Thanks them for saying so','Adjusts the plan so everyone can come','Makes it easier for the next person to speak up']},
  cue:"Ask yourself: am I asking the person to change, or the arrangement?"},
 BQ('care-22'),BQ('care-23'),BQ('care-21'),
 CH({type:'dialogue',tag:'Repair it',q:'Last month you said, "Let\'s just keep it at the pub, everyone likes it." Since then, two teammates haven\'t come once. What do you say at the next team meeting?',
  opts:[{t:'"I think our Friday spot leaves some people out. Could we rotate where we go?"',ok:1,fb:'Owning it and changing the plan is the repair. No one has to explain themselves.',c:'The team tries a café the next week, and both teammates come.'},
   {t:'Nothing. If they wanted to come, they would.',ok:0,fb:'Silence keeps an arrangement that leaves people out.',c:'The same two people keep opting out, and no one asks why.'},
   {t:'Ask the two teammates, in front of everyone, why they never come.',ok:0,fb:'Putting people on the spot asks them to explain themselves in public.',c:'They feel singled out and give a vague answer. Nothing changes.'}]}),
 BQ('care-24')];

const L43=()=>[ // case comparison
 UST('u-rights'),
 teachS('u-rights',0,1,3),teachS('u-rights',1,2,3),teachS('u-rights',2,3,3),
 {type:'compare',title:"Who's in charge today?",
  a:{k:'An acting lead is named',h:'Malik is covering today',pts:['Malik directs your work today','So he is your supervisor for safety','Raise the swaying shelf with him now']},
  b:{k:"No one said who's covering",h:"You're not sure who to ask",pts:['Ask: "Who\'s in charge today?"',"Don't wait for your manager to come back","Unsafe in the meantime? Don't start the task"]},
  cue:"Your supervisor is whoever directs your work today, whatever their title."},
 ...workedSteps('u-rights'),
 BQ('rights-01'),BQ('rights-12'),
 {type:'story',time:'New role',title:'Now you direct the work',text:"Your manager asks you to lead a small project team for six months."},
 BQ('rights-30'),BQ('rights-11')];

const L44=()=>{const S4=QB['rights-f01']?QB['rights-f01'].order.steps:[]; const cues=["Most unsafe tasks get fixed here. Refusing is a last resort.","Say it clearly, so you both know the refusal process has started.","HSE helps you and your supervisor through it.","Refusing in good faith is protected.","You know what changed before the work goes ahead.","You can still escalate if the danger remains."];
 return [
 {type:'model',kicker:'Demonstrate',title:'The swaying shelf: refusing, step by step',text:"Malik asks you to climb a storage shelving unit that sways when you touch it. A fall could seriously hurt you. Here's the approved process.",
  steps:S4.map((t,k)=>({act:escR(t),cue:cues[k]||''})),note:"Never do work you believe is a serious and immediate threat, not even \"just quickly\" while someone holds it steady."},
 teachS('u-rights',3,1,1),
 {type:'compare',title:'Raise it, or refuse it?',
  a:{k:'Raise it and fix it together',h:'An unfamiliar task, no dolly',pts:['Not a serious, immediate threat yet','Ask for the right equipment and a competent worker','Work with your supervisor to make it safe']},
  b:{k:'Refuse',h:'A shelf that sways under you',pts:['A fall could seriously hurt you, right now',"You tried to make it safe with Malik and couldn't",'Confirm the refusal, then call 780-492-5555']},
  cue:"Refusal is for work you reasonably believe is a serious and immediate threat, after you've tried to make it safe with your supervisor."},
 QF('rights-f01',[0,1]),
 BQ('rights-05'),BQ('rights-06'),BQ('rights-07'),BQ('rights-08')];};

const L45=()=>[ // Observe → Interpret → Respond, with repair
 UST('u-psych'),
 teachS('u-psych',0,1,1),
 {type:'convo',title:'Another meeting, another way',text:"A different team, a similar moment. A new coordinator spots a problem in the report on screen.",
  lines:[{who:'New coordinator',say:'"Sorry, I think the totals in row 4 might be off?"'},
   {who:'Lead',me:1,say:'"Good catch, thank you. Can you show us?"',note:'Thanks her first, in front of the group.'},
   {who:'New coordinator',say:'"Row 4 still counts the cancelled sessions."'},
   {who:'Lead',me:1,say:'"You\'re right. I\'ll fix it today. Please keep flagging things like this."',note:'Acts on it, and says so. That makes the next concern easier to raise.'}],
  cue:'Thank, then act. People watch what happens to the first person who speaks up.'},
 {type:'compare',title:'Same concern, two futures',
  a:{k:'Thanked and acted on',h:'"Good catch, thank you"',pts:['The error gets fixed','She speaks up again next time','Others learn it\'s safe to raise things']},
  b:{k:'Dismissed',bad:1,h:'A sigh, then "Moving on"',pts:['The error stays in the report','She stays quiet next time','Mistakes go hidden']},
  cue:"The response decides whether people speak up again."},
 BQ('psych-15'),
 Object.assign(BQ('psych-f01')||{type:'story',time:'',title:'',text:''},{tag:'Mini story · your choices change what happens'}),
 BQ('psych-23'),
 CH({type:'dialogue',tag:'Repair it',q:'In a rushed meeting, a teammate started to raise a concern and you said, "Not now." Afterwards, you realize how it landed. What do you say?',
  opts:[{t:'"Earlier I cut you off, and that wasn\'t fair. Can you tell me what you noticed?"',ok:1,fb:'Owning it and asking again repairs the moment. Thanking people and acting keeps speaking up safe.',c:'She explains, you fix the issue before Friday, and next week she raises another one.'},
   {t:"Leave it. She'll bring it up again if it matters.",ok:0,fb:'After being cut off, most people don\'t try again.',c:"She doesn't. The issue comes back later as a bigger problem."},
   {t:'"You know how busy those meetings are. Just email me next time."',ok:0,fb:"It sounds practical, but it signals that raising things openly isn't welcome.",c:'She stops raising things in meetings, and the team loses what she notices.'}]}),
 BQ('psych-04')];

const L46=()=>[ // compare vague vs specific, then revise
 teachS('u-psych',2,1,1),
 {type:'compare',title:'Vague or specific?',
  a:{k:'Vague',bad:1,h:'"I\'m swamped."',pts:['Your lead hears stress, not a decision','Nothing comes off your plate','You keep it all and do each part less well']},
  b:{k:'Specific',h:'"I have the report, the module and the survey due Friday. Which comes first?"',pts:['Names the tasks and the time','Asks for a decision on priorities','You agree what can move']},
  cue:"Specific requests get specific answers. Name the tasks and the time you have, then ask which comes first."},
 {type:'convo',title:'Asking what "done" looks like',text:"You've just been handed part of a new onboarding module.",
  lines:[{who:'You',me:1,say:'"Before I start: what does done look like for my part? A draft by the 15th, or a finished version?"',note:'Asks about the outcome and the date, not "any thoughts?"'},
   {who:'Lead',say:'"A draft by the 15th is perfect. We\'ll polish it together."'},
   {who:'You',me:1,say:'"Great. And how does it fit the team\'s goals this term?"',note:'Connects the task to the bigger picture.'}],
  cue:"Too much work and unclear expectations are workplace stressors. Ask early, and be specific."},
 BQ('psych-24'),BQ('psych-36'),
 CH({type:'dialogue',tag:'Revise it',q:'You drafted this message to your lead: "I can\'t keep up with everything." Which version would you send instead?',
  opts:[{t:'"I have three deadlines this week and time for two. Could the usage report move to next week?"',ok:1,fb:'Specific, with a proposal. Your lead can decide in one reply.',c:'Your lead replies within the hour: the report can wait a week.'},
   {t:'"I\'m really overwhelmed lately."',ok:0,fb:'Honest, but your lead still doesn\'t know what to change.',c:'Your lead says, "Hang in there." Nothing comes off your plate.'},
   {t:'Send nothing, and work evenings until it\'s done.',ok:0,fb:'Fatigue is a hazard too. Raise workload early and agree priorities.',c:"You get it done, but you're exhausted, and the next deadline lands the same way."}]}),
 BQ('psych-14'),BQ('psych-27'),BQ('psych-39')];

const L47=()=>[ // contrasting interpersonal cases
 teachS('u-psych',3,1,2),teachS('u-psych',1,2,2),
 {type:'compare',title:'Two ways to say thanks',
  a:{k:'Specific',h:'"Sorting the shared drive saved me an hour today."',pts:['Names what they did','Says why it mattered','Comes soon after']},
  b:{k:'Generic',bad:1,h:'"Thanks for everything!"',pts:['Kind, but easy to forget',"Doesn't say what helped",'Can feel automatic']},
  cue:"Recognize effort specifically and promptly, even on work that gets shelved."},
 BQ('psych-31'),BQ('psych-11'),
 {type:'compare',title:'Different needs, different doors',
  a:{k:'A colleague is struggling',h:'"I\'ve been having a hard few weeks."',pts:['Listen, and thank them for telling you','Point them to EFAP Immediate Resources','Respect their privacy']},
  b:{k:'A colleague is being harassed',h:'"He keeps making remarks about my religion."',pts:['Take it seriously; don\'t brush it off','Office of Safe Disclosure and Human Rights, or the HR Partner','Report it to your supervisor']},
  cue:"Support for wellbeing goes to EFAP. Bullying or harassment goes to Safe Disclosure or your HR Partner."},
 BQ('psych-20'),BQ('psych-13'),BQ('psych-41'),BQ('psych-46')];

/* ---------- Unit 5 · End of day ---------- */
const L51=()=>[ // scenario planning + decision branch
 MI('late',0),
 {type:'model',kicker:'Watch the plan',title:'Plan the evening before it starts',text:"Before a late night alone, an experienced colleague does five things.",
  steps:[{act:'Tells Security their name, exact location, phone number and when they\'ll leave.',cue:"Call 780-428-1541, sign the After-Hours Logbook, or email ESQ Security."},
   {act:"Tells their supervisor they're working alone tonight.",cue:"Working alone is a hazard, so your supervisor should know."},
   {act:'If plans change, calls Security to update the time.',cue:"Security's plan is only as good as your last update."},
   {act:'Books a Safe Walk through Security for the walk to the car.',cue:"It's a free escort within two blocks. Book about an hour ahead if you can."},
   {act:"If the alarm sounds, gets out, then tells Security they're out.",cue:"Otherwise responders may search the building for you."}]},
 MI('late',1),MI('late',2),MI('late',3),MI('late',4),
 {type:'compare',title:'Down the hall, or in your space?',
  a:{k:'Someone trying doors down the hall',h:'Keep your distance',pts:["Don't confront or question them",'Call Security: 780-428-1541','Say who, where and what they\'re doing']},
  b:{k:"A stranger in your suite who won't leave",h:'Say it, then call',pts:['Call Security','Tell them they need to leave because they\'re trespassing','Then call 911 and stay on the line']},
  cue:"Distance first. Only when someone is in your space and won't leave do you tell them they're trespassing."},
 MI('late',5),MI('late',6),MI('late',7),
 Object.assign(BQ('late-f01')||{type:'story',time:'',title:'',text:''},{tag:'Mini story · your choices change what happens'}),
 BQ('late-03')];

const L52=()=>[ // Compare → Explain → Transfer
 MI('downtown',0),
 teachS('downtown',0,1,2),
 {type:'compare',title:'Inside the doors, or outside?',
  a:{k:'Inside ESQ',h:'Security has authority here',pts:['Emergency: 911, then ESQ Security','Not urgent: ESQ Security, 780-428-1541','Afterwards: a U of A incident report']},
  b:{k:'Sidewalks, roads and the LRT',h:'City jurisdiction',pts:['Emergency: 911','Not urgent: start with ESQ Security; police or ETS may take over','On the LRT: ETS Transit Watch, 780-442-4900']},
  cue:"Is someone in danger right now? Call 911, wherever you are. If not, start with ESQ Security, and know that outside the doors, police or ETS may take over."},
 teachS('downtown',1,2,2),
 MI('downtown',1),MI('downtown',2),MI('downtown',3),MI('downtown',4),MI('downtown',5),MI('alerts',5),MI('downtown',6),
 BQ('downtown-f01'),BQ('downtown-05'),
 MSN(['safewalk'])];

Object.entries({'2-1':L21,'2-2':L22,'2-3':L23,'2-4':L24,'3-1':L31,'3-2':L32,'3-3':L33,'3-4':L34,'3-5':L35,'3-6':L36,
 '4-1':L41,'4-2':L42,'4-3':L43,'4-4':L44,'4-5':L45,'4-6':L46,'4-7':L47,'5-1':L51,'5-2':L52}).forEach(([id,f])=>{LBY(id).flow=()=>f().filter((s,i,a)=>s&&a.indexOf(s)===i);});
