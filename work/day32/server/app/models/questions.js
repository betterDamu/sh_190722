const mongoose = require("mongoose");
const {Schema,model} = mongoose;
/*
    标题:title
    描述:desc


    问题和用户? (一对多关系)
        一个用户能不能提出多个问题?   能
        一个问题能不能被多个用户提出? 不能
    问题和话题? (多对多关系)
        一个问题能不能从属于多个话题?  能
        一个话题底下能不能拥有多个问题? 能
*/
const questionsSchema = Schema({
    __v:{type:Number,select:false},
    title:{type:String,required:true},
    desc:{type:String},
    //问题的提问者  实现了问题与用户的一对多关系
    questioner:{
        type:Schema.Types.ObjectID,
        ref:"Users",
        required:true
    },
    //问题从属的话题  实现了问题与话题的多对多关系
    topics:{
        type:[
            {type:Schema.Types.ObjectID,ref:"Topics"},
        ],
        select:false,
        required:true
    }
})

module.exports=model("Questions",questionsSchema)


