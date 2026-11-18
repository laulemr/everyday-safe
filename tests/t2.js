const {chromium}=require('playwright'); const srv=require('./srv.js'); const step=require('./bot.js');
(async()=>{const s=srv(9302,'test.html'); const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
 const errs=[]; p.on('pageerror',e=>errs.push('PAGEERR '+e.message)); p.on('console',m=>{if(m.type()==='error'&&!/fonts|TUNNEL/.test(m.text())) errs.push(m.text());});
 await p.goto('http://localhost:9302/'); await p.waitForTimeout(500);
 await p.click('#obNext'); await p.click('[data-of="2"]'); await p.click('#obNext'); await p.click('#obNext'); await p.waitForTimeout(500);
 const ids=['1-1','1-2','1-3','1-4','2-1','2-2','2-3','2-4','3-1','3-2','3-3','3-4','3-5','3-6','4-1','4-2','4-3','4-4','4-5','4-6','4-7','5-1','5-2','final'];
 for(const id of ids){ if(id!=='1-1'){await p.evaluate(i=>{},id); await p.evaluate(()=>{}); }
   if(id!=='1-1'){ // start lesson via path
     await p.evaluate(()=>{}); await p.click('#bnav [data-tab="learn"]'); await p.evaluate(i=>{const b=document.querySelector(`[data-start="${i}"]`); b.click();},id); await p.waitForTimeout(200);}
   const types=[]; let n=0;
   for(;n<120;n++){const r=await step(p,false); if(r==='closed') break; types.push(r); const fin=await p.evaluate(()=>__PL()&&__PL().done); if(fin){await p.screenshot({path:`done_${id}.png`}); await p.evaluate(()=>document.querySelector('#doneHome').click()); break;}}
   const st=await p.evaluate(i=>({done:!!__S().done[i],acc:__S().acc[i]}),id);
   console.log(id,JSON.stringify(st),[...new Set(types.filter(t=>!['next'].includes(t)))].join(','),n);
 }
 await p.click('#bnav [data-tab="home"]'); await p.screenshot({path:'today2.png',fullPage:true});
 await p.click('#bnav [data-tab="more"]'); await p.waitForTimeout(200); await p.screenshot({path:'me.png',fullPage:true});
 await p.click('#bnav [data-tab="learn"]'); await p.screenshot({path:'path.png',fullPage:true});
 await p.click('#hCard'); await p.screenshot({path:'card.png',fullPage:true});
 console.log(errs.join('\n')||'no errors'); await b.close(); s.close();})();
