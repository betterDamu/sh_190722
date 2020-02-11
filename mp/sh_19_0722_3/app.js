import store from "./utils/store.js";
import http from "./utils/http.js";
import api from "./api/index.js";
import regeneratorRuntime from 'regenerator-runtime/index.js'
App({
  globalData:{
    BASEURL:"http://t.yushu.im",
    userInfo:null
  },
  onLaunch(){
    //拿到code 向我们自己的服务器发送请求 让自己的服务器去访问微信的服务器 换取openid
    // if (!wx.getStorageSync("uid")){
    if (!store.getItem("uid","userInfo")){  
      wx.login({
        //微信不允许在它的的回调函数上使用async  --> regeneratorRuntime
        // regenerator@0.13.1
        async success(res) {
          let code = res.code;
          let data = await http.post(api.getOpenId,{code});
          store.setItem('uid', data.uid, "userInfo")
        }
      })
    }

    //wx.getUserInfo 只有在用户已经授权过的情况下才能得到用户信息
    wx.getSetting({
      success:res =>{
        if (res.authSetting["scope.userInfo"]){
          //已经授权过
          wx.getUserInfo({
            success: res => {
              //异步的  是page里的onload先执行 还是当前这个回调的先执行?
              // 确保当前这个回调 一定要在page的onload之前执行
              this.globalData.userInfo = res.userInfo;

              //订阅 发布
              //到底是success先执行 还是index的onload先执行
              if (this.userInfoReadyCallBak){
                this.userInfoReadyCallBak(res)
              }
            }
          })
        }
      }
    })


    
  }
})