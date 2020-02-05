const http = require("http");
const fs = require("fs");
const server  = http.createServer((req,res)=>{
    res.setHeader("Connection","close")
    if(req.url==="/"){
        res.writeHead(200,{
            "Content-Security-Policy":"script-src 'self'"
        })
        fs.createReadStream("./index.html").pipe(res);
        return ;
    }else {
        res.writeHead(200,{
            "Content-Type":"text/javascript;charset=utf-8"
        })
        res.end("console.log(456)")
    }

})
server.listen(8080,"127.0.0.1")
