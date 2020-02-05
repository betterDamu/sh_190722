const fs = require("fs");
const util = require("util");
const readDirP = util.promisify(fs.readdir);
module.exports=async function (app) {
    const paths = await readDirP(__dirname);
    paths.forEach((path)=>{
        if(path === 'index.js') return
        let router = require(`./${path}`);
        app.use(router.routes()).use(router.allowedMethods())
    })
}