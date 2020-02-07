const Router = require("koa-router");
const usersRouter = new Router({prefix:"/users"});
const {getAll,addUser,getUserById,
    updateUserById,delUserById,login,upload} = require("../controllers/users")
const jsonwebtoken = require("jsonwebtoken");
//登录验证
const auth = async (ctx,next)=>{
    const {authorization} = ctx.req.headers;
    console.log(authorization)
    try {
       const user = jsonwebtoken.verify(authorization,"damu");
       ctx.state.user = user;
    }catch (e) {
        ctx.throw(401,"登录信息有问题")
    }
    await next()
}
//权限认证
const access = async (ctx,next)=>{
    console.log("access")
    if(ctx.state.user.id === ctx.params.id){
        await next()
    }else{
        ctx.throw(403,"权限有误")
    }
}

//获取所有用户的 支持分页 支持对name的模糊搜索
usersRouter.get("/",getAll)
//注册用户  支持密码的加盐加密
usersRouter.post("/",addUser)

usersRouter.get("/:id",getUserById)
usersRouter.patch("/:id",auth,access,updateUserById)
usersRouter.del("/:id",auth,access,delUserById)
usersRouter.post("/login",login)
usersRouter.post("/upload",upload)

module.exports=usersRouter;