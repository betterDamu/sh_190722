// 完成context对response和request的代理
const Koa = require("koa");
//建立ctx关系图的右半部分
const app = new Koa();
//注册中间件
app.use((ctx)=>{
    ctx.body = "hello koa"
})
//启动服务
app.listen(8080)