const Router = require("koa-router");
const wxJournalsRouter = new Router({prefix:"/wx_journals"});
const {getLatest} = require("../controllers/wx_journals")


//去微信服务器换取openid
wxJournalsRouter.get("/latest",getLatest)



module.exports=wxJournalsRouter;