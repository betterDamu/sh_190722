const {watchFile} = require("fs");

watchFile("./damu.txt",{ interval: 1000 },(curr ,prev)=>{
    console.log(curr ,prev)
})


