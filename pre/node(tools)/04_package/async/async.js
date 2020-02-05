const fs = require("fs");
const promisify = require("util").promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const jade = require("jade");
// const config = require("../config/config");
const path = require("path");
const mineFn = require("./01_mine/mine.js");
const compressFn = require("./02_compress/compress.js");
const cacheFn = require("./03_cache/cache.js");

module.exports=async function (message,res,filePath,config) {
    try {
        const stats = await stat(filePath);
        if(stats.isFile()){
            let mineType = mineFn(filePath);
            if(cacheFn(stats,message,res)){
                res.writeHead(304,"cache",{
                    "Content-type":mineType
                })
                res.end()
                return;
            }


            let streamR = fs.createReadStream(filePath);

            res.writeHead(200,"ok",{
                "Content-type":mineType
            })
            streamR.pipe(res)
        }else if(stats.isDirectory()){
            res.writeHead(200,"ok",{
                "Content-type":"text/html"
            })
            const files = await readdir(filePath);
            const dir = path.relative(config.root,filePath);
            const obj={
               dir: dir===""?"":"/"+dir,
               files,
            }
            const str = jade.renderFile("./jade/app.jade", obj)
            res.end(str);
        }
    }catch (e) {
        res.writeHead(404,"not find",{
            "Content-type":"text/plain"
        })
        res.end("404 file not find"+e);
    }
}