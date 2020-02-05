const {exists,stat,unlink,readdir,truncate,mkdir,rmdir,rename} = require("fs");

/*
exists("/damu.txt",(flag)=>{
    console.log(flag)
})
stat("./damu.txt",(err,stat)=>{
    console.log(stat.isDirectory())
})
unlink("./damu.txt",(err)=>{
    console.log(err)
})
readdir("/code",(err,dirs)=>{
    console.log(dirs)
})
truncate("./index.txt",3,()=>{

})
mkdir("./a",(err)=>{
    mkdir("./a/b",(err)=>{

    })
})

rmdir("./a/b",()=>{
    rmdir("./a",()=>{

    })
})
*/
rename("./index2.js","./xfz.js",()=>{})