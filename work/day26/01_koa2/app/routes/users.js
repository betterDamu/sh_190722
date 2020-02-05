const Router = require("koa-router");
const usersRouter = new Router({prefix:"/users"});
const {getAll,addUser,getUserById,updateUserById,delUserById} = require("../controllers/users")
usersRouter.get("/",getAll)
usersRouter.post("/",addUser)
usersRouter.get("/:id",getUserById)
usersRouter.put("/:id",updateUserById)
usersRouter.del("/:id",delUserById)
module.exports=usersRouter;