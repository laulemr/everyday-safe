const {chromium}=require('playwright'); const srv=require('./srv.js'); const step=require('./bot.js');
(async()=>{const s=srv(9347,'test.html'); const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:390,height:844}}); let p=await ctx.newPage();
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:9347/'); await p.waitForTimeout(500);
 await p.click('#obNext'); await p.click('[data-of="2"]'); await p.click('#obNext'); await p.click('#obNext'); await p.waitForTimeout(500);
 for(let n=0;n<60;n++){await step(p,false); if(await p.evaluate(()=>__PL()&&__PL().done)){await p.evaluate(()=>document.querySelector('#doneHome')&&document.querySelector('#doneHome').click()); break;}}
 await p.waitForTimeout(400); if(await p.isVisible('#player')) await p.click('#pQuit');
 await p.evaluate(()=>document.querySelector('#bnav [data-tab="learn"]').click()); await p.waitForTimeout(300);
 await p.evaluate(()=>document.querySelector('[data-start="1-2"]').click()); await p.waitForTimeout(500);
 for(let n=0;n<4;n++){await step(p,false); await p.waitForTimeout(150);}
 await p.click('#pQuit'); await p.waitForTimeout(400); await p.click('#dlgNo'); await p.waitForTimeout(500);
 await p.close(); p=await ctx.newPage(); p.on('pageerror',e=>errs.push(e.message)); await p.goto('http://localhost:9347/'); await p.waitForTimeout(800);
 const card=await p.evaluate(()=>document.querySelector('.hj').innerText.replace(/\s+/g,' ')); await p.screenshot({path:'wb_home.png'});
 await p.click('.hj'); await p.waitForTimeout(600); const dlgFromCard=await p.isVisible('#dlg'); const v1=await p.evaluate(()=>__PL()&&__PL().view); console.log('afterCard',JSON.stringify(await p.evaluate(()=>({open:!document.getElementById('player').hidden,dlg:!document.getElementById('dlg').hidden,dt:document.getElementById('dlg').innerText.slice(0,60)}))));
 await p.click('#pQuit'); await p.waitForTimeout(400); await p.click('#dlgNo'); await p.waitForTimeout(500);
 await p.evaluate(()=>document.querySelector('#bnav [data-tab="learn"]').click()); await p.waitForTimeout(300);
 //,JSON.stringify(await p.evaluate(()=>({open:!document.getElementById('player').hidden, n:document.querySelectorAll('[data-start="1-2"]').length, which:[...document.querySelectorAll('[data-start="1-2"]')].map(e=>e.className+'|'+e.hasAttribute('data-resume'))}))));
 await p.evaluate(()=>document.querySelector('.lbtn[data-start="1-2"]').click()); await p.waitForTimeout(500);
 const dlg=await p.isVisible('#dlg'); const dt=await p.evaluate(()=>document.querySelector('#dlg').innerText.replace(/\s+/g,' ')); await p.screenshot({path:'wb_dlg.png'});
 console.log('dbg',JSON.stringify(await p.evaluate(()=>({prog:__S().prog,open:!document.getElementById('player').hidden,view:__PL()&&__PL().view}))));
 let v2=null; if(dlg){await p.click('#dlgNo'); await p.waitForTimeout(700); v2=await p.evaluate(()=>__PL()&&__PL().view);}
 console.log(JSON.stringify({card,dlgFromCard,resumedAt:v1,dlg,dt,afterStartOver:v2})); console.log(errs.join('\n')||'no errors'); await b.close(); s.close();})();
