const {extname} = require("path");
const mineType = {
    "css":"text/css",
    "gif":"image/gif",
    "html":"text/html;charset=utf-8",
    "ico":"image/x-icon",
    "jpeg":"image/jpeg",
    "jpg":"image/jpeg",
    "js":"text/javascrip;charset=utf-8",
    "json":"application/json;charset=utf-8",
    "pdf":"application/pdf",
    "png":"image/png",
    "svg":"image/svg+xml",
    "swf":"application/x-shockwave-flash",
    "tiff":"image/tiff",
    "txt":"txt/plain;charset=utf-8",
    "wav":"audio/x-wav",
    "wma":"audio/x-ms-wma",
    "wmv":"video/x-ms-wmv",
    "xml":"text/xml",
}

module.exports=(filePath)=>{
    let extName = extname(filePath).split(".").pop().toLowerCase();

    if(! extName){
        extName = filePath;
    }


    return mineType[extName] || mineType["txt"]
}