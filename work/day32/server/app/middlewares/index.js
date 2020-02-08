const jsonwebtoken = require("jsonwebtoken");
const config = require("../config");
const basicAuth = require('basic-auth');
const usersModel = require("../models/users");
const topicsModel = require("../models/topics");
const questionsModel = require("../models/questions");
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
    };


    //判断一下关注的用户 取消关注的用户 是否存在
    async followUserExist(ctx,next){
      const user =   await usersModel.findById(ctx.params.id);
      if(!user){ctx.throw(404,"关注的用户不存在")};
      await next()
    }

    //判断一下对应的话题是否存在
    async topicExist(ctx,next){
        const topic =   await topicsModel.findById(ctx.params.id);
        if(!topic){ctx.throw(404,"对应的话题不存在")};
        await next()
    }

    //判断一下对应的问题是否存在
    async questionExist(ctx,next){
        const question =   await questionsModel.findById(ctx.params.id);
        if(!question){ctx.throw(404,"对应的问题不存在")};
        await next()
    }

    //判断一下当前问题是不是属于当前用户
    async questionIsLogin(ctx,next){
        const question =   await questionsModel.findById(ctx.params.id);
        if(ctx.state.user._id !== question.questioner.toString()){
            ctx.throw(401,"当前问题 不属于 当前用户")
        }
        await next()
    }
}

module.exports=new MiddleWares()