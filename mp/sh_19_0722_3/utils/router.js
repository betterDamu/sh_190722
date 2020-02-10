// router.push("atguigu")
// router.push("atguigu",{
//   query:{
//     a:"a",
//     b:"b"
//   },
//   type:"switchTab",
//   duration:3000 //毫秒值
// })
// router.push({
//   path: "atguigu",
//   query: {
//     a: "a",
//     b: "b"
//   },
//   type: "switchTab",
//   duration: 3000 //毫秒值
// })

import routes from "../routes/index.js" // 代表拿到所有的路由信息
class Router{
  //打平所有调用方式的差异  最终所有的配置项都会组合到option中
  push(path,option={}){
    if(typeof path === "string"){
      option.path = path;
    }else{
      option = path;
    }

    //将配置项一一取出
    const { query = {}, type = "navigateTo",  duration=0} = option;
    const queryStr = this.parseQuery(query);
    const url = routes[option.path] + "?" +queryStr;//真正的路由地址
    
    //进行跳转
    duration > 0 ? setTimeout(()=>{
      this.to(type, url)
    }, duration) : this.to(type, url);
  }

  //路由跳转的方法
  to(type,url){
    let obj = { url};
    switch (type){
      case "switchTab":
        console.log(obj,"switchTab")
        wx.switchTab(obj)
       break;
      case "reLaunch":
        wx.reLaunch(obj)
        break; 
      case "redirectTo":
        wx.redirectTo(obj)
        break;  
      case "navigateTo":
        wx.navigateTo(obj)
        break; 
      case "back":
        wx.navigateBack({
          delta: 1
        })
        break;   
    }
  }

  //将一个query对象 转成一个 query字符串
  //{a:"a",b:"b"} ---> a=a&b=b
  parseQuery(query){
    let arr = [];
    for(let key in query){
       arr.push(`${key}=${query[key]}`) 
    }
    //["a=a","b=b"]
    return arr.join("&")
    //"a=a&b=b"
  }
}

export default new Router()