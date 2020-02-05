const Koa = require("koa");
const app = new Koa();
app.use(async (ctx,next)=>{
   console.log(1)
   await next()
   console.log(2)
})
app.use(async (ctx,next)=>{
    await new Promise((reslove)=>{
        setTimeout(()=>{
            console.log(3);
            reslove()
        })
    })
    await next()
    console.log(4)
})
app.listen(8080)