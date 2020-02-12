### 作业
    1. 实现赞和踩的互斥关系!!!
    2. 实现小程序项目的所有接口'
        期刊有三个类型: 电影期刊 音乐期刊 句子期刊
        期刊信息的总的集合:wx_journals
        电影的集合:wx_movies
        音乐的集合:wx_musics
        句子的集合:wx_sentences
            期刊集合的CUD操作不在我们的小程序端;小程序端一般做展现功能
            期刊集合的CUD操作(生产力操作):会在pc端的后台管理系统中进行

        wx_journals:
            _id
            index:代表期刊的发布顺序
            type:100(电影)/200(音乐)/300(句子)
            journal_id:具体的期刊信息
            favs:当前期刊被点赞的次数
        wx_movies:
            _id
            image:代表电影的封面
            title:电影的标题
            content:电影中的金典台词
            type:类型
        wx_musics
            _id
            image:代表电影的封面
            title:电影的标题
            content:电影中的金典台词
            type:类型
            src:音乐的连接地址
        wx_sentences:
            _id
            image:代表电影的封面
            title:电影的标题
            content:电影中的金典台词
            type:类型

### postman中目录的意义
    用户      : 基本的CRUD 登录注册 文件上传
    关注与粉丝 :多对多
    话题      : 没有新的知识点 对原有技术的练习
    问题      : 一对多关系
    答案      : 后台的嵌套路由



### 项目目录解析
    config      : 放的是全局的配置文件
    controllers : 项目的控制器(实现后台的业务逻辑)
    db          :连接数据库
    middlewares :中间件(业务逻辑的校验中间件)
    models      :所有的数据库映射
    public      :项目的静态资源服务
    routes      :后台路由
    index.js    :项目的启动文件


### ODM框架
        1.moogose
            connection:连接数据库
            Schema    :对文档结构的一个映射
            model     :对文档进行操作的工具
            document  :model的一个实例 是对文档的一个抽象
            query     :查询(查到结果再次进行筛选)


### web框架
        1.koa2
            路由
            参数校验
            错误处理
        2. 路由
            有能力对不同的url做出不同的响应
            有能力对不同的http方法做出不同的响应
            有能力获取客户端的数据
            有能力向客户端返回响应
        3. 有能力获取客户端的数据?
             query:  ctx.query
             params: ctx.params
             body:   ctx.request.body (需要安装body插件)
             header: ctx.req.headers
        4. 有能力向客户端返回响应?
            200 : 请求成功
            204 : 成功不用返回数据(删除)
            301 : 永久重定向
            302 : 临时重定向
            304 : 使用协商缓存
            401 : 认证失败(登录认证)
            403 : 权限不通过(拒绝请求)
            404 : 资源找不到
            405 : 方法不允许
            409 : 通不过唯一性约束
            412 : 先决条件失败
            422 : 参数校验不通过
            500 : 服务器错误
            501 : 方法没实现