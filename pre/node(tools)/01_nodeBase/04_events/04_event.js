//移除事件
const eventEmit = require("events");
class MyEventEmit extends eventEmit{

}

const myEventEmit = new MyEventEmit();
function fn1(){
    console.log("damu111")
}
function fn2(){
    console.log("damu222")
}

myEventEmit.on("damu",fn1);
myEventEmit.on("damu",fn2);

setInterval(()=>{
    myEventEmit.emit("damu");
})

setTimeout(()=>{
    myEventEmit.removeListener("damu",fn1);
},3000)