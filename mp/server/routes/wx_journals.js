const Router = require("koa-router");
const WXJournalsRouter = new Router({prefix:"/wx_journals"});
const {getLatest,getNext,getPre,getFavs} = require("../controllers/wx_journals");
const {auth,journalExist} = require("../middlewares/wx_index");


WXJournalsRouter.get("/latest",auth,getLatest)
WXJournalsRouter.get("/:index/next",auth,getNext)
WXJournalsRouter.get("/:index/pre",auth,getPre)
WXJournalsRouter.get("/:id/favs",auth,journalExist,getFavs)



module.exports=WXJournalsRouter;