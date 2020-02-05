const Koa = require("koa");  // Koa是一个class
const app = new Koa();
app.use((ctx)=>{             // use方法只是将对应的回调函数收集到一个数组中
    ctx.body = "hello koa"
})
app.listen(3000)