//once
const eventEmit = require("events");
class MyEventEmit extends eventEmit{

}

const myEventEmit = new MyEventEmit();
myEventEmit.once("damu",()=>{
    console.log("damu666")
});

setInterval(()=>{
    myEventEmit.emit("damu");
})