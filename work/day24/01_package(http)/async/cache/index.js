const etag = require("etag");
const {stat,readFile} = require("fs");
const {promisify} = require("util");
const statP = promisify(stat)
const readFileP = promisify(readFile)
const {cache} = require("../../config")

function setHeader(res,lastModified,ETag){
    const maxAge = cache["max-age"];
    if(cache.expires && maxAge){
        res.setHeader("expires",new Date(Date.now() + maxAge*1000).toUTCString())
    }
    if(cache["cache-control"]&&maxAge){
        res.setHeader("Cache-Control",`max-age=${maxAge}`)
    }
    if(cache["last-modified"]){
        res.setHeader("last-modified",lastModified)
    }
    if(cache["etag"]){
        res.setHeader("ETag",ETag)
    }
}

//提供一个布尔值  这个布尔值代表我们当前这个环境是否需要使用协商缓存
module.exports=async function (req,res) {
    const state = await statP(req.absUrl);
    const lastModified = new Date(state.mtime).toUTCString()
    const ifModifiedSince = req.headers["if-modified-since"];
    const body = await readFileP(req.absUrl);
    const ETag = etag(body);
    const ifNoneMatch = req.headers["if-none-match"];
    //設置响应头
    setHeader(res,lastModified,ETag);
    return  (ifModifiedSince===lastModified || ifNoneMatch===ETag)
}