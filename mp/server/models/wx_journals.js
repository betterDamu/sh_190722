const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const WXJournalsSchema = Schema({
    __v:{type:Number,select:false},
    index:{type:Number},
    type:{type:Number},
    journal_id:{type:Schema.Types.ObjectId},
    //被赞的次数
    favs:{type:Number}
});
module.exports = model('wx_journals', WXJournalsSchema);