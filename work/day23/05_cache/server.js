const http = require("http");
const config = require("./config");
const fs = require("fs");
const {promisify} = require("util");
const statP = promisify(fs.stat);
const readFileP = promisify(fs.readFile);
const etag = require('etag')
const server = http.createServer(async (req,res)=>{
   if(req.url === "/zdy"){
       const rs = fs.createReadStream("./zdy.txt");
       const state = await statP("./zdy.txt");
       const lastModified = new Date(state.mtime).toUTCString()
       const ifModifiedSince = req.headers["if-modified-since"];
       const body = await readFileP("./zdy.txt");
       const ETag = etag(body);
       const ifNoneMatch = req.headers["if-none-match"];
       if(ifModifiedSince===lastModified || ifNoneMatch===ETag){
           res.writeHead(304,"use cacahe",{
               "Cache-Control":"no-cache",
               "last-modified":lastModified,
               "ETag":ETag
           });
           res.end()
       }else {
           res.writeHead(200,"ok ok ok",{
               expires:new Date(Date.now() + 24*60*60*1000).toUTCString(),
               "Cache-Control":"max-age=5",
               "last-modified":lastModified,
               "ETag":ETag
           })
           rs.pipe(res);
       }

       return;
   }
   res.end()
});
server.listen(config.port,config.host,()=>{
    console.log(`server is listening on http://${config.host}:${config.port}`)
})