const jsonwebtoken = require("jsonwebtoken");
const config = require("../config");
const basicAuth = require('basic-auth');
const usersModel = require("../models/users");
const topicsModel = require("../models/topics");
const questionsModel = require("../models/questions");
const answersModel = require("../models/answers");
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
        ctx.state.question = question;
        await next()
    }

    //判断一下对应的答案是否存在
    async answerExist(ctx,next){
        const answer =   await answersModel.findById(ctx.params.answerId);
        if(!answer){ctx.throw(404,"对应的答案不存在")};
        ctx.state.answer = answer;
        await next()
    }

    //判断一下当前问题是不是属于当前用户
    //依赖于auth
    async questionIsLogin(ctx,next){
        const question =   await questionsModel.findById(ctx.params.id);
        if(ctx.state.user._id !== question.questioner.toString()){
            ctx.throw(401,"当前问题 不属于 当前用户")
        }
        await next()
    }

    //判断一下当前答案是不是当前用户回答的
    async answerIsLogin (ctx,next){
        const answer =   await answersModel.findById(ctx.params.answerId);
        if(ctx.state.user._id !== answer.answer.toString()){
            ctx.throw(401,"当前答案 不属于 当前用户")
        }
        await next()
    }

    //判断一下当前答案是不是属于当前问题
    //answerIsQuestion依赖于questionExist & answerExist
    async answerIsQuestion(ctx,next){
        //ctx.params.id
        // answersModel answerid
        if(ctx.state.question._id.toString() !== ctx.state.answer.questionItem.toString()){
            ctx.throw(401,"当前答案 不属于 当前问题")
        }
        await next()
    }
}

module.exports=new MiddleWares()