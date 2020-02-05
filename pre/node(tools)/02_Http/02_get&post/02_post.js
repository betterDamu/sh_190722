const http = require("http");
const config = require("./config")
const queryString = require("querystring");
const server = http.createServer((req,res)=>{
    let postData ="";
    req.on("data",chunk=>{
        postData += chunk.toString();
    })
    req.on("end",()=>{
        req.postData = queryString.parse(postData)
        res.end(JSON.stringify(req.postData));
    })

});
server.listen(config.port,config.host,()=>{
    console.log("服务启动了")
})
