const Router = require("koa-router");
const wxUsersRouter = new Router({prefix:"/wx_users"});
const {getOpenId,saveUserInfo,like,unlike,listJournalsLikes} = require("../controllers/wx_users");
const {auth,journalExist,wx_userExist} = require("../middlewares/wx_index");


//去微信服务器换取openid
wxUsersRouter.post("/getOpenId",getOpenId)
wxUsersRouter.post("/:uid/saveUserInfo",saveUserInfo)
wxUsersRouter.put("/:id/like",auth,journalExist,like)
wxUsersRouter.del("/:id/like",auth,journalExist,unlike)
wxUsersRouter.get("/journalsLikes",auth,listJournalsLikes)


module.exports=wxUsersRouter;