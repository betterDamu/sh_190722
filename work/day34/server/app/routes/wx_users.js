const Router = require("koa-router");
const wxUsersRouter = new Router({prefix:"/wx_users"});
const {getOpenId,saveUserInfo,like,unlike} = require("../controllers/wx_users")
const {auth} = require("../middlewares/wx_index")


//去微信服务器换取openid
wxUsersRouter.post("/getOpenId",getOpenId)
wxUsersRouter.post("/:uid/saveUserInfo",saveUserInfo)

//点赞指定期刊 id:期刊的id
//只有用户登录过了才能进行点赞
wxUsersRouter.put("/:id/like",auth,like)
//取消点赞指定期刊
wxUsersRouter.del("/:id/like",auth,unlike)
//列出用户点赞过的期刊



module.exports=wxUsersRouter;