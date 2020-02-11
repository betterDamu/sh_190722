const jsonwebtoken = require("jsonwebtoken");
const journalsModel = require("../models/wx_journals")
const wxUsersModel = require("../models/wx_users")
class Middleware {
    async auth(ctx,next){
        let {authorization} = ctx.req.headers;
        try {
            const user = jsonwebtoken.verify(authorization,"damu");
            ctx.state.user = user;
        }catch (e) {
            ctx.throw(401,"登录信息有问题")
        }
        await next()
    };

    async journalExist(ctx,next){
        const journal =   await journalsModel.findById(ctx.params.id);
        if(!journal){ctx.throw(404,"对应的期刊不存在")};
        await next()
    }

    async wx_userExist(ctx,next){
        const user =   await wxUsersModel.findById(ctx.params.id);
        if(!user){ctx.throw(404,"对应的用户不存在")};
        await next()
    }
}

module.exports=new Middleware();