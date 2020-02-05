const users = require("../db/data");
let id = 0;
class Users {
    getAll(ctx){
        ctx.body={
            users:users
        }
    };
    addUser(ctx){
        ctx.verifyParams({
            name: {type:"string",required :true},
            age: {type:"string",required :true}
        });
        let name = ctx.request.body.name;
        let age = ctx.request.body.age;
        let user ={id:id++, name, age};
        users.push(user);
        ctx.body = user;
    };
    getUserById(ctx){
        let id = +ctx.params.id;
        if(id<0){ctx.throw(412,"id 不能是负数")}
        let user = users.find(user=>user.id === id);
        ctx.body=user;
    };
    updateUserById(ctx){
        let id = +ctx.params.id;
        let user = users.find(user=>user.id === id);
        let name = ctx.request.body.name;
        let age = ctx.request.body.age;
        name?user.name=name:"";
        age?user.age=age:"";
        ctx.body=user;
    };
    delUserById(ctx){
        let id = +ctx.params.id;
        let index = users.findIndex(user=>user.id === id)
        users.splice(index,1);
        ctx.status=204;
    }
}

module.exports=new Users();