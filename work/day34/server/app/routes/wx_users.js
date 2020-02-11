const Router = require("koa-router");
const wxUsersRouter = new Router({prefix:"/wx_users"});
const {getOpenId,saveUserInfo,like,unlike,listJournalsLikes} = require("../controllers/wx_users")
const {auth,journalExist} = require("../middlewares/wx_index")


//去微信服务器换取openid
wxUsersRouter.post("/getOpenId",getOpenId)
wxUsersRouter.post("/:uid/saveUserInfo",saveUserInfo)

//点赞指定期刊 id:期刊的id
//只有用户登录过了才能进行点赞
//取消点赞指定期刊
wxUsersRouter.put("/:id/like",auth,journalExist,like)
wxUsersRouter.del("/:id/like",auth,journalExist,unlike)
//列出用户点赞过的期刊  我们觉得这是用户的私密数据 不要把他设计一个公开的接口
wxUsersRouter.get("/journalsLikes",auth,listJournalsLikes)
//列出指定期刊的点赞数量


module.exports=wxUsersRouter;