const {chromium}=require('playwright'); const srv=require('./srv.js'); const fs=require('fs'); const step=require('./bot.js');
const AX=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
(async()=>{const s=srv(9305,'test.html'); const b=await chromium.launch();
 for(const [w,h,theme] of [[390,844,'light'],[1440,900,'dark']]){const p=await b.newPage({viewport:{width:w,height:h},colorScheme:theme});
 await p.goto('http://localhost:9305/'); await p.waitForTimeout(400);
 const scan=async(name,ctx)=>{await p.addScriptTag({content:AX}); const r=await p.evaluate(async c=>{const r=await axe.run(c?document.querySelector(c):document,{runOnly:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}); return r.violations.map(v=>v.id+' ('+v.nodes.length+'): '+v.nodes.slice(0,2).map(n=>n.target.join(' ')+' '+(n.failureSummary||'').split('\n')[1]).join(' | '));},ctx); console.log(theme,w,name,r.length?'\n  '+r.join('\n  '):'OK');};
 await scan('onboarding','#onb');
 await p.evaluate(()=>{const S=__S(); S.onboarded=true; S.floor='2'; S.done['1-1']=true; localStorage.setItem('esq-ready-v2',JSON.stringify(S));}); await p.reload(); await p.waitForTimeout(600);
 await scan('today'); 
 for(const t of ['learn','kr','building','more','card']){await p.evaluate(t=>(t==='card'?document.querySelector('#hCard'):document.querySelector(`#bnav [data-tab="${t}"]`)).click(),t); await p.waitForTimeout(150); await scan(t);}
 await p.evaluate(()=>document.querySelector('[data-start="2-4"]').click()); await p.waitForTimeout(300);
 for(let i=0;i<14;i++) await step(p,i%3===0);
 await scan('player-sort','#player');
 await p.close();}
 await b.close(); s.close();})();
