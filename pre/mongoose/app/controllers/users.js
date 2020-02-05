const UsersModel = require("../models/users");
const jsonwebtoken = require("jsonwebtoken");
class Users {
    async getAll(ctx){
        ctx.body= await UsersModel.find()
    };
    async addUser(ctx){
        ctx.verifyParams({
            name: {type:"string",required :true},
            password: {type:"string",required :true}
        });
        let name = ctx.request.body.name;
        let password = ctx.request.body.password;
        let repeatUser = await UsersModel.findOne({name});
        if(repeatUser) {ctx.throw(409,"重复的用户")};
        let user = await new UsersModel({name,password}).save();
        ctx.body = user;
    };
    async getUserById(ctx){
        let id = ctx.params.id;
        let user = await UsersModel.findById(id);
        if(!user) ctx.throw(404,"找不到该用户")
        ctx.body=user;
    };
    async updateUserById(ctx){
        ctx.verifyParams({
            name: {type:"string"},
            password: {type:"string"}
        });
        let id = ctx.params.id;
        let updateUser = {}
        let name = ctx.request.body.name;
        let password = ctx.request.body.password;
        name?updateUser.name=name:"";
        password?updateUser.password=password:"";
        let user = await UsersModel.findByIdAndUpdate(id,updateUser,{new:true});
        if (!user) ctx.throw(404,"不存在该用户");
        ctx.body=user;
    };
    async delUserById(ctx){
        let id = ctx.params.id;
        let user = await UsersModel.findByIdAndRemove(id)
        if(!user) ctx.throw(404,"不存在该用户")
        ctx.status=204;
    };
    async login(ctx){
        ctx.verifyParams({
            name: {type:"string",required:true},
            password: {type:"string",required:true}
        });
        let username = ctx.request.body.name;
        let password = ctx.request.body.password;
        let user =  await UsersModel.findOne({name:username,password});
        if(!user) {ctx.throw(401,"用户名或密码不正确")};
        let {_id , name} = user;
        const token = jsonwebtoken.sign({_id,name},"damu");
        ctx.body={token};
    };
    async upload(ctx){
        const data = ctx.request.files.file;
        ctx.body={file:data.path}
    }
}

module.exports=new Users();