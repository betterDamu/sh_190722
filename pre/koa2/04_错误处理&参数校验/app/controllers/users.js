const users = require("../data/data");
let id = 0;
class Users{
    getUsers(ctx,next){
        ctx.body = users;
    };
    getUserById(ctx,next){
        let id = ctx.params.id*1;
        if(id<0){ctx.throw(401,"id 不能是负数")}
        let user = users.find(user=>user.id === id);
        ctx.body = user;
    };
    addUser(ctx,next){
        ctx.verifyParams({
            name:{
                type:"string",
                required:false
            },
            age:{
                type:"number",
                required:false
            }
        });
        let user = {
            id:id++,
            name:ctx.request.body.name,
            age:ctx.request.body.age
        }
        users.push(user)
        ctx.body = user;
    };
    updateUserById(ctx,next){
        if(id<0){ctx.throw(401,"id 不能是负数")}
        let id = ctx.params.id*1;
        let user = users.find(user=>user.id === id);
        let {name,age} = ctx.request.body;
        if(name){
            user.name = name
        }else {
            user.age = age
        }
        ctx.body = user;
    };
    delUserById(ctx,next){
        if(id<0){ctx.throw(401,"id 不能是负数")}
        let id = ctx.params.id*1;
        let index = users.findIndex(user=>id === user.id)
        users.splice(index,1)
        ctx.status = 204;
    }
}

module.exports = new Users()