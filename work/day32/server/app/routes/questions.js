const Router = require("koa-router");
const questionsRouter = new Router({prefix:"/questions"});
const {getAllQuestions,getQuestionById,addQuestion,
    updateQuestionById,delQuestionById} = require("../controllers/questions")
const {auth,questionExist,questionIsLogin} = require("../middlewares/index")


questionsRouter.get("/",getAllQuestions)
questionsRouter.get("/:id",questionExist,getQuestionById)


questionsRouter.post("/",auth,addQuestion)

//修改 和 删除问题的时候 不能只简单的判断一下问题是否存在
// 我们还得考虑 当前这个问题 是不是属于你当前这个登录用户的
questionsRouter.patch("/:id",auth,questionExist,questionIsLogin,updateQuestionById)
questionsRouter.del("/:id",auth,questionExist,questionIsLogin,delQuestionById)





module.exports = questionsRouter;