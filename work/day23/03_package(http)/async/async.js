//系统模块
const {promisify} = require("util");
const {stat,readdir,createReadStream} = require("fs");
const path = require("path");
//第三方模块
const jade = require("jade");
//自定义模块
const config = require("../config");
const mimeFn = require("./mime");
const compressFn = require("./compress");

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
        res.writeHead(200,"ok this is dir",{
            'Content-Type': "html"
        })
        res.end(htmlStr)
    } else if (state.isFile()) {
        //吐出文件内容
        //mime类型
        const mineType =  mimeFn(absUrl);
        //实现压缩
        const readStream = createReadStream(absUrl)
        const compressStrem = compressFn(readStream,req,res,absUrl);
        res.writeHead(200,"ok this is file",{
            'Content-Type': mineType
        })
        compressStrem.pipe(res)
    }
}