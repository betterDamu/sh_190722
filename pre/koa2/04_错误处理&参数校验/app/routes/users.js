const Router = require("koa-router");
const usersRouter = new Router({prefix: '/users'});
const {getUsers,getUserById,addUser,updateUserById,delUserById} = require("../controllers/users")

usersRouter.get("/",getUsers)
usersRouter.post("/",addUser)
usersRouter.get("/:id",getUserById)
usersRouter.put("/:id",updateUserById)
usersRouter.del("/:id",delUserById)

module.exports=usersRouter;