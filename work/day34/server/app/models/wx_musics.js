const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const musicsSchema = Schema({
    __v:{type:Number,select:false},
    image:{type:String},
    title:{type:String},
    content:{type:String},
    type:{type:Number},
    url:{type:String}
});
module.exports = model('wx_musics', musicsSchema);