// 1. 所有的中間件都要定义成async函数!!!
// 2. 所有的next方法一定要await
// 3. 中间件内部的所有异步代码都要包装成promise 而且要await

const Koa = require("koa");
const app = new Koa();
app.use(async (ctx,next)=>{
    console.log(1)
    await next()
    console.log(3)
});
app.use(async (ctx,next)=>{
    await new Promise((reslove)=>{
        setTimeout(()=>{
            console.log(2);
            reslove()
        })
    });
});


app.listen(3000)