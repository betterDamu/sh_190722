const fs = require("fs");
const RS = fs.createReadStream("./damu.txt")
const WS = fs.createWriteStream("./damu2.txt")
RS.pipe(WS)