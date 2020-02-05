// 1. cookie 小甜品 现代化前端中 cookie一般是有后台种入(前端很少主动的操作cookie了) 5kb
// 2. cookie会随着http请求被发送到服务端
// 3. cookie是有时效的 默认是一个会话级别
// 4. cookie是有限制的 不同域名下的cookie是没有办法共用的

const http = require("http");
const fs = require("fs");
const server  = http.createServer((req,res)=>{
    /*switch (req.headers.host) {
        case "test.com:8080":
            res.setHeader("Set-Cookie","test=test;domain=test.com")
            break;
        case "a.test.com:8080":
            res.setHeader("Set-Cookie","atest=atest;domain=test.com")
            break;
        case "b.test.com:8080":
            res.setHeader("Set-Cookie","btest=btest")
            break;
    }*/
    res.setHeader("Set-Cookie","test=test;path=/a")
    res.end("cookie")
})
server.listen(8080,"127.0.0.1")
