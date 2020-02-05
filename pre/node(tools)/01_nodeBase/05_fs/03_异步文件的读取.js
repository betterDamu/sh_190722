// 1. 打开文件
// 2. 读取文件
// 3. 关闭文件
const fs = require("fs");


fs.open("./txt/damu.txt","r",(err,fd)=>{
    let buf = Buffer.alloc(100,0)
    fs.read(fd,buf,0,buf.length,0,(err,bytesRead,buffer)=>{
        console.log(bytesRead,buffer.toString())
        fs.close(fd, (err)=>{
            console.log("读取完成")
        })
    })
})



