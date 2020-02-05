/*koa异常处理
    500 : 服务端错误
    404 : 资源未找到
    412 : 先决条件失败
    422 : 参数格式不对
*/
const Koa = require("koa");
const bodyParser  = require("koa-bodyparser");
const error = require("koa-json-error");
const parameter = require("koa-parameter");
const _ = require("lodash");
const routes = require("./routes");
const app = new Koa();

app.use(error({
    postFormat:(e, obj) => process.env.NODE_ENV === 'production' ? _.omit(obj, 'stack') : obj
}));
app.use(parameter(app));
app.use(bodyParser());
routes(app);
app.listen(8080,()=>{
    console.log("server is runing on http://127.0.0.1:8080")
});