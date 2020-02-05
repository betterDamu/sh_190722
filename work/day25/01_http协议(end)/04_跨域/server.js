const http = require("http");
const fs = require("fs");
const server  = http.createServer((req,res)=>{
    let arr = ["http://localhost:8080","http://localhost:63342"]
    if(arr.findIndex(item=> item === req.headers.origin) !== -1){
        res.setHeader("Access-Control-Allow-Origin",req.headers.origin)
    }
    if(req.url==="/getData"){
        res.writeHead(200,"ok",{
            "Access-Control-Allow-Headers":"x-damu",
            "Access-Control-Allow-Methods":"PUT",
            "Access-Control-Max-Age":30
        })
        res.end(JSON.stringify({
            id:1,
            name:"damu"
        }))
    }else {
        fs.createReadStream("./index.html").pipe(res)
    }
})
server.listen(8080,"127.0.0.1")
