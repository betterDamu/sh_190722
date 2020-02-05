const Koa = require("koa");
const bodyParser = require("koa-bodyparser")
const app = new Koa();
const definedRoutes = require("./routes");
const error = require('koa-json-error')
const _ =  require("lodash")
const parameter = require('koa-parameter');

parameter(app);
app.use(error({
    postFormat: (e, obj) => process.env.NODE_ENV === 'production' ? _.omit(obj, 'stack') : obj
}))
app.use(bodyParser());
definedRoutes(app);
app.listen(8080);
