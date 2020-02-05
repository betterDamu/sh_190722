// 让obj 来代理 obj.test 身上的所有方法
const delegate = require("./delegates")

const obj = {};
obj.test = {
    fn(){
        console.log("----")
    }
}

delegate(obj,"test").method("fn")

obj.fn()