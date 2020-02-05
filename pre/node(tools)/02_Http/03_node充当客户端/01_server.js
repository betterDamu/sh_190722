const http = require("http");
const config = require("./config/config");
const server = http.createServer((message,res)=>{
    message.on("data",(data)=>{
        console.log(data.toString(),message.method)
    })
    res.end("damu");
});
server.listen(config.port,config.host,()=>{
    console.log(`server is runing on ${config.host}:${config.port}`);
})
