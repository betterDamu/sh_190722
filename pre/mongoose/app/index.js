const path = require("path");
const Koa = require("koa");
const koaBody = require("koa-body");
const definedRoutes = require("./routes");
const error = require('koa-json-error')
const _ =  require("lodash")
const parameter = require('koa-parameter');
const app = new Koa();
require("./db")

app.use(error({
    postFormat: (e, obj) => process.env.NODE_ENV === 'production' ? _.omit(obj, 'stack') : obj
}))
app.use(koaBody({
    multipart:true,
    patchKoa:true,
    patchNode:true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/upload'),
        keepExtensions: true
    }
}));
parameter(app)
definedRoutes(app);
app.listen(8080);
