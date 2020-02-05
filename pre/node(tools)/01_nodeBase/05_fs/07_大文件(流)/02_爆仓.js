const fs = require("fs");
const r = fs.createReadStream("./test.dashldaskljl.mp4");
const w = fs.createWriteStream("./test3.mp4");

r.on("data",(data)=>{
    if( !w.write(data)){
        // 可读流停下来
        r.pause();
    }
})
w.on("drain",()=>{
    r.resume();
})

r.on("end",()=>{
    w.end();
})



