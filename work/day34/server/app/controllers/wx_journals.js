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
}

module.exports=new Journals();