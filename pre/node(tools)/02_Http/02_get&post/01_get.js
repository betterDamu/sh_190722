const http = require("http");
const config = require("./config")
const queryString = require("querystring");
const server = http.createServer((req,res)=>{
    const url = req.url;
    const path = url.split("?")[0];
    const query = url.split("?")[1];
    req.query = queryString.parse(query)
    res.end(JSON.stringify(req.query));
});
server.listen(config.port,config.host,()=>{
    console.log("服务启动了")
})
