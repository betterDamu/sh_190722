const http = require("http");
const config = require("./config");
const zlib = require('zlib');
const fs = require("fs");


const server = http.createServer( (req,res)=>{
    res.writeHead(200,"zuimei",{
        "content-type":"text/plain;charset=utf-8",
        "content-encoding":"gzip"
    })
    const gzip = zlib.createGzip();
   const gizpS = fs.createReadStream("./zdy.txt").pipe(gzip);
   gizpS.pipe(res);
});
server.listen(config.port,config.host,()=>{
    console.log(`server is listening on ${config.host}:${config.port}`)
})