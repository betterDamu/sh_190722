// 1. 打开文件   打开文件
// 2. 读取文件   写入文件
// 3. 关闭文件   关闭文件
const fs = require("fs");

//读
let fd = fs.openSync("./txt/damu.txt","r");
let buf = Buffer.alloc(68,0)
let bytesReadfs =  fs.readSync(fd,buf,0,68,0)
fs.closeSync(fd)

let fd2 = fs.openSync("./txt/damu2.txt","w");
fs.writeSync(fd2,buf,0,buf.length,0)




