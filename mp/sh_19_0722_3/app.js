App({
  globalData:{
    BASEURL:"http://t.yushu.im",
    userInfo:null
  },
  onLaunch(){
    //拿到code 向我们自己的服务器发送请求 让自己的服务器去访问微信的服务器 换取openid
    if (!wx.getStorageSync("uid")){
      wx.login({
        success(res) {
          let code = res.code;
          wx.request({
            url: 'http://localhost:8080/wx_users/getOpenId',
            method: "POST",
            data: {
              code
            },
            success(res) {
              //将uid保存到客户端的缓存中
              wx.setStorageSync('uid', res.data.uid)
            }
          })
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