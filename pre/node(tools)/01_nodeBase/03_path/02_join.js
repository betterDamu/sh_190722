const {join,resolve} = require("path");
const  path1="/a/b/";
const  path2="/c/d/";
console.log(resolve(join(path1,path2)));