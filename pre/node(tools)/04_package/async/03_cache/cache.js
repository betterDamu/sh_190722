const {cache} = require("../../config/config.js");
const etagfn = require('etag')

function set(states,res) {
    const {maxAge,expires,cacheControl,lastModified,etag} = cache;
    if(expires){
        res.setHeader('Expires',(new Date(Date.now() + maxAge*1000)).toUTCString() )
    }
    if(cacheControl){
        res.setHeader('Cache-Control',`max-age=${maxAge}`);
    }
    if(lastModified){
        res.setHeader('Last-Modified',states.mtime.toUTCString())
    }
    if(etag){
       res.setHeader('ETag',etagfn(states))
    }
}

module.exports=function (states,req,res) {
    set(states,res);

    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];

    if(!lastModified && !etag){
        return false;
    }

    if(lastModified && lastModified !==res.getHeader('Last-Modified')){
        return false;
    }

    if(etag && etag !==res.getHeader('ETag')){
        return false;
    }

    return true;
}