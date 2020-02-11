const journalsModel = require("../models/wx_journals");
const moviesModel = require("../models/wx_movies");
const musicsModel = require("../models/wx_musics");
const sentencesModel = require("../models/wx_sentences");
class Journals {
    async getLatest(ctx){
        let latest = await journalsModel.findOne().sort({index:"desc"});
        let model = "";
        switch (latest.type){
            case 100:
                model =moviesModel;
                break;
            case 200:
                model =musicsModel;
                break;
            case 300:
                model =sentencesModel;
                break;
        }
        let journals =await journalsModel.findOne()
            .sort({index:"desc"}).populate({
                path:"journal_id",
                model
            })
        ctx.body = journals;
    }
    async getNext(ctx){
        let currentIndex = +ctx.params.index;
        let next = await journalsModel.findOne({index:currentIndex+1});
        if(!next)
            ctx.throw(404,"期刊不存在")
        let model = "";
        switch (next.type){
            case 100:
                model =moviesModel;
                break;
            case 200:
                model =musicsModel;
                break;
            case 300:
                model =sentencesModel;
                break;
        }
        let journals =await journalsModel.findOne({index:currentIndex+1}).populate({
                path:"journal_id",
                model
            })
        ctx.body = journals;
    }
    async getPre(ctx){
        let currentIndex = +ctx.params.index;
        let next = await journalsModel.findOne({index:currentIndex-1});
        if(!next)
            ctx.throw(404,"期刊不存在")
        let model = "";
        switch (next.type){
            case 100:
                model =moviesModel;
                break;
            case 200:
                model =musicsModel;
                break;
            case 300:
                model =sentencesModel;
                break;
        }
        let journals =await journalsModel.findOne({index:currentIndex-1}).populate({
            path:"journal_id",
            model
        })
        ctx.body = journals;
    }
    async getFavs(ctx){
        let journal = await journalsModel.findById(ctx.params.id);
        ctx.body={
            favs:journal.favs
        }
    }
}

module.exports=new Journals();