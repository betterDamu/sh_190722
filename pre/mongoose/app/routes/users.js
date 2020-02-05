const Router = require("koa-router");
const jwt = require("koa-jwt")
const usersRouter = new Router({prefix:"/users"});
const {getAll,addUser,getUserById,updateUserById,delUserById,login,upload} = require("../controllers/users")

// const auth = async (ctx,next)=>{
//     const {authorization} = ctx.request.header;
//     try {
//         const user = jsonwebtoken.verify(authorization,"damu");
//         ctx.state.user  = user;
//         await next()
//     }catch (e) {
//         ctx.throw(401,e.message)
//     }
// }

const auth = jwt({secret:"damu",key: 'jwtdata'})
const checkLogin = async (ctx ,next)=>{
    if(ctx.params.id !== ctx.state.jwtdata._id){ctx.throw(403,"拒绝当前操作")}
    await next()
}

usersRouter.get("/",getAll)
usersRouter.post("/",addUser)
usersRouter.post("/login",login)
usersRouter.get("/:id",getUserById)
usersRouter.put("/:id",auth,checkLogin,updateUserById)
usersRouter.del("/:id",auth,checkLogin,delUserById)
usersRouter.post("/upload",upload)
module.exports=usersRouter;