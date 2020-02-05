//移除事件
const eventEmit = require("events");
class MyEventEmit extends eventEmit{

}

const myEventEmit = new MyEventEmit();
myEventEmit.on("damu",()=>{
    console.log("damu111")
});
myEventEmit.on("damu",()=>{
    console.log("damu222")
});

setInterval(()=>{
    myEventEmit.emit("damu");
})

setTimeout(()=>{
    myEventEmit.removeAllListeners("damu");
},3000)