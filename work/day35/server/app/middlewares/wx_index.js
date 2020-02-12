const journalsModel = require("../models/wx_journals");
const jsonwebtoken = require("jsonwebtoken");
const config = require("../config");
const basicAuth = require('basic-auth');
class MiddleWares {
    //登录验证
    async auth(ctx,next){
        try {
            const token = basicAuth(ctx.req).name;
            const user = jsonwebtoken.verify(token,config.tokenKey);
            ctx.state.user = user;
        }catch (e) {
            ctx.throw(401,"登录信息有问题")
        }
        await next()
    };

    //判断期刊是否存在
    async journalExist(ctx,next){
        const journal = await journalsModel.findById(ctx.params.id);
        if(!journal){ctx.throw(404,"期刊不存在")}
        await next()
    }
}

module.exports=new MiddleWares()