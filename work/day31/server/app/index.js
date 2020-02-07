/*
    1. 将damulaopzdy静态资源服务器换成了koa-static
    2. 将自己实现的后台路由的批量注册功能 换成了require-directory的形式
*/

const Koa = require("koa"); // 基于nodejs的web框架(启服务 可插拔的 轻量级 学习成本比较高  性能高)
const app = new Koa();
const koaBody = require("koa-body")//有能力获取到body中数据
const error = require('koa-json-error')//处理错误
const _ =  require("lodash")//常用的ECMAScript库
const parameter = require('koa-parameter');//参数的校验
const path = require('path');//node中路径模块
const serve = require('koa-static'); // koa提供的静态资源服务器
const requireDirectory = require('require-directory');//获取一个目录底下所有文件暴露出来的模块
const Router = require("koa-router");//后台路由


require("./db");//连接数据库
app.use(serve(__dirname + '/public'));//启动一个静态资源服务器
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
//实现了后台路由的批量注册
requireDirectory(module,"./routes",{visit:(route)=>{
    if(route instanceof Router){
        //allowedMethods : 预请求(options) 返回接口所支持的http方法
        app.use(route.routes()).use(route.allowedMethods())
    }
}})


app.listen(8080);//启动服务
