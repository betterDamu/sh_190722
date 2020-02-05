
const {parse,format}=require("path");
const filePath = "/a/b/../c/test.dashldaskljl.js";


//相对于文件的   resolve是根据于cwd的
console.log(parse(filePath));
console.log(format(parse(filePath)));


