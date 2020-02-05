const {open,read,write,close} = require("fs");
const {promisify} = require("util");
const openAsync =  promisify(open);
const readAsync =  promisify(read);
const writeAsync =  promisify(write);
const closeAsync =  promisify(close);

(async function () {
    let buf = Buffer.alloc(100,0);

    const fd =  await openAsync("./txt/damu.txt","r");
                 await readAsync(fd,buf,0,buf.length,0);
                 await closeAsync(fd);

    const fd2 =  await openAsync("./txt/damu2.txt","w");
                  await writeAsync(fd2,buf,0,buf.length,0);
                  await closeAsync(fd2);
})().catch((err)=>{
    console.log("读写失败",err)
})




