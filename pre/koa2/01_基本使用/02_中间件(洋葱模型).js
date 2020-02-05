const Koa = require("koa");
const app = new Koa();
app.use((ctx,next)=>{
    ctx.body="hello koa1"
    next() // koa中默认只会执行第一个中间件 余下中间件的执行都要通过next方法进行触发
})
app.use((ctx,next)=>{
    ctx.body += "hello koa2"
})
app.listen(3000)


//如何保证洋葱模型?