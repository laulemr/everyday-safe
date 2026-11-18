/* ===== part 2: curriculum (5 units, 26 lessons + final) ===== */
Object.assign(VIS,UVIS());
Object.keys(ULES).forEach(id=>{LEARN[id]=ULES[id].cards.map(c=>({i:ULES[id].icon,t:c.t,p:c.p,x:c.x}));});
LEARN.hidden=[
 {i:'help',t:"Hazards you can't see",p:["<b>Fatigue</b>, <b>working alone</b>, shift work and <b>bullying</b> are hazards too.","Treat them like physical ones: <b>identify, assess, control</b>.","Running on very little sleep? <b>Tell your supervisor</b> so plans can change."],x:["Psychological hazards are workplace stressors that affect mental health and well-being, such as fatigue, shift work, bullying, violence and working alone."]},
 {i:'shield',t:'Contractors on your floor',p:["Something near their work looks unsafe? <b>Tell your supervisor</b>.","<b>Share hazards both ways</b>, like a workshop next to their work area.","Respect their space. Attend their <b>site orientation</b> if asked."],x:["Hiring a contractor yourself? Verify prequalification first and share hazards. Questions: hse.info@ualberta.ca."]}];

const UNITS=[
 {n:1,short:'Morning',time:'8:50 AM',title:'Know your way out',goal:'Get from your desk to safety, and help others do the same.',c:'--u1',icon:'stairs'},
 {n:2,short:'At your desk',time:'10:30 AM',title:'Prevent it',goal:'Spot hazards and pick the strongest fix.',c:'--u2',icon:'flip'},
 {n:3,short:'Something happens',time:'2:15 PM',title:'Get help fast',goal:'Know who to call, in what order, and what to report.',c:'--u3',icon:'phone'},
 {n:4,short:'With your team',time:'3:40 PM',title:'Safe to speak up',goal:'Speak up, support each other and handle unsafe work.',c:'--u4',icon:'help'},
 {n:5,short:'End of day',time:'7:30 PM',title:'Heading home',goal:'Work late safely and get home safely.',c:'--u5',icon:'moon'}];
const MBY=id=>M.find(m=>m.id===id);
const UFULL={1:'Morning',2:'At your desk',3:'When something happens',4:'With your team',5:'End of day'};
/* m: an existing ESQ lesson (cards + curated practice); cards: [learnKey, index]; bank: extra bank items; n: how many more bank items to draw */
const LESSONS=[
 {id:'1-1',u:1,title:'Out by the stairs',goal:'Get from your desk to the muster point.',icon:'stairs',m:'evac',mis:'stairs'},
 {id:'1-2',u:1,title:'Read your floor plan',goal:'Find your stairwells, rescue spot and AED.',icon:'path',m:'plan',bank:['plan-05','plan-09'],mis:'stairs'},
 {id:'1-3',u:1,title:'Spot a fire',goal:'Act in the right order if you find a fire.',icon:'flame',m:'fire'},
 {id:'1-4',u:1,title:'Help a teammate out',goal:"Support a colleague who can't use the stairs.",icon:'help',m:'mobility',bank:['mobility-f01']},
 {id:'2-1',u:2,title:'Spot the hazards',goal:'Find and fix, or report, hazards in a room.',icon:'flip',m:'room',mis:'cords'},
 {id:'2-2',u:2,title:'Pick the strongest fix',goal:'Choose the highest practical control, then check it.',icon:'flip',cards:[['u-control',0],['u-control',1],['u-control',2]],worked:'u-control',story:'u-control',bank:['hazmgmt-13','hazmgmt-f01'],n:2},
 {id:'2-3',u:2,title:'Hidden hazards',goal:'Raise fatigue, stress and contractor work as hazards.',icon:'shield',cards:[['hidden',0],['hidden',1]],n:4},
 {id:'2-4',u:2,title:'Power, storms and floods',goal:"Know what to do when something's wrong but it isn't a fire.",icon:'storm',m:'notfire',bank:['notfire-f01']},
 {id:'3-1',u:3,title:'First on scene',goal:'Call 911, then Security, with the right details.',icon:'heart',m:'medical',mis:'aed'},
 {id:'3-2',u:3,title:'The coffee code',goal:'Get Security without saying so, and stay safe.',icon:'coffee',m:'coffee',bank:['security-f01'],mis:'save'},
 {id:'3-3',u:3,title:'Calls and packages',goal:'Handle a threatening call or a suspicious package.',icon:'phone',m:'threats',bank:['threats-f01','mix-f01']},
 {id:'3-4',u:3,title:'Alerts',goal:'Make sure emergency alerts reach you.',icon:'bell',m:'alerts',bank:['alerts-f01'],mis:'alertus'},
 {id:'3-5',u:3,title:'Near misses count',goal:'Report a near miss the same day.',icon:'book',cards:[['u-report',0],['u-report',1]],worked:'u-report',story:'u-report',bank:['incidents-f01'],n:2},
 {id:'3-6',u:3,title:'Respond, report, recover',goal:'Know the order after an incident.',icon:'book',cards:[['u-report',2],['u-report',3]],bank:['incidents-f02'],n:3},
 {id:'4-1',u:4,title:"Safety is everyone's job",goal:'Stop unsafe work and alert a colleague right away.',icon:'heart',cards:[['u-care',0],['u-care',1],['u-care',2]],worked:'u-care',story:'u-care',n:4},
 {id:'4-2',u:4,title:'Come as you are',goal:'Help make the team a place where no one has to mask who they are.',icon:'heart',cards:[['u-care',3]],bank:['care-22','care-23','care-24'],n:1},
 {id:'4-3',u:4,title:"Who's in charge today",goal:'Raise an unsafe task with whoever is in charge.',icon:'shield',cards:[['u-rights',0],['u-rights',1],['u-rights',2]],worked:'u-rights',story:'u-rights',n:4},
 {id:'4-4',u:4,title:"When work isn't safe",goal:'Use the work-refusal steps only as a last resort.',icon:'shield',cards:[['u-rights',3]],bank:['rights-f01'],n:2},
 {id:'4-5',u:4,title:'Safe to speak up',goal:'Respond so speaking up stays safe.',icon:'help',cards:[['u-psych',0]],worked:'u-psych',story:'u-psych',bank:['psych-f01','psych-23'],n:2},
 {id:'4-6',u:4,title:'Workload, clarity and balance',goal:'Raise workload and unclear expectations early.',icon:'help',cards:[['u-psych',2]],bank:['psych-24','psych-27'],n:2},
 {id:'4-7',u:4,title:'Support each other',goal:'Notice, support and recognize colleagues.',icon:'help',cards:[['u-psych',1],['u-psych',3]],bank:['psych-20','psych-31'],n:2},
 {id:'5-1',u:5,title:'Working late or alone',goal:'Check in with Security and plan for working alone.',icon:'moon',m:'late',bank:['late-f01']},
 {id:'5-2',u:5,title:'Downtown and the way home',goal:'Choose the right contact and get to your car or train safely.',icon:'city',m:'downtown',bank:['downtown-f01'],mis:'safewalk'}];
const FINALL={id:'final',u:0,title:'Final challenge: who to call, fast',goal:'Pick the right contact fast, then work through a real situation.',icon:'trophy',final:1};
const ALL=LESSONS.concat([FINALL]);
const LBY=id=>ALL.find(l=>l.id===id);
const unitL=n=>LESSONS.filter(l=>l.u===n);
const coreDone=()=>LESSONS.filter(l=>l.u<=4).every(l=>S.done[l.id]);
const unlocked=l=>!l.final||coreDone()||!!S.done[l.id];
const ESSENTIALS=['1-1','1-2','3-1','3-2','1-4'];
const CPATHS=[
 {t:"I'm new to ESQ",why:'Start with the five essentials: getting out, your floor plan, a medical emergency, the coffee code and helping a teammate.',ls:['1-1','1-2','3-1','3-2','1-4']},
 {t:'Around my desk every day',why:'Small hazards near your desk, and how to fix or report them before someone gets hurt.',ls:['2-1','2-2','2-3','3-5']},
 {t:"I'm here early, late or on my own",why:'Fewer people around means more depends on your own plan.',ls:['5-1','1-4','3-1','5-2']},
 {t:'I work from home some days',why:'Alerts need to reach you at home, and you need to know your floor when you come back in.',ls:['3-4','1-2','4-6','5-2']},
 {t:'Working well with my team',why:'Speaking up, including people, and knowing who\'s in charge when your manager is away.',ls:['4-1','4-2','4-5','4-6','4-7','4-3']}];
const MISSIONS=[
 {id:'stairs',t:'Walk to your second-nearest stairwell',d:'Find it on the posted plan first, then walk it.',kind:'confirm',i:'stairs'},
 {id:'aed',t:'Find the AED nearest your desk',d:()=>`Yours: ${F().aed}.`,kind:'confirm',i:'heart'},
 {id:'save',t:"Save ESQ Security's number",d:'Add 780-428-1541 to your phone.',kind:'copy',i:'phone'},
 {id:'alertus',t:'Check your Alertus icon',d:'Bottom-right of your U of A screen. What do you see?',kind:'alertus',i:'bell'},
 {id:'cords',t:'Check your power bar and cords',d:'No cords under rugs or across walkways. Power bars need circuit protection.',kind:'confirm',i:'bolt'},
 {id:'safewalk',t:'Ask Security how to book a Safe Walk',d:'Free within two blocks of ESQ. Call 780-428-1541 or visit the desk.',kind:'confirm',i:'city'},
 {id:'warden',t:'Know your Floor Warden',d:'Ask your manager. The name stays on this device only.',kind:'input',i:'user'}];
const ALN={ok:'Green check: alerts will reach your computer.',x:'Red X: log an IST ticket so alerts reach your computer.',none:'Not visible: log an IST ticket, and install the MyUAlberta app.'};
const BADGES=[
 {id:'first',n:'First lesson',d:'Finish any lesson',i:'star'},
 {id:'essentials',n:'First-week essentials',d:'Finish the five essentials lessons',i:'shield'},
 {id:'u1',n:'Know your way out',d:'Finish Unit 1',i:'stairs'},
 {id:'u2',n:'Prevent it',d:'Finish Unit 2',i:'flip'},
 {id:'u3',n:'Get help fast',d:'Finish Unit 3',i:'phone'},
 {id:'u4',n:'Safe to speak up',d:'Finish Unit 4',i:'help'},
 {id:'u5',n:'Heading home',d:'Finish Unit 5',i:'moon'},
 {id:'ready',n:'Everyday Safe',d:'Score 80% or more, first try, in the final challenge',i:'trophy'},
 {id:'kr4',n:'Keeping ready',d:'Finish four Keep Ready episodes',i:'target'},
 {id:'ret25',n:'Retained 25',d:'Retain 25 questions: right on two separate days',i:'check'},
 {id:'field',n:'Out in the building',d:'Complete a field mission',i:'pin'},
 {id:'field5',n:'Building-ready',d:'Complete five field missions',i:'pin'}];
const LEVELS=[['Newcomer','Just getting started'],['Floor-ready','First-week essentials done'],['Building-ready','All five units done'],['Safety Champion','Final challenge passed and 25 questions retained']];
function level(){const r=retainedN(); if(S.done.final&&r>=25) return 3; if(LESSONS.every(l=>S.done[l.id])) return 2; if(ESSENTIALS.every(id=>S.done[id])) return 1; return 0;}
function earn(id){if(S.badges[id]) return null; S.badges[id]=Date.now(); return BADGES.find(b=>b.id===id);}

/* weekly episodes: a recurring cast, an ordinary ESQ moment, aligned with the bank's weekly themes */
const EPIS=[
 {who:'Priya',time:'Monday · 8:52 AM',where:'2nd floor',text:"Priya is back from vacation and finds the stairwell she always uses taped off for painting. She stops at your desk: “So… which way would we go now?”"},
 {who:'Malik',time:'Thursday · 5:45 PM',where:'3rd floor',text:"It's already dark out. Malik is staying late to finish a report and asks if anyone else will be around after six."},
 {who:'Leila',time:'Tuesday · 7:55 AM',where:'Main floor',text:"Leila comes in through the 103 Street doors, stamping slush off her boots. The forecast says the storm gets worse by noon."},
 {who:'Jae',time:'Wednesday · 10:10 AM',where:'Copy room',text:"Jae is setting up for a workshop. The copy room is crowded with boxes, and someone has borrowed a space heater for the morning."},
 {who:'Raj',time:'Monday · 9:20 AM',where:'Team table',text:"A new light fixture hangs low over the team table. Raj stands up fast, just misses it, and laughs: “Nobody got hurt, right?”"},
 {who:'Leila',time:'Friday · 11:40 AM',where:'Kitchenette',text:"You hear a mug break in the kitchenette. A colleague is sitting on the floor, pale, saying they feel faint. Leila looks at you."},
 {who:'the new coordinator',time:'Thursday · 1:30 PM',where:'Team check-in',text:"The new coordinator spots a problem in the plan on screen. She glances around the table before she says anything."},
 {who:'Malik',time:'Wednesday · 4:05 PM',where:'Your suite',text:"A visitor waiting for a meeting is getting louder. Malik catches your eye from across the room."}];
