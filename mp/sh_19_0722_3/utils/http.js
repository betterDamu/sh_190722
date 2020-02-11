import { merge } from 'weapp-utils'
import config from "../config/index.js";
import util from "../utils/util.js";
const systemInfo = util.getSystemInfo();
const BaseHeader={
  "clientType":"mp",
  "appnm": config.projectName,
  "version": config.version,
  "os": systemInfo.system,
  "brand": systemInfo.brand,
  "model": systemInfo.model,
  "wx_version": systemInfo.version
}


class Http{
  //发送请求的主体方法
  //url:接口地址(不带基地址) data:携带的数据 option:{loading,isMock,header}
  //option.loading:是否出现loading图标 
  //option.isMock:弃用环境 使用mock地址
  //option.header:请求头
  request(url, method = "GET",data={},option={}){
    let { loading = true, isMock = false, header={} ,ThirdBaseUrl="" } = option;
    return new Promise((resolve,reject)=>{
      //请求一开始 显示loading图标
      if (loading){
        wx.showLoading({
          title: 'loading...',
          mask:true
        })
      }

      //调用第三方接口
      if (ThirdBaseUrl){
        url = ThirdBaseUrl + url;
      }else{
        if (isMock) {
          //使用mockurl
          url = config.env.mockUrl + url;
        } else {
          //使用环境的地址
          url = config.env[config.model].baseUrl + url;
        }
      }

      //使用微信的api发请求
      wx.request({
        url,
        data,
        method,
        header: merge(BaseHeader, header),
        success(res){
          if (res.statusCode === 200 || res.statusCode === 204){
            if (loading) {
              wx.hideLoading()
            }
            resolve(res.data)
          }else{
            //showToast方法被调用时 会 自动hideLoading
            wx.showToast({
              title: '接口调用失败',
              duration:4000,
              icon:"none"
            })
            reject(res)
          }
        },
        fail(err){
          wx.showToast({
            title: '请求失败',
            duration: 4000,
            icon: "none"
          })
          reject(err)
        }
      })
    })
  };

  get = (url, data, option) =>  this.request(url,"GET", data, option) ;
  post = (url, data, option) =>  this.request(url, "POST", data, option) ;
  put = (url, data, option) =>  this.request(url, "PUT", data, option) ;
  path = (url, data, option) =>  this.request(url, "PATCH", data, option) ;
  del = (url, data, option) =>  this.request(url, "DELETE", data, option) ;
}

export default new Http()