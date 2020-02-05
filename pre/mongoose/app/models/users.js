const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const usersSchema = Schema({
    name:{type:String,required:true},
    password:{type:String,required:true}
})
module.exports =  model("Users",usersSchema)