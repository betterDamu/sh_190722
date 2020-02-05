//系统模块
const http = require("http");
const path = require("path");

//用户模块
const config = require("./config/config");
const asyncFn = require("./async/async");
const openUrl = require("./async/04_open/open.js");

class Server{
    constructor (conf){
        this.config = Object.assign({},config,conf)
    }

    start(){
        http.createServer((message,res)=>{
            const filePath =  path.join(this.config.root,message.url);
            asyncFn(message,res,filePath,this.config)

        }).listen(this.config.port,this.config.host,()=>{
            const url = `http://${this.config.host}:${this.config.port}/`;
            console.log("服务起来了",url);
        })
    }
}


module.exports=Server;