const mongoose = require("mongoose");
const {Schema,model} = mongoose;
/*
    名称:name
    图标:avatar
    简介:introduction

    话题模块应该是要设计发起人的,
    一般情况下,话题不是由普通用户创建的.
    由于我们不涉及权限系统,所以不设计发起人
*/
const topicsSchema = Schema({
    __v:{type:Number,select:false},
    name:{type:String,required:true},
    avatar:{type:String},
    introduction:{type:String,select:false}
})

module.exports=model("Topics",topicsSchema)


