/*
    1. koa的基本使用
    2. koa核心源码分析
    3. koa路由
    4. koa异常处理
    5. koa参数校验
*/
/*koa路由
    1. 有能力去匹配URL
    2. 有能力去匹配请求方法
    3. 有能力获取客户端携带的数据
        params : ctx.params
        query  : ctx.query
        body   : ctx.request.body(依赖于koa-bodyparser)
        请求头 : ctx.header
    4. 有能力对请求作出响应
        响应状态码;响应header;响应json数据;
            C : 返回新增的数据
            R : 返回想要查询的数据
            U : 返回修改完成的数据
            D : 返回204状态码
*/
const Koa = require("koa");
const bodyParser  = require("koa-bodyparser");
const routes = require("./routes");
const app = new Koa();

app.use(bodyParser());
routes(app);
app.listen(8080,()=>{
    console.log("server is runing on http://127.0.0.1:8080")
});