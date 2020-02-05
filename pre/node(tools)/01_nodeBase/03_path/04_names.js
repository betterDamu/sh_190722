//basename
//extname
//dirname
const {basename,extname,dirname,resolve}=require("path");
const filePath = "../a/b/../c/test.dashldaskljl.min.js";


//相对于文件的   resolve是根据于cwd的
console.log(basename(filePath));
console.log(extname(filePath));
console.log(resolve(dirname(filePath)));

