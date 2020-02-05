// require 的路径是相对当前文件所在文件夹的，其他大部分函数接收的路径都是相对于process.cwd()的
// require中不写路径 程序是不会给他自动加 ./ 或 /的
// 其他大部分函数中不写路径  程序是会自动加 ./的
const obj = require("./01_normalize");


const {resolve} = require("path");
console.log(resolve("a"))
console.log(resolve("./a"))
console.log(resolve("/a"))

console.log(process.execPath)