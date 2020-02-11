// pages/index/index.js
const app = getApp();
import store from "../../utils/store.js";
import router from "../../utils/router.js";
import http from "../../utils/http.js";
import api from "../../api/index.js";
import regeneratorRuntime from 'regenerator-runtime/index.js'
Page({
  data:{
    userInfo:{},
    hasUserInfo:false // true:用户已经授权过 false:用户没有授权
  },
  toAtguigu(){
    router.push("atguigu",{
      type:"switchTab"
    })
  },
  onLoad(){
    if (app.globalData.userInfo){
        //代表已经授权了
        this.setData({
          hasUserInfo: true,
          userInfo: app.globalData.userInfo
        })
    }else{
      //1.有可能用户没有授权
      //2.有可能用户授权了 只是onload在success之前就调用
      app.userInfoReadyCallBak = res=>{
        this.setData({
          hasUserInfo: true,
          userInfo: res.userInfo
        })
      }
    }
  },
  async getUserInfo(ev){
    //点击拒绝 ev.detail.userInfo: undefined
    if (ev.detail.userInfo){
      // const uid = wx.getStorageSync("uid")
      // const uid = store.getItem("uid","userInfo");
      const data = await http.post(api.saveUserInfo(), ev.detail.userInfo)
      store.setItem("token", data.token, "userInfo")
      this.setData({
        hasUserInfo: true,
        userInfo: ev.detail.userInfo
      })
    }
  }
})