const wxUsersModel = require("../models/wx_users");
const axios = require("axios");
const config = require("../config/index")
class Users {
    async getOpenId(ctx){
        //拿到code
        const  JSCODE = ctx.request.body.code;
        const  APPID = config.appId;
        const  SECRET = config.appSecret;
        const  url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${JSCODE}&grant_type=authorization_code`
        const  res = await  axios.get(url);

        const user = await wxUsersModel.create({openid:res.data.openid})

        ctx.body = {
            uid:user._id
        }
    }

}

module.exports=new Users();