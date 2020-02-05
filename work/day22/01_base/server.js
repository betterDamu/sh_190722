const http = require("http");
const config = require("./config");
/*
    req:IncomingMessage 可读流
        req : 请求报文(请求头 + 请求体)
        res : 响应报文(响应头 + 响应体)
    res:ServerResponse  可写流
*/
const server = http.createServer((req,res)=>{
    req.on("data",(data)=>{
        console.log(data.toString());
    })
    res.end("====")
});
server.listen(config.port,config.host,()=>{
    console.log(`server is listening on ${config.host}:${config.port}`)
})