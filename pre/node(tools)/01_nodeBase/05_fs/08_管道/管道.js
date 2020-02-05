const fs = require("fs");
const r = fs.createReadStream("./video/test.dashldaskljl.mp4")
const w = fs.createWriteStream("./video/test2.mp4")
r.pipe(w)