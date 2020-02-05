const http = require("http");
const fs = require("fs");
const server  = http.createServer((req,res)=>{
    if(req.url==="/"){
        res.writeHead(301,{
            Location:"/b"
        })
        fs.createReadStream("./a.html").pipe(res);
        return
    }else if(req.url==="/b"){
        fs.createReadStream("./b.html").pipe(res);
        return
    }else if(req.url==="/c"){
        fs.createReadStream("./c.html").pipe(res);
        return
    }
    res.end()
})
server.listen(8080,"127.0.0.1")
