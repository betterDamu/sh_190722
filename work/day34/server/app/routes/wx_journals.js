const Router = require("koa-router");
const wxJournalsRouter = new Router({prefix:"/wx_journals"});
const {getLatest,getNext,getPre} = require("../controllers/wx_journals")


//获取最新一期的期刊
wxJournalsRouter.get("/latest",getLatest)
//获取指定期刊的下一期
wxJournalsRouter.get("/:index/next",getNext)
//获取指定期刊的上一期
wxJournalsRouter.get("/:index/pre",getPre)

module.exports=wxJournalsRouter;