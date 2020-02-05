class Home{
    index(ctx,next){
        ctx.set("Allow","get")
        ctx.body = "<h1>这是主页</h1>"
    }
}

module.exports = new Home()