const Router = require("koa-router");
const wxUsersRouter = new Router({prefix:"/wx_users"});
const {getOpenId} = require("../controllers/wx_users")


//去微信服务器换取openid
wxUsersRouter.post("/getOpenId",getOpenId)



module.exports=wxUsersRouter;