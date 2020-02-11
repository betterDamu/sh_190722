const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const WXMusicsSchema = Schema({
    __v:{type:Number,select:false},
    image:{type:String},
    title:{type:String},
    content:{type:String},
    url:{type:String},
    type:{type:Number}
});
module.exports = model('wx_musics', WXMusicsSchema);