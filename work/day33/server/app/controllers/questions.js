const questionsModel = require("../models/questions")

class Questions {
    async getAllQuestions(ctx){
        let {pre_page=10,page=1,q=""} = ctx.query;
        pre_page = Math.max(+pre_page,1);
        page = Math.max(+page,1);
        ctx.body = await questionsModel
            .find({$or:[{title:new RegExp(q)},{desc:new RegExp(q)}]})
            .skip((page-1)*pre_page).limit(pre_page)
    };
    async getQuestionById(ctx){
        const {fields=""} = ctx.query;
        const selectFileds = fields.split(";").filter(item => item)
                        .map(item => `+${item}`).join(" ")
        const question =   await questionsModel.findById(ctx.params.id).
                            select(selectFileds).populate("questioner topics");
        ctx.body = question;
    };
    async addQuestion(ctx){
        ctx.verifyParams({
            title: {type:"string",required :true},
            desc: {type:"string",required :false}
        });

        let title = ctx.request.body.title;
        let data = await questionsModel.findOne({title});
        if(data) {ctx.throw(409,"问题已存在")}



        let question = await questionsModel.create({
            ...ctx.request.body,
            questioner: ctx.state.user._id
        });
        let newQuestion = await questionsModel.findById(question._id);
        ctx.body = newQuestion;
    };
    async updateQuestionById(ctx){
        ctx.verifyParams({
            title: {type:"string",required :false},
            desc: {type:"string",required :false}
        });
        await questionsModel.findByIdAndUpdate(ctx.params.id,ctx.request.body);
        let updateQuestion = await questionsModel.findById(ctx.params.id);
        ctx.body = updateQuestion;
    };
    async delQuestionById(ctx){
        await questionsModel.findByIdAndRemove(ctx.params.id);
        ctx.status=204;
    };
}


module.exports = new Questions()

