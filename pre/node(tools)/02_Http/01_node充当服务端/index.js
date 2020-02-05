const http = require("http");
const config = require("./config")
const server = http.createServer();

let count =0;
server.on("request",(req,res)=>{
    res.end(`request is comming ${count++}`)
})

server.listen(config.port,config.host,()=>{
    console.log(`serve is listening on http://${config.host}:${config.port}`)
})
