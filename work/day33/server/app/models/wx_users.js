/*
    粉丝 主播(都算用户)
        1个主播 能不能被多个粉丝关注？ 可以的
        1个粉丝 能不能关注多个主播?    可以的
*/


const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const wxUsersSchema = Schema({
    __v:{type:Number,select:false},
    // 每一个微信对于任意一款小程序都会有一个唯一的openid
    // damu 小程序A 12345
    // damu 小程序B 89898
    openid:{type:String,required:true}
});
module.exports = model('wx_users', wxUsersSchema);