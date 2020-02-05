const http = require("http");
const jade = require("jade");

http.createServer((message,res)=>{
    const html = jade.render("div #{flag}",{flag:123});
    console.log(typeof html)
    res.end(html);
}).listen(3000)