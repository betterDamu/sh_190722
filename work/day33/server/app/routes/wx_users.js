const Router = require("koa-router");
const wxUsersRouter = new Router({prefix:"/wx_users"});
const {getOpenId,saveUserInfo} = require("../controllers/wx_users")


//去微信服务器换取openid
wxUsersRouter.post("/getOpenId",getOpenId)
wxUsersRouter.post("/:uid/saveUserInfo",saveUserInfo)



module.exports=wxUsersRouter;