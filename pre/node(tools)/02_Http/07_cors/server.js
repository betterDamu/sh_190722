//系统模块
const http = require("http");
const data = require("./data/data");

http.createServer((req,res)=>{
    let arr = ["http://localhost:63342",'http://127.0.0.1:63342'];
    console.log( arr.findIndex( item => item === req.headers.origin) ,req.headers.origin)
    if(arr.findIndex( item => item === req.headers.origin) !== -1 ){
        res.setHeader("Access-Control-Allow-Origin",req.headers.origin)
    }
    if(req.url==="/"){
        res.writeHead(200,"ok",{
            "Content-Type":"application/json"
        })
        res.end(JSON.stringify(data));
    }
}).listen(8000,"127.0.0.1",()=>{
    console.log(`server is runing on 127.0.0.1:8000`);
})
