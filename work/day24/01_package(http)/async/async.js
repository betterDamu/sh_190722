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
const cacheFn = require("./cache")

//promise化
const statP = promisify(stat);
const readdirP = promisify(readdir);
module.exports=async (req,res,config)=> {
    let absUrl = path.join(config.rootPath, req.url)
    absUrl = decodeURI(absUrl);
    const state = await statP(absUrl);
    console.log(absUrl)
    if (state.isDirectory()) {
        //吐出目录的列表
        const files = await readdirP(absUrl);
        const obj={
            files: files.map((file)=>{
                var ext = path.extname(file).split(".").pop().toLowerCase();
                ext = ext?ext:"dir";
                return {
                    name:file,
                    icon:config.icons[ext]?config.icons[ext]:"icon-wenjian"
                }
            }),
            dir: req.url === "/"?"": req.url
        }
        const htmlStr = jade.renderFile(`${__dirname}/../jade/dir.jade`, obj)
        res.writeHead(200,"ok this is dir",{
            'Content-Type': "text/html;charset=utf-8"
        })
        res.end(htmlStr)
    } else if (state.isFile()) {
        //吐出文件内容
        //mime类型
        const mineType =  mimeFn(absUrl);
        //实现压缩
        const readStream = createReadStream(absUrl)
        const compressStrem = compressFn(readStream,req,res,absUrl);
        //确定是否使用协商缓存
        req.absUrl = absUrl;
        const cacheFlag = await cacheFn(req,res);
        if(cacheFlag){
            res.writeHead(304,"use cache",{
                'Content-Type': mineType,
                "Cache-Control":"no-cache",
                "expires":new Date(Date.now()).toUTCString()
            })
            res.end();
            return ;
        }
        res.writeHead(200,"ok this is file",{
            'Content-Type': mineType
        })
        compressStrem.pipe(res)
    }
}