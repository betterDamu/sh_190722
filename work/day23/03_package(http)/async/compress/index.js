const {createGzip,createDeflate} = require("zlib");
const {extname} = require("path");
const config = require("../../config")
module.exports=function (rs,req,res,url) {
    const acceptEncoding = req.headers["accept-encoding"];
    var ext = extname(url).split(".").pop().toLowerCase();
    if(config.compress.test(ext)){
        if(/\bgzip\b/.test(acceptEncoding)){
            const gzipStrem = createGzip();
            res.setHeader("content-encoding","gzip");
            return rs.pipe(gzipStrem);
        }else if(/\bdeflate\b/.test(acceptEncoding)){
            const gzipStrem = createDeflate();
            res.setHeader("content-encoding","deflate");
            return rs.pipe(gzipStrem);
        }else {
            return rs
        }
    }else {
        return rs
    }
}