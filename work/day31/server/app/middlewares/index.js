const jsonwebtoken = require("jsonwebtoken");
class MiddleWares {
    //登录验证
    async auth(ctx,next){
        const {authorization} = ctx.req.headers;
        console.log(authorization)
        try {
            const user = jsonwebtoken.verify(authorization,"damu");
            ctx.state.user = user;
        }catch (e) {
            ctx.throw(401,"登录信息有问题")
        }
        await next()
    };

    //权限认证 判断当前登录的用户 和 当前需要修改用户是不是同一个
    //如果是同一个 允许修改
    //如果不是同一个 不允许修改
    //access依赖于auth
    async access(ctx,next){
        if(ctx.state.user._id === ctx.params.id){
            await next()
        }else{
            ctx.throw(403,"权限有误")
        }
    }
}

module.exports=new MiddleWares()