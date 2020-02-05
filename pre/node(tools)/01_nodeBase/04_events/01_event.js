//事件的基本定义
const eventEmit = require("events");
class MyEventEmit extends eventEmit{

}

const myEventEmit = new MyEventEmit();
myEventEmit.on("damu",(a,b)=>{
    console.log("damu666"+a+b)
});


myEventEmit.emit("damu","something1","something2");
