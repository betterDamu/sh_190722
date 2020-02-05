const http = require("http");
const fs =require("fs");

const server = http.createServer((message,response)=>{
    if(message.url === "/"){
        response.writeHead(200,"ok",{
            "Content-type":"text/html",
            // "Set-Cookie":"id=123"
            "Set-Cookie":["id=123","name=damu","age=18;HttpOnly"]
        });
        fs.readFile("./08_Cookie.html",(err,data)=>{
            response.end(data);
        })
    }
});
server.listen(8888,"127.0.0.1",()=>{
    console.log("服务起来了")
})