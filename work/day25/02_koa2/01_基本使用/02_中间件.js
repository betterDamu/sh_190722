//1. 在koa中中间件就是一个回调函数
//2. koa中的中间件接受两个参数
//     ctx : koa的上下文
//     next: 下一个中间件
//3. 默认在koa中第一个中间件是被自动调用的
//4 我们可以使用ues方法来不断的注册中间件

const Koa = require("koa");
const app = new Koa();

//中间件的注册!!!
app.use((ctx,next)=>{
   console.log(1)
   next()
   console.log(2)
})
app.use((ctx,next)=>{
    console.log(3)
    next()
    console.log(4)
})

//
app.listen(8080,"127.0.0.1",()=>{
    console.log("server is runing")
})