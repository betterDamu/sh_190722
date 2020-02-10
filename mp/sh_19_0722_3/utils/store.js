// {
//   user:{
//     uid:"123",
//     token:"898989"
//   }
//   uid:"abc"  
// }
class Store{
  //getItem("uid","user") --> getItem("user")
  //从小程序的缓存中读取内容(带模块)
  getItem(key,moduleName) { 
    if (moduleName){
      let moduleObj = this.getItem(moduleName);
      if (moduleObj) return moduleObj[key];
      return "";
    }else{
      return wx.getStorageSync(key)
    }
  };
  //setItem("name","damu","user") --> getItem("user")
  //向小程序的缓存中写入内容(带模块)
  setItem(key, val, moduleName){
    if (moduleName){
      let moduleObj = this.getItem(moduleName)
      moduleObj ? "" : moduleObj={};
      moduleObj[key] = val;
      wx.setStorageSync(moduleName, moduleObj)
    }else{
      wx.setStorageSync(key, val)
    }
  };
  //清除小程序中的指定缓存
  clear(key){
    key?wx.removeStorageSync(key) : wx.clearStorageSync()
  }
}



export default new Store()