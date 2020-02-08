const mongoose = require("mongoose");
const {Schema,model} = mongoose;
/*
    答案模块:(二级嵌套的路由)
	    答案内容            : content
	    回答者              : answer
	    属于哪一个问题       : questionItem


	用户 答案(一对多的)
		一个用户可以进行多次回答
		一个回答只能来至于一个用户

	问题 答案 (一对多)
		一个问题可以有多个答案
		一个答案只能属于一个问题

*/
const answersSchema = Schema({
    __v:{type:Number,select:false},
    content:{type:String,required:true},
    //用户 答案(一对多的)
    answer:{
        type:Schema.Types.ObjectID,
        ref:"Users",
        required:true
    },
    //问题 答案 (一对多)
    questionItem:{
        type:Schema.Types.ObjectID,
        ref:"Questions",
        required:true
    }
})

module.exports=model("Answers",answersSchema)


