const wxJournalsModel = require("../models/wx_journals");
const moviesModel = require("../models/wx_movies");
const musicsModel =require("../models/wx_musics");
const sentencesModel = require("../models/wx_sentences");
class Journals {
    async getLatest(ctx){
        let latest = await wxJournalsModel.findOne()
            .sort({index:"desc"})
        if(!latest){ctx.throw(404,"期刊不存在")}

        //动态的指定 wxJournalsModel 应该与 哪一个模型相连接
        let model ="";
        switch (latest.type){
            case 100:
                model = moviesModel
                break;
            case 200:
                model = musicsModel
                break;
            case 300:
                model = sentencesModel
                break;
        }

        let journal = await wxJournalsModel.findOne()
            .sort({index:"desc"}).populate({
                path:"journal_id",
                model
            })

        ctx.body = journal;
    }

    async getNext(ctx){
        //指定的是哪一期
        const index = +ctx.params.index;
        let next = await wxJournalsModel.findOne({index:index+1});
        if(!next){ctx.throw(404,"下一期不存在")}

        //动态的指定 wxJournalsModel 应该与 哪一个模型相连接
        let model ="";
        switch (next.type){
            case 100:
                model = moviesModel
                break;
            case 200:
                model = musicsModel
                break;
            case 300:
                model = sentencesModel
                break;
        }

        let journal =  await wxJournalsModel.findOne({index:index+1})
            .populate({
                path:"journal_id",
                model
            })

        ctx.body = journal;
    }

    async getPre(ctx){
        //指定的是哪一期
        const index = +ctx.params.index;
        let pre = await wxJournalsModel.findOne({index:index-1});
        if(!pre){ctx.throw(404,"上一期不存在")}

        //动态的指定 wxJournalsModel 应该与 哪一个模型相连接
        let model ="";
        switch (pre.type){
            case 100:
                model = moviesModel
                break;
            case 200:
                model = musicsModel
                break;
            case 300:
                model = sentencesModel
                break;
        }

        let journal =  await wxJournalsModel.findOne({index:index-1})
            .populate({
                path:"journal_id",
                model
            })

        ctx.body = journal;
    }

    async getFavs(ctx){
        let journal = await wxJournalsModel.findById(ctx.params.id);
        ctx.body={
            favs:journal.favs
        }
    }
}

module.exports=new Journals();