// 1. api中如果有动态拼接的接口地址 我们需要使用函数的形式往外提供
// 2. 如果微信小程序不支持使用asynx 引入regeneratorRuntime这个库
// 3. 请求回来的数据 已经经过剥取了

// 微信自动登录
//   openid要入库(在整个微信小程序启动时入库  app onLaunch)
//   微信的用户信息要入库(在index界面被渲染的时候 入库 index onload)


//获取用户信息的方式
  // 1. <open-data type="userNickName"></open-data> 只能显示
  // 2.  <button open-type='getUserInfo' bindgetuserinfo = 'getUserInfo' ></button >;
  //点击这个按钮时 我们可以在getUserInfo回调中拿到用户信息 :ev.detail.userInfo
  //需要用户点击按钮
  // 3. wx.getUserInfo() 去获取用户信息  不需要任何点击;前提:必须授权过!!!


//实现了几个公共模块
//  1. 缓存的公共存储
//  2. 路由的搭建
//  3. http请求的promise化