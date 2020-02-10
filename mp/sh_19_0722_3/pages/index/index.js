// pages/index/index.js
const app = getApp();
import store from "../../utils/store.js";
import router from "../../utils/router.js"
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
  getUserInfo(ev){
    //点击拒绝 ev.detail.userInfo: undefined
    if (ev.detail.userInfo){
      // const uid = wx.getStorageSync("uid")
      const uid = store.getItem("uid","userInfo");
      wx.request({
        url: `http://localhost:8080/wx_users/${uid}/saveUserInfo`,
        method: "post",
        data: ev.detail.userInfo,
        success:(res)=> {
          // wx.setStorageSync("token", res.data.token);
          store.setItem("token", res.data.token,"userInfo")
          this.setData({
            hasUserInfo:true,
            userInfo: ev.detail.userInfo
          })
        }
      })
    }
  }
})