const http = require("http");
const fs =require("fs");

const server = http.createServer((message,response)=>{
    const host =  message.headers.host;
    if(message.url === "/"){
        if(host === "a.damu.com:8000"){
            response.setHeader("Set-Cookie",["aTestName=123;domain=damu.com"])
        }
        if(host === "b.damu.com:8000"){
            response.setHeader("Set-Cookie",["bTestName=123"])
        }
        if(host === "damu.com:8000"){
            response.setHeader("Set-Cookie",["testName=123;domain=damu.com"])
        }

        response.writeHead(200,"ok",{
            "Content-type":"text/html",
        });
        fs.readFile("./08_Cookie.html",(err,data)=>{
            response.end(data);
        })
    }
});
server.listen(8000,"127.0.0.1",()=>{
    console.log("服务起来了")
})