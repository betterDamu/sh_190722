1. 事件循环机制(libuv)
2. 全局api
     process.cwd()
3. 内置模块
     fs
        RS.pipe(WS)
     http    
        怎么启动服务
        req : IncomingMessage
        res : ServerResponse
4. 流
    可读流
        暂停模式 --> 流动模式: 
            注册data事件
            stream.read()
            stream.pipe()
        流动模式 --> 暂停模式(默认):
            stream.pause()
    可写流        