const http = require("http");
const fs = require("fs");
const server  = http.createServer((req,res)=>{
    res.setHeader("Connection","close")
    if(req.url==="/"){
        fs.createReadStream("./index.html").pipe(res);
    }else {
        fs.createReadStream("./img/favicon.png").pipe(res);
    }
})
server.listen(8080,"127.0.0.1")
