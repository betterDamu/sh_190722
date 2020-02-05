const http = require("http");
const jade = require("jade");

http.createServer((message,res)=>{
    const html = jade.renderFile("./index.jade",{flag:123});
    res.end(html);
}).listen(3000)