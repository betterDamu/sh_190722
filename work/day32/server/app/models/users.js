/*
    粉丝 主播(都算用户)
        1个主播 能不能被多个粉丝关注？ 可以的
        1个粉丝 能不能关注多个主播?    可以的
*/



const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const usersSchema = Schema({
    __v:{type:Number,select:false},
    name: {type:String,required:true},
    password: {type:String,required:true,select:false},
    gender:{type:String,required:true,enum:["male","female"]},
    avatarUrl:String,
    headline:String,
    business:String,
    locations:{
        type:[String],
        select:false
    },
    employments:{
        type:[{
            company:String,
            job:String
        }],
        select:false
    },
    educations:{
        type:[{
            school:String,
            major:String,
            diploma:{
                type:Number,
                enum:[1,2,3,4,5]
            },
            entrance_year:Number,
            graduation_year:Number
        }],
        select:false
    },
    //代表当前的用户关注了谁?
    //代表当前用户的粉丝?
    //following最好设计成用户关注的对象(有限的数据)
    following:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:"Users"
        }],
        select:false
    },

    //代表的是用户关注了哪些话题
    followingTopics:{
        type:[
            {
               type: Schema.Types.ObjectId,
                ref:"Topics"
            }
        ],
        select:false
    }
});
module.exports = model('Users', usersSchema);