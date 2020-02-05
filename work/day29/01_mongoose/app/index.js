const Koa = require("koa");
const koaBody = require("koa-body")
const app = new Koa();
const definedRoutes = require("./routes");
const error = require('koa-json-error')
const _ =  require("lodash")
const parameter = require('koa-parameter');
const path = require('path');

//启动一个静态资源服务器
const config =  {
    port:3000,
    host:"127.0.0.1",
    root:"D:\\code\\code1\\上海_19_0722_3\\work\\day29\\01_mongoose\\app\\public"
}
const Server = require("damulaopzdy3");
const server = new Server(config);
server.start()

//连接数据库
require("./db");

parameter(app);
app.use(error({
    postFormat: (e, obj) => process.env.NODE_ENV === 'production' ? _.omit(obj, 'stack') : obj
}))
app.use(koaBody({
    multipart:true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/img'),
        keepExtensions:true
}
}));

definedRoutes(app);
app.listen(8080);
