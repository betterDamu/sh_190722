const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const journalsSchema = Schema({
    __v:{type:Number,select:false},
    index:{type:Number},
    type:{type:Number},
    journal_id:{type:Schema.Types.ObjectID},
    favs:{type:Number,default:0}
});
module.exports = model('wx_journals', journalsSchema);