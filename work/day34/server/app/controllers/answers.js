const answersModel = require("../models/answers")

class Questions {
    async getAllAnswers(ctx){
        let {pre_page=10,page=1,q=""} = ctx.query;
        pre_page = Math.max(+pre_page,1);
        page = Math.max(+page,1);
        ctx.body = await answersModel
            .find({content:new RegExp(q)})
            .skip((page-1)*pre_page).limit(pre_page)
    };
    async getAnswerById(ctx){
        const {fields=""} = ctx.query;
        const selectFileds = fields.split(";").filter(item => item)
                        .map(item => `+${item}`).join(" ")
        const question =   await answersModel.findById(ctx.params.answerId).
                            select(selectFileds).populate("answer questionItem");
        ctx.body = question;
    };
    async addAnswer(ctx){
        ctx.verifyParams({
            content: {type:"string",required :true}
        });

        let answer = await answersModel.create({
            ...ctx.request.body,
            answer: ctx.state.user._id,
            questionItem:ctx.state.question._id
        });
        let newAnswer = await answersModel.findById(answer._id);
        ctx.body = newAnswer;
    };
    async updateAnswerById(ctx){
        ctx.verifyParams({
            content: {type:"string",required :false}
        });
        await answersModel.findByIdAndUpdate(ctx.params.answerId,ctx.request.body);
        let updateAnswer = await answersModel.findById(ctx.params.answerId);
        ctx.body = updateAnswer;
    };
    async delAnswerById(ctx){
        await answersModel.findByIdAndRemove(ctx.params.answerId);
        ctx.status=204;
    };
}


module.exports = new Questions()

