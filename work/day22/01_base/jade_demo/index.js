const http = require("http");
const jade = require("jade");
const server = http.createServer((req,res)=>{
    // const htmlStr = jade.renderFile("./05_js.jade",{item:"xxxx"});
    const data = {item:"xxxx"}
    const htmlStr = `<a href="#">${data.item}</a>`
    res.end(htmlStr)
})
server.listen(8987,"127.0.0.1")
