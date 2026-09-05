const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const root = path.resolve(__dirname, '../build');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4','.vtt':'text/vtt','.srt':'text/plain','.md':'text/plain; charset=utf-8'};
http.createServer((req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (!pathname.startsWith('/sciforge-docs/')) { res.writeHead(302,{Location:'/sciforge-docs/'}); return res.end(); }
    let file = path.resolve(root, pathname.slice('/sciforge-docs/'.length) || 'index.html');
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    if (!fs.existsSync(file) && fs.existsSync(file+'.html')) file += '.html';
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
    const {size} = fs.statSync(file);
    const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges':'bytes','Cache-Control':'no-cache'};
    const match = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (match) {
      const start = Number(match[1]), end = match[2] ? Math.min(Number(match[2]),size-1) : size-1;
      if (start > end || start >= size) { res.writeHead(416,{'Content-Range':`bytes */${size}`}); return res.end(); }
      res.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${size}`});
      if (req.method==='HEAD') return res.end();
      fs.createReadStream(file,{start,end}).pipe(res);
    } else {
      res.writeHead(200,{...headers,'Content-Length':size});
      if (req.method==='HEAD') return res.end();
      fs.createReadStream(file).pipe(res);
    }
  } catch { res.writeHead(400); res.end('Bad request'); }
}).listen(Number(process.env.PORT || 3025),'127.0.0.1',() => console.log('Preview: http://127.0.0.1:'+ (process.env.PORT || 3025) +'/sciforge-docs/'));
