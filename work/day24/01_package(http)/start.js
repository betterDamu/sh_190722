const Server = require("./server");
const yargs = require("yargs");

const argv = yargs
                .alias('port', 'p')
                .alias('host', 'H')
                .alias('rootPath', 'r')
                .describe({
                        p: "端口",
                        H: "主机",
                        r: "根目录"
                })
                .usage('用法: damu [options]')
                .help('help')
                .alias('help', 'h')
    .argv;


new Server(argv).start()