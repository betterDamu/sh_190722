const wxUsersModel = require("../models/wx_users");
const config = require("../config/index");
const jsonwebtoken = require("jsonwebtoken");
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

}

module.exports=new Users();