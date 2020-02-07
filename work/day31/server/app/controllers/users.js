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
            gender:{type:'string',required:true}
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

        //拿性别
        let gender = ctx.request.body.gender;

        //进行入库
        let user = await usersModel.create({name,password,gender});

        //注册成功之后返回的数据不包含密码
        let newUser = await usersModel.findById(user._id);
        ctx.body = newUser;
    };

    async getUserById(ctx){
        let id = ctx.params.id;
        let user = await usersModel.findById(id);
        if(!user) ctx.throw(404,"当前用户不存在")
        ctx.body=user;
    };

    async updateUserById(ctx){
        ctx.verifyParams({
            name: {type:"string",required:false},
            password: {type:"string",required:false},
            gender:{type:"string",required:false},
            avatarUrl:{type:"string",required:false},
            headline:{type:"string",required:false},
            business:{type:"string",required:false},
            locations:{type:"array",itemType:"string",required:false},
            employments:{type:"array",itemType:"object",required:false},
            educations:{type:"array",itemType:"object",required:false}
        });

        let id =  ctx.params.id;
        let user  = await usersModel.findByIdAndUpdate(id,ctx.request.body)
        if(!user) ctx.throw(404,"当前用户不存在");

        let updatedUser = await usersModel.findById(id);
        ctx.body=updatedUser;
    };

    async login(ctx){
        ctx.verifyParams({
            name: {type:"string",required :true},
            password: {type:"string",required :true}
        });
        let name = ctx.request.body.name;
        let password = ctx.request.body.password;

        //校验用户名
        let user = await usersModel.findOne({name}).select("+password");
        if(!user) {ctx.throw(404,"用户不存在")};
        //校验密码
        console.log(password, user.password)
        let flag = bcrypt.compareSync(password, user.password)
        if(!flag){ctx.throw(401,"密码输入有误")}

        const token = jsonwebtoken.sign(
            {name:user.name,_id:user._id},
            "damu",
            {expiresIn:"7d"}
        );

        ctx.body ={
            token
        }
    }


    async delUserById(ctx){
        let id = ctx.params.id;
        let user = await usersModel.findByIdAndRemove(id);
        if(!user) ctx.throw(404,"当前用户不存在")
        ctx.status=204;
    };

    async upload(ctx){
        const file = ctx.request.files.file;
        const name = file.path.split("\\").pop();
        ctx.body={
            path:`http://127.0.0.1:3000/img/${name}`
        }
    }
}

module.exports=new Users();