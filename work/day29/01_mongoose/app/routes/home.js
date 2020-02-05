const Router = require("koa-router");
const homeRouter = new Router({prefix:"/home"});
const {index} = require("../controllers/home")
homeRouter.get("/",index);
module.exports=homeRouter;