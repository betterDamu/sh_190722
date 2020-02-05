const fs = require("fs");
const util = require("util");
const readDirP = util.promisify(fs.readdir)
module.exports= async function (app) {
    const pathArr = await readDirP(__dirname);
    pathArr.forEach((path)=>{
        if(path==="index.js"){return;}
        let router = require(`./${path}`)
        app.use(router.routes()).use(router.allowedMethods());
    })
}