1. koa的基本使用
2. koa的核心源码
3. koa的路由
    有能力处理url
    有能力处理http方法
    有能力接受客户端传来的数据
        query: ctx.query
        params: ctx.params
        body: ctx.request.body (依賴於body-parser)
        请求报文的请求体也是可以携带数据的!
    有能力返回响应
        状态码
        数据(json)
            C : 返回新增成功的数据(json)
            R : 返回查询的数据(json)
            U : 返回修改完的数据(json)
            D : 返回一个状态码 204
    多中间件 (koa高级使用)
    前缀(koa高级使用)
4. koa错误处理(开发环境&生产环境)
    500错误 (koa的err对象中没有对应的500状态码)
    404错误 接口不存在 (koa的中间件是拦不到的)
    手动抛出的错误
        501 方法未实现 
        405 方法不允许
        412 先决条件失败
        422 参数校验失败
5. koa参数检验

