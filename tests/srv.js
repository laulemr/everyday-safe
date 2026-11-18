const http=require('http'),fs=require('fs'),path=require('path');const R=path.join(__dirname,'..');
module.exports=(port,file='esq-ready.html')=>{const html='<!doctype html><html lang="en-CA"><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">'+fs.readFileSync(path.join(__dirname,file),'utf8')+'</body></html>';
 return http.createServer((q,r)=>{const u=q.url.split('?')[0]; if(u.startsWith('/img/')){const f=path.join(R,u); if(fs.existsSync(f)){r.writeHead(200,{'content-type':'image/webp'}); r.end(fs.readFileSync(f)); return;}}
  if(u==='/data/bank.json'){r.writeHead(200,{'content-type':'application/json'}); r.end(fs.readFileSync(path.join(R,'data','bank.json'))); return;}
  if(u!=='/'){r.writeHead(404); r.end(); return;} r.writeHead(200,{'content-type':'text/html'}); r.end(html);}).listen(port);};
