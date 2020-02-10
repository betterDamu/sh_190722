// pages/movies/more/more.js
const util = require("../../../utils/util");
const app = getApp();
const BASEURL = app.globalData.BASEURL;
Page({
  //数据仓库
  data:{
    movies: [], //电影列表
    title:"",   //电影分类
    currentUrl:"",//当前页分类所对应的请求地址
    count:20,     // 每次上拉加载的条数
    start:0,      // 每次上拉的初始条数
    isFirstReq:true // 第几次请求(下拉算第一次请求)
  },
  //上拉所对应的回调
  onReachBottom(){
    util.http(`${this.data.currentUrl}?start=${this.data.start}&count=${this.data.count}`, this.cb, this.data.isFirstReq)
  },
  //下拉所对应的回调
  onPullDownRefresh(){
    this.setData({
      movies: [],
      isFirstReq: true
    });
    util.http(`${this.data.currentUrl}`, this.cb, this.data.isFirstReq);
  },
  //页面初始加载的回调
  onLoad: function (query) {
    this.setData({
      title: query.type
    })

    switch (query.type){
      case "正在热映":
        this.setData({
          currentUrl: `${BASEURL}/v2/movie/in_theaters`
        }),
        util.http(`${BASEURL}/v2/movie/in_theaters`,this.cb.bind(this))
        break;
      case "即将上映":
        this.setData({
          currentUrl: `${BASEURL}/v2/movie/coming_soon`
        }),
        util.http(`${BASEURL}/v2/movie/coming_soon`, this.cb.bind(this))
        break;
      case "豆瓣Top250":
        this.setData({
          currentUrl: `${BASEURL}/v2/movie/top250`
        }),
        util.http(`${BASEURL}/v2/movie/top250`, this.cb.bind(this))
        break;    
    }
  },
  //页面加载成功 并 成功渲染后的回调
  onReady:function(){
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  //自定义的请求回调函数 实现了柯里化
  cb(data,isFirstReq){
      let movies = data.subjects.map(item => ({
        postImgUrl: item.images.large,
        name: item.original_title,
        score: item.rating.average,
        stars: util.getStarsArr(item.rating.stars)
      }))

      if (isFirstReq){
        this.setData({
          isFirstReq:false
        })
      }else{
        // 下拉完成之后 isFirstReq是true
        // 导致下拉之后进行上拉 数据没有办法做拼接
        movies = this.data.movies.concat(movies)
      }

      this.setData({
        movies: movies,
        start: this.data.start + this.data.count
      },()=>{
        wx.stopPullDownRefresh()
      })
  }
})