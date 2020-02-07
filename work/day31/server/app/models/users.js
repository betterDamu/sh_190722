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
    }
});
module.exports = model('Users', usersSchema);