const Router = require("koa-router");
const usersRouter = new Router({prefix:"/users"});
const {getAll,addUser,getUserById,
    updateUserById,delUserById,login,upload} = require("../controllers/users")
const {auth,access} = require("../middlewares")


//获取所有用户的 支持分页 支持对name的模糊搜索
usersRouter.get("/",getAll)
//注册用户  支持密码的加盐加密
usersRouter.post("/",addUser)
//根据用户id去找用户
usersRouter.get("/:id",getUserById)
//登录
usersRouter.post("/login",login)
//根据用户id去修改用户
usersRouter.patch("/:id",auth,access,updateUserById)


usersRouter.del("/:id",auth,access,delUserById)

usersRouter.post("/upload",upload)

module.exports=usersRouter;