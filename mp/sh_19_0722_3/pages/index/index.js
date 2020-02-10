// pages/index/index.js
const app = getApp();
Page({
  data:{
    userInfo:{},
    hasUserInfo:false // true:用户已经授权过 false:用户没有授权
  },
  toAtguigu(){
    wx.switchTab({
      url:"/pages/atguigu/index"
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
      const uid = wx.getStorageSync("uid")
      wx.request({
        url: `http://localhost:8080/wx_users/${uid}/saveUserInfo`,
        method: "post",
        data: ev.detail.userInfo,
        success:(res)=> {
          wx.setStorageSync("token", res.data.token);
          this.setData({
            hasUserInfo:true,
            userInfo: ev.detail.userInfo
          })
        }
      })
    }
  }
})