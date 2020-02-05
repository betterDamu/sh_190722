//系统模块
const {promisify} = require("util");
const {stat,readdir,createReadStream} = require("fs");
const statP = promisify(stat);
const readdirP = promisify(readdir);
const path = require("path");
const http = require("http");
//第三方模块
const jade = require("jade");
//自定义模块
const config = require("./config");
const server = http.createServer(async (message,res)=>{
    try {
        const absUrl = path.join(config.rootPath,message.url)
        const state = await statP(absUrl);
        if(state.isDirectory()){
            //吐出目录的列表
            const  files = await readdirP(absUrl);
            const htmlStr = jade.renderFile(`${__dirname}/jade/dir.jade`,{paths:files})
            res.end(htmlStr)
        }else if(state.isFile()){
            //吐出文件内容
            createReadStream(absUrl).pipe(res)
        }
    }catch (e) {
        res.end(e.message)
    }
})
server.listen(config.port,config.host,()=>{
    console.log(`server is runing on http://${config.host}:${config.port}`)
})