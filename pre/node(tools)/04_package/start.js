const yargs = require("yargs");
const Server = require("./app.js");

const  argv = yargs
    .option('p', {
        alias:"port",
        describe:'端口号',
        default: 9999
    })
    .option('h', {
        alias:"hostname",
        describe:'host',
        default: '127.0.0.1'
    })
    .option('r', {
        alias:"root",
        describe:'root path',
        default: process.cwd()
    })
    .argv;

const server = new Server(argv);
server.start();