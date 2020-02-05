const http = require("http");
const fs =require("fs");

const server = http.createServer((message,response)=>{
    const data = fs.readFileSync("./06_csp.html");
    if(message.url === "/"){
        response.writeHead(200,"ok",{
            "Content-type":"text/html",
            // "Content-Security-Policy":"script-src http: https:"
            "Content-Security-Policy":"script-src 'self'"
            // "Content-Security-Policy":"default-src 'self';form-action 'self'"
        });
        response.end(data);
    }else {
        response.writeHead(200,"ok",{
            "Content-type":"application/x-javascript"
        });
        response.end("console.log('我是外联脚本')");
    }
});

server.listen(8000,"127.0.0.1",()=>{
    console.log("服务起来了")
})