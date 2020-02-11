const wxUsersModel = require("../models/wx_users");
const wxJournalsModel = require("../models/wx_journals");
const config = require("../config/index");
const jsonwebtoken = require("jsonwebtoken");
const moviesModel = require("../models/wx_movies");
const musicsModel =require("../models/wx_musics");
const sentencesModel = require("../models/wx_sentences");
const axios = require("axios");
class Users {
    async getOpenId(ctx){
        //拿到code
        const  JSCODE = ctx.request.body.code;
        const  APPID = config.appId;
        const  SECRET = config.appSecret;
        const  url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${JSCODE}&grant_type=authorization_code`
        const  res = await  axios.get(url);

        let user = await wxUsersModel.findOne({openid:res.data.openid})
        if(!user){
            user = await wxUsersModel.create({openid:res.data.openid})
        }
        // const user = await wxUsersModel.create({openid:res.data.openid})

        ctx.body = {
            uid:user._id
        }
    }

    async saveUserInfo(ctx){
        ctx.verifyParams({
            avatarUrl:{type:"string",required:false},
            city:{type:"string",required:false,allowEmpty:true},
            country:{type:"string",required:false},
            gender:{type:"number",required:false},
            language:{type:"string",required:false},
            nickName:{type:"string",required:false},
            province:{type:"string",required:false}
        });

        const uid = ctx.params.uid;
        //更新之前的user {openid:opendid}
        let user = await wxUsersModel.findByIdAndUpdate(uid,ctx.request.body);

        let updateUser = await wxUsersModel.findById(user._id);

        //返回token
        const token = jsonwebtoken.sign(
            {uid:uid,nickName:updateUser.nickName},
            config.tokenKey,
            {expiresIn:config.tokenExpiresIn}
        )

        ctx.body={
            token
        }
    }

    async like (ctx){
        //点赞期刊的id
        const  id = ctx.params.id;
        //找到当前登录的用户  ctx.state.user.uid(代表用户集合的主键)
        const user =await wxUsersModel.findById(ctx.state.user.uid).select("+likeJournals");
        if(!user.likeJournals.includes(id)){
            user.likeJournals.push(id);
            //修改当前期刊的点赞数
            await wxJournalsModel.findByIdAndUpdate(id,{$inc:{favs:1}})
            user.save()
        }
        ctx.status=204;
    }

    async unlike(ctx){
        //点赞期刊的id
        const  id = ctx.params.id;
        //找到当前登录的用户  ctx.state.user.uid(代表用户集合的主键)
        const user =await wxUsersModel.findById(ctx.state.user.uid).select("+likeJournals");
        if(user.likeJournals.includes(id)){
            const index = user.likeJournals.indexOf(id);
            user.likeJournals.splice(index,1);
            //修改当前期刊的点赞数
            await wxJournalsModel.findByIdAndUpdate(id,{$inc:{favs:-1}})
            user.save()
        }
        ctx.status=204;
    }

    async listJournalsLikes(ctx){
        const user =await wxUsersModel.findById(ctx.state.user.uid)
            .select("+likeJournals").populate("likeJournals");

        //这个确实是用户喜欢的期刊 可是它包含是概要信息 不是详细信息
        const  likeJournals = user.likeJournals;

        let arr =[];
        let model = "";
        for(let i=0;i<likeJournals.length;i++){
            switch (likeJournals[i].type){
                case 100:
                    model = moviesModel;
                    break;
                case 200:
                    model = musicsModel;
                    break;
                case 300:
                    model =sentencesModel
                    break;
            }
            let full  = await model.findById(likeJournals[i].journal_id);
            arr.push(full)
        }

        ctx.body = arr;
    }
}

module.exports=new Users();