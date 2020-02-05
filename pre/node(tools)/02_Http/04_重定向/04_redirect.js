const http = require("http");
const fs =require("fs");

const server = http.createServer((message,response)=>{
    if(message.url === "/"){
        response.writeHead(301,"ok",{
            "Location":"/3"
        });
       /* fs.readFile("./04-1.html",(err,data)=>{
            response.end(data);
        })*/
        response.end();
    }else if(message.url === "/2"){
        response.writeHead(200,"ok",{
            "Content-type":"text/html"
        });
        fs.readFile("./04-2.html",(err,data)=>{
            response.end(data);
        })
    }else if(message.url === "/3"){
        response.writeHead(200,"ok",{
            "Content-type":"text/html"
        });
        fs.readFile("./04-3.html",(err,data)=>{
            response.end(data);
        })
    }
});
server.listen(8888,"127.0.0.1",()=>{
    console.log("服务起来了")
})