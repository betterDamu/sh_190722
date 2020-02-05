// cwd : node命令执行的目录!!!!
// 在node当中除了模块化相关的路径 其他路径都参照于cwd
// process.cwd方法返回的是node命令执行的目录!!!
const path = require("path")
console.log(process.cwd())
console.log(__dirname,__filename)
console.log(path.resolve("./"))