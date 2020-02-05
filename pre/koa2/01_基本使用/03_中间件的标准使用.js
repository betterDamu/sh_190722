const Koa = require("koa");
const app = new Koa();
app.use(async (ctx,next)=>{
    console.log("1-start")
    var res = await next()
    console.log("1-end",res)
})
app.use(async (ctx,next)=>{
    await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log("2-start");
            resolve();
        },2000)
    })
    ctx.body = "hello koa"
    console.log("2-end");
    return "damu"
})
app.listen(3000)