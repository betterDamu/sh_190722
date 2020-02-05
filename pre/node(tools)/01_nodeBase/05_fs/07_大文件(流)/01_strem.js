const fs = require("fs");
const readS = fs.createReadStream("./video/test.dashldaskljl.mp4");
const writeS = fs.createWriteStream("./video/test2.mp4");


readS.on("data",(data)=>{
    writeS.write(data)
})

readS.on("end",()=>{
    writeS.end()
})