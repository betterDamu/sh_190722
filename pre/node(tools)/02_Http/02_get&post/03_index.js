const http = require("http");
const config = require("./config")
const queryString = require("querystring");
const server = http.createServer((req,res)=>{
    const method = req.method;
    const url = req.url;
    const path = url.split("?")[0];
    const query = url.split("?")[1];
    const result = {
        method,
        url,
        path,
        query:queryString.parse(query)
    }

    res.setHeader("Content-Type","application/json");
    switch (method.toUpperCase()){
        case "GET":
            res.end(JSON.stringify(result));
            break;
        case "POST":
            let postData ="";
            req.on("data",chunk=>{
                postData += chunk.toString();
            })
            req.on("end",()=>{
                result.postData = queryString.parse(postData);
                res.end(JSON.stringify(result));
            })
            break;
    }

});


server.listen(config.port,config.host,()=>{
    console.log("服务启动了")
})
