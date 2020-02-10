const Router = require("koa-router");
//id: 问题的id
//对嵌套路由做任何操作之前都有考虑 上一级路由是否安全
const answersRouter = new Router({prefix:"/questions/:id/answers"});
const {getAllAnswers,getAnswerById,addAnswer,
    updateAnswerById,delAnswerById} = require("../controllers/answers")
const {auth,questionExist,answerIsQuestion,
    answerExist , answerIsLogin} = require("../middlewares/index")


//问题存在 才有机会去拿到问题的所有答案
answersRouter.get("/",questionExist,getAllAnswers)
//1. 保证对应的问题是存在的  2.保证当前查询的答案是属于当前问题
answersRouter.get("/:answerId",questionExist,answerExist,
    answerIsQuestion,getAnswerById)

//回答问题之前 要判断问题是否存在 当前用户是可以回答其他用户的问题的!!!
answersRouter.post("/",auth,questionExist,addAnswer)
//修改答案  只能修改自己的答案
answersRouter.patch("/:answerId",auth,questionExist,answerExist,
    answerIsLogin,updateAnswerById)
//删除答案 只能删除自己的答案
answersRouter.del("/:answerId",auth,questionExist,answerExist,
    answerIsLogin,delAnswerById)


module.exports = answersRouter;