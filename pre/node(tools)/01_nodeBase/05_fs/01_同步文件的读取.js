// 1. 打开文件
// 2. 读取文件
// 3. 关闭文件
const fs = require("fs");
let fd = fs.openSync("./txt/damu.txt","r");
let buf = Buffer.alloc(68,0)
let bytesReadfs =  fs.readSync(fd,buf,0,68,0)
console.log(bytesReadfs,buf.length,buf.toString())
fs.closeSync(fd)

