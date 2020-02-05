const {readFile,writeFile} = require("fs");
readFile("./txt/damu.txt",(err,buf)=>{
    if(!err){
        writeFile("./txt/damu2.txt",buf,(err)=>{
            if(!err){
                console.log("读写成功")
            }
        })
    }
})