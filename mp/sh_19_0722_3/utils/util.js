// 1. 封装公共的缓存工具类
// 2. 封装公共的路由工具类
// 3. 封装公共的请求工具类

//获取平台信息
const getSystemInfo = ()=>{
  return wx.getSystemInfoSync()
}

//日期格式化
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//评星工具类 传入分数之后计算星星的个数
const LENGTH = 5;
const getStarsArr = stars => {
  let arr = [];
  stars = stars/10;
  let ON = Math.floor(stars);
  let HALF = (stars%1 === 0?false:true);

  for(let i=0;i<ON;i++){
    arr.push("ON")
  }

  if (HALF){
    arr.push("HALF")
  }

  while (arr.length < LENGTH){
    arr.push("OFF")
  }

  return arr;
}


//柯里化的请求工具
const http = (url, callBack,...arg) => {
  wx.showNavigationBarLoading();
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: (res) => {
      // 函数柯里化
      wx.hideNavigationBarLoading();
      callBack(res.data, ...arg)
    }
  })
}


module.exports = {
  formatTime: formatTime,
  getStarsArr: getStarsArr,
  http: http,
  getSystemInfo
}
