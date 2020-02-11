const wxUsersModel = require("../models/wx_users");
const journalsModel = require("../models/wx_journals")
const config = require("../config/index");
const jsonwebtoken = require("jsonwebtoken");
const moviesModel = require("../models/wx_movies");
const musicsModel = require("../models/wx_musics");
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

    async like(ctx){
        //找到当前的登录者
        const me = await wxUsersModel.findById(ctx.state.user.uid).select("+likeJournals");
        const id = ctx.params.id;
        if(!me.likeJournals.includes(id)){
            me.likeJournals.push(id);
            await journalsModel.findByIdAndUpdate(id,{$inc:{favs:1}})
            me.save();
        }
        ctx.status=204;
    }

    async unlike(ctx){
        //找到当前的登录者
        const me = await wxUsersModel.findById(ctx.state.user.uid).select("+likeJournals");
        const id = ctx.params.id;
        if(me.likeJournals.includes(id)){
            const index = me.likeJournals.indexOf(id);
            me.likeJournals.splice(index,1);
            await journalsModel.findByIdAndUpdate(id,{$inc:{favs:-1}})
            me.save();
        }
        ctx.status=204;
    }

    async listJournalsLikes(ctx){
        //找到当前的登录者
        const user = await wxUsersModel.findById(ctx.state.user.uid)
            .select("+likeJournals").populate("likeJournals");
        let likeJournals = user.likeJournals;

        let arr = [];
        let model = "";
        for(let i=0;i<likeJournals.length;i++){
            switch (likeJournals[i].type){
                case 100:
                    model =moviesModel;
                    break;
                case 200:
                    model =musicsModel;
                    break;
                case 300:
                    model =sentencesModel;
                    break;
            }
            let fullJournal = await model.findById(likeJournals[i].journal_id);
            arr.push(fullJournal)
        }


        ctx.body=arr;
    }
}

module.exports=new Users();