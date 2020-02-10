const usersModel = require("../models/users");
const questionsModel = require("../models/questions");
const answersModel = require("../models/answers");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config")
class Users {

    async getAll(ctx){
        //分页功能  模糊搜索
        let {pre_page=10,page=1,q=""} = ctx.query;
        pre_page = Math.max(+pre_page,1);
        page = Math.max(+page,1);
        //第一页: 跳过0条  返回10条
        //第二页: 跳过10条 返回下10条
        ctx.body=await usersModel.find({name:new RegExp(q)}).skip((page-1)*pre_page).limit(pre_page)
    };

    async addUser(ctx){
        //对body中的数据进行一次校验
        ctx.verifyParams({
            name: {type:"string",required :true},
            password: {type:"string",required :true},
            gender:{type:'string',required:true},
            avatarUrl:{type:"string",required:false},
            headline:{type:"string",required:false},
            business:{type:"string",required:false},
            locations:{type:"array",itemType:"string",required:false},
            employments:{type:"array",itemType:"object",required:false},
            educations:{type:"array",itemType:"object",required:false}
        });

        //body中的数据通过校验之后 再拿到它
        //拿到name后继续进行业务校验 不允许出现相同用户名的用户
        let name = ctx.request.body.name;
        let data = await usersModel.findOne({name});
        if(data) {ctx.throw(409,"用户名已注册")}

        //拿到密码 进行加盐加密
        let password = ctx.request.body.password;
        let salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);

        //拿性别
        let gender = ctx.request.body.gender;

        ctx.request.body.password = password;

        //进行入库
        let user = await usersModel.create(ctx.request.body);

        //注册成功之后返回的数据不包含密码
        let newUser = await usersModel.findById(user._id);
        ctx.body = newUser;
    };

    async getUserById(ctx){
        //locations;;employments;educations
        //[ 'locations', '', 'employments', 'educations' ]
        //[ 'locations', 'employments', 'educations' ]
        //[ '+locations', '+employments', '+educations' ]
        //+locations +employments +educations
        const {fields} = ctx.query;
        const selectFields =
                fields.split(";").filter(item=>item)
                    .map(item=>`+${item}`).join(" ");
        console.log(selectFields)
        let id = ctx.params.id;
        let user = await usersModel.findById(id).select(selectFields)
                                    .populate("followingTopics likeAnswers disLikeAnswers");
        if(!user) ctx.throw(404,"当前用户不存在")
        ctx.body=user;
    };

    async updateUserById(ctx){
        ctx.verifyParams({
            name: {type:"string",required:false},
            password: {type:"string",required:false},
            gender:{type:"string",required:false},
            avatarUrl:{type:"string",required:false},
            headline:{type:"string",required:false},
            business:{type:"string",required:false},
            locations:{type:"array",itemType:"string",required:false},
            employments:{type:"array",itemType:"object",required:false},
            educations:{type:"array",itemType:"object",required:false}
        });

        let id =  ctx.params.id;
        let user  = await usersModel.findByIdAndUpdate(id,ctx.request.body)
        if(!user) ctx.throw(404,"当前用户不存在");

        let updatedUser = await usersModel.findById(id);
        ctx.body=updatedUser;
    };

    async login(ctx){
        ctx.verifyParams({
            name: {type:"string",required :true},
            password: {type:"string",required :true}
        });
        let name = ctx.request.body.name;
        let password = ctx.request.body.password;

        //校验用户名
        let user = await usersModel.findOne({name}).select("+password");
        if(!user) {ctx.throw(404,"用户不存在")};
        //校验密码
        console.log(password, user.password)
        let flag = bcrypt.compareSync(password, user.password)
        if(!flag){ctx.throw(401,"密码输入有误")}

        const token = jsonwebtoken.sign(
            {name:user.name,_id:user._id},
            config.tokenKey,
            {expiresIn:config.tokenExpiresIn}
        );

        ctx.body ={
            token
        }
    }

    async upload(ctx){
        const file = ctx.request.files.file;
        const name = file.path.split("\\").pop();
        ctx.body={
            path:`http://${config.host}:${config.port}/img/${name}`
        }
    }

    async delUserById(ctx){
        let id = ctx.params.id;
        let user = await usersModel.findByIdAndRemove(id);
        if(!user) ctx.throw(404,"当前用户不存在")
        ctx.status=204;
    };

    async follow(ctx){
        //找到当前的登录者
        const me = await usersModel.findById(ctx.state.user._id).select("+following");
        const followId = ctx.params.id;
        if(!me.following.includes(followId)){
            me.following.push(followId);
            me.save();
        }
        ctx.status=204;
    }

    async unfollow(ctx){
        //找到当前的登录者
        const me = await usersModel.findById(ctx.state.user._id).select("+following");
        const followId = ctx.params.id;
        if(me.following.includes(followId)){
            const index = me.following.indexOf(followId);
            me.following.splice(index,1);
            me.save();
        }
        ctx.status=204;
    }

    async listFollowing(ctx){
        const id = ctx.params.id;
        //populate : 链接查询(外链接)
        const user = await usersModel.findById(id).select("+following").populate("following");
        if(!user){ctx.throw(404,"用户不存在")}
        ctx.body = user.following
    }

    async listFollowers(ctx){
        const users = await usersModel.find({following:ctx.params.id});
        ctx.body = users;
    }

    async followTopic(ctx){
        const me = await usersModel.findById(ctx.state.user._id).select("+followingTopics");
        const followId = ctx.params.id;
        console.log(!me.followingTopics.includes(followId),followId)
        if(!me.followingTopics.includes(followId)){
            me.followingTopics.push(followId);
            me.save();
        }
        ctx.status=204;
    }

    async unfollowTopic(ctx){
        //找到当前的登录者
        const me = await usersModel.findById(ctx.state.user._id).select("+followingTopics");
        const followId = ctx.params.id;
        if(me.followingTopics.includes(followId)){
            const index = me.followingTopics.indexOf(followId);
            me.followingTopics.splice(index,1);
            me.save();
        }
        ctx.status=204;
    }

    async listFollowingTopics(ctx){
        //用户id
        const id = ctx.params.id;
        const user = await usersModel.findById(id).select("+followingTopics")
            .populate("followingTopics");
        ctx.body = user.followingTopics
    }

    async listQuestions(ctx){
        const questions=  await questionsModel.find({questioner:ctx.params.id});
        ctx.body = questions;
    }

    async like(ctx,next){
        //找到当前的登录者
        const me = await usersModel.findById(ctx.state.user._id).select("+likeAnswers");
        const answerId = ctx.params.answerId;
        if(!me.likeAnswers.includes(answerId)){
            me.likeAnswers.push(answerId);
            await answersModel.findByIdAndUpdate(ctx.params.answerId,{$inc:{favs:1}})
            me.save();
        }
        ctx.status=204;
        await next()
    }

    async unlike(ctx){
        //找到当前的登录者
        const me = await usersModel.findById(ctx.state.user._id).select("+likeAnswers");
        const answerId = ctx.params.answerId;
        if(me.likeAnswers.includes(answerId)){
            const index = me.likeAnswers.indexOf(answerId);
            me.likeAnswers.splice(index,1);
            await answersModel.findByIdAndUpdate(ctx.params.answerId,{$inc:{favs:-1}})
            me.save();
        }
        ctx.status=204;
    }

    async listAnswerLikes(ctx){
        //找到当前的登录者
        const user = await usersModel.findById(ctx.params.id)
            .select("+likeAnswers").populate("likeAnswers");
        ctx.body=user.likeAnswers;
    }

    async dislike(ctx,next){
        //找到当前的登录者
        const me = await usersModel.findById(ctx.state.user._id).select("+disLikeAnswers");
        const answerId = ctx.params.answerId;
        if(!me.disLikeAnswers.includes(answerId)){
            me.disLikeAnswers.push(answerId);
            me.save();
        }
        ctx.status=204; // 不会中断代码
        await next()
    }

    async unDislike(ctx){
        //找到当前的登录者
        const me = await usersModel.findById(ctx.state.user._id).select("+disLikeAnswers");
        const answerId = ctx.params.answerId;
        if(me.disLikeAnswers.includes(answerId)){
            const index = me.disLikeAnswers.indexOf(answerId);
            me.disLikeAnswers.splice(index,1);
            me.save();
        }
        ctx.status=204;
    }

    async listAnswerDisLikes(ctx){
        //找到当前的登录者
        const user = await usersModel.findById(ctx.params.id)
            .select("+disLikeAnswers").populate("disLikeAnswers");
        console.log(user.disLikeAnswers)
        ctx.body=user.disLikeAnswers;
    }
}

module.exports=new Users();