//系统模块
const {promisify} = require("util");
const {stat,readdir,createReadStream} = require("fs");
const path = require("path");
//第三方模块
const jade = require("jade");
//自定义模块
const config = require("../config");

//promise化
const statP = promisify(stat);
const readdirP = promisify(readdir);
module.exports=async (req,res)=> {
    const absUrl = path.join(config.rootPath, req.url)
    const state = await statP(absUrl);
    if (state.isDirectory()) {
        //吐出目录的列表
        const files = await readdirP(absUrl);
        const obj={
            paths: files,
            dir: req.url === "/"?"": req.url
        }
        const htmlStr = jade.renderFile(`${__dirname}/../jade/dir.jade`, obj)
        res.end(htmlStr)
    } else if (state.isFile()) {
        //吐出文件内容
        res.setHeader("Content-Type","text/javascript;charset=utf-8")
        createReadStream(absUrl).pipe(res)
    }
}