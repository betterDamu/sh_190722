const usersModel = require("../models/users");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
class Users {

    async getAll(ctx){
        //分页功能  模糊搜索
        let {pre_page=10,page=1,q=""} = ctx.query;
        pre_page = Math.max(+pre_page,1);
        page = Math.max(+page,1);
        //第一页: 跳过0条  返回10条
        //第二页: 跳过10条 返回下10条
        ctx.body=await usersModel.find({name:new RegExp(q)}).skip((page-1)*pre_page).limit(pre_page)
    };

    async addUser(ctx){
        //对body中的数据进行一次校验
        ctx.verifyParams({
            name: {type:"string",required :true},
            password: {type:"string",required :true},
        });

        //body中的数据通过校验之后 再拿到它
        //拿到name后继续进行业务校验 不允许出现相同用户名的用户
        let name = ctx.request.body.name;
        let data = await usersModel.findOne({name});
        if(data) {ctx.throw(409,"用户名已注册")}

        //拿到密码 进行加盐加密
        let password = ctx.request.body.password;
        let salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);

        //进行入库
        let user = await usersModel.create({name,password});

        //注册成功之后返回的数据不包含密码
        let newUser = await usersModel.findById(user._id);
        ctx.body = newUser;
    };

    async getUserById(ctx){
        ctx.verifyParams({
            id: {type:"string",required :true}
        });
        let id = ctx.params.id;
        let user = await usersModel.findById(id);
        if(!user) ctx.throw(404,"当前用户不存在")
        ctx.body=user;
    };
    async updateUserById(ctx){
        ctx.verifyParams({
            id: {type:"string",required :true}
        });
        let update = {};
        let id = ctx.params.id;
        let name = ctx.request.body.name;
        let password = ctx.request.body.password;
        name?update.name=name:"";
        password?update.password=password:"";
        let user  = await usersModel.findByIdAndUpdate(id,update)
        if(!user) ctx.throw(404,"当前用户不存在");
        let updatedUser = await usersModel.findById(id);
        ctx.body=updatedUser;
    };
    async delUserById(ctx){
        let id = ctx.params.id;
        let user = await usersModel.findByIdAndRemove(id);
        if(!user) ctx.throw(404,"当前用户不存在")
        ctx.status=204;
    };
    async login(ctx){
        ctx.verifyParams({
            name: {type:"string",required :true},
            password: {type:"string",required :true}
        });
        let name = ctx.request.body.name;
        let password = ctx.request.body.password;
        let user = await usersModel.findOne({name,password});
        if(!user) {ctx.throw(401,"登录失败")};
        const token = jsonwebtoken.sign({name:user.name,id:user._id},"damu",{expiresIn:"7d"});
        ctx.body ={
            token
        }
    }
    async upload(ctx){
        const file = ctx.request.files.file;
        const name = file.path.split("\\").pop();
        ctx.body={
            path:`http://127.0.0.1:3000/img/${name}`
        }
    }
}

module.exports=new Users();