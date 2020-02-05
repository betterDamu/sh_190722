const {promisify} = require("util")
const {readFile,writeFile} = require("fs");
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

(async function () {
    const  buf = await readFileAsync("./txt/damu.txt")
                  await writeFileAsync("./txt/damu2.txt",buf)
})().catch((err)=>{
    console.log(err)
})

