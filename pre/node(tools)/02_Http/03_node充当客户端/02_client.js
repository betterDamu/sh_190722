const http = require("http");

const buf = Buffer.from("age=12&name=damu");
const clinetRequest = http.request("http://127.0.0.1:1111",(message)=>{
    message.on("data",(data)=>{
        console.log(data.toString());
    })
});

clinetRequest.method="GET";
clinetRequest.setHeader("Content-Type","application/x-www-form-urlencoded");
clinetRequest.setHeader("Content-Length",buf.length);
clinetRequest.end(buf);