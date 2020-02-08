const topicsModel = require("../models/topics")
const usersModel = require("../models/users")

class Topics {
    async getAllTopics(ctx){
        let {pre_page=10,page=1,q=""} = ctx.query;
        pre_page = Math.max(+pre_page,1);
        page = Math.max(+page,1);
        ctx.body = await topicsModel.find({name:new RegExp(q)})
            .skip((page-1)*pre_page).limit(pre_page)
    };
    async getTopicById(ctx){
        const {fields} = ctx.query;
        const selectFileds = fields.split(";").filter(item => item)
                        .map(item => `+${item}`).join(" ")
        const topic =   await topicsModel.findById(ctx.params.id).select(selectFileds);
        ctx.body = topic;
    };
    async addTopic(ctx){
        /*
            1. 业务级别的校验 (middlewares)
            2. 控制器中对数据(body中的数据)进行检验
            3. 在模型中对所有要入库的数据进行
        */
        ctx.verifyParams({
            name: {type:"string",required :true},
            avatar: {type:"string",required :false},
            introduction:{type:'string',required:false}
        });


        let name = ctx.request.body.name;
        let data = await questionsModel.findOne({name});
        if(data) {ctx.throw(409,"话题已存在")}

        let topic = await topicsModel.create(ctx.request.body);
        let newTopic = await topicsModel.findById(topic._id);
        ctx.body = newTopic;
    };
    async updateTopicById(ctx){
        ctx.verifyParams({
            name: {type:"string",required :false},
            avatar: {type:"string",required :false},
            introduction:{type:'string',required:false}
        });
        await topicsModel.findByIdAndUpdate(ctx.params.id,ctx.request.body);
        let updateTopic = await await topicsModel.findById(ctx.params.id);
        ctx.body = updateTopic;
    };
    async delTopicById(ctx){
        await topicsModel.findByIdAndRemove(ctx.params.id);
        ctx.status=204;
    };
    //列出话题下的粉丝
    async listTopicFollowers(ctx){
        const users = await usersModel.find({followingTopics:ctx.params.id});
        ctx.body = users;
    }
}


module.exports = new Topics()

// module.exports={
//     getAllTopics :async (ctx)=>{},
//     getTopicById :async (ctx)=>{},
//     addTopic :async (ctx)=>{},
//     updateTopicById :async (ctx)=>{},
//     delTopicById :async (ctx)=>{}
// }