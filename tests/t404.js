const {chromium}=require('playwright'); const srv=require('./srv.js'); const step=require('./bot.js');
(async()=>{const s=srv(9350,'test.html'); const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}}); const bad=new Set(); p.on('response',r=>{if(r.status()>=400) bad.add(r.url());});
 await p.goto('http://localhost:9350/'); await p.waitForTimeout(500); await p.click('#obNext'); await p.click('[data-of="2"]'); await p.click('#obNext'); await p.click('#obNext'); await p.waitForTimeout(500);
 for(const id of ['1-1','1-2','1-3','1-4','2-1','3-1','3-2','4-1','5-1']){await p.reload(); await p.waitForTimeout(400); if(await p.isVisible('#player')) await p.keyboard.press('Escape'); await p.evaluate(i=>{__S().prog={}; document.querySelector('#bnav [data-tab="learn"]').click(); document.querySelector(`.lbtn[data-start="${i}"]`).click();},id); await p.waitForTimeout(400);
  for(let n=0;n<60;n++){const r=await step(p,false); await p.waitForTimeout(60); if(r==='closed'||await p.evaluate(()=>__PL()&&__PL().done)) break;}}
 for(const t of ['home','learn','building','kr','more']){await p.evaluate(t=>document.querySelector(`#bnav [data-tab="${t}"]`).click(),t); await p.waitForTimeout(400);}
 console.log('404s:',[...bad].join('\n')||'none'); await b.close(); s.close();})();
