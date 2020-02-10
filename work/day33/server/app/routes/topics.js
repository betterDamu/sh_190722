const Router = require("koa-router");
const topicsRouter = new Router({prefix:"/topics"});
const {getAllTopics,getTopicById,addTopic,
    updateTopicById,delTopicById,
    listTopicFollowers,listQuestions} = require("../controllers/topics")
const {topicExist} = require("../middlewares/index")

// 查询: 公开的,不需要业务校验(除非数据是敏感数据)
// 非查询: 业务上要做校验


//get  http://127.0.0.1:8080/topics : 获取所有的话题
topicsRouter.get("/",getAllTopics)
//get  http://127.0.0.1:8080/topics/123 : 按照指定的id去寻找话题
topicsRouter.get("/:id",topicExist,getTopicById)


//话题的设计上 我们简单一点 非查询类的接口上 我们也不做业务校验
//post http://127.0.0.1:8080/topics : 新建话题
topicsRouter.post("/",addTopic)
//patch http://127.0.0.1:8080/topics/123 : 按照指定的id去修改话题
topicsRouter.patch("/:id",topicExist,updateTopicById)
//del   http://127.0.0.1:8080/topics/123 : 按照指定的id去删除话题
topicsRouter.del("/:id",topicExist,delTopicById)

//获取话题的关注者 id:话题
topicsRouter.get("/:id/followers",topicExist,listTopicFollowers)

//获取指定话题的问题列表
topicsRouter.get("/:id/questions",topicExist,listQuestions)

module.exports = topicsRouter;