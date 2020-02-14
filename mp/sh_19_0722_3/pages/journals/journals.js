import http from "../../utils/http.js";
import api from "../../api/index.js";
import config from "../../config/index.js";
import store from "../../utils/store.js";
import { Base64 } from 'js-base64';
import regeneratorRuntime from 'regenerator-runtime/index.js';
Page({
  data: {
    imgUrl: config.env[config.model].imgUrl,
    journal:{},
    isLike:false,
    isEnd:true,
    isFirst:false
  },
  //向左按钮的点击
  async onLeft() { 
    //找下一期
    if (this.data.isEnd) return;
    const data = await http.get(api.getNext(this.data.journal.index))
    this.handleData(data)
  },
  //向右按钮的点击
  async onRight() { 
    //找上一期
    if (this.data.isFirst) return;
    const data = await http.get(api.getPre(this.data.journal.index))
    this.handleData(data)
  },
  //page初始化的生命周期函数
  async onLoad(){
    //发送请求获取最新一期期刊的信息
    const data = await http.get(api.getLatest);
    this.handleData(data)
  
    //判断一下当前用户是否给对应的期刊点过赞
    const likes = await http.get(api.likeJournals,{},{
      header: {
        authorization: this.getToken()
      }
    })

    likes.forEach((like)=>{
      if (like._id === this.data.journal._id){
        this.setData({
          isLike:true
        })
      }else{
        this.setData({
          isLike: false
        })
      }
    })

  },
  //点赞
  async handleLike(ev){
    if (ev.detail.likeFlag === "like"){
        //点赞
      const data = await http.put(api.favs(this.data.journal.journalId),{},{
          loading:false,
          header:{
            authorization: this.getToken()
          }
      })
      this.setData({
        "journal.favs": data.favs
      })
    } else if (ev.detail.likeFlag === "cancel"){
        //取消点赞
      const data = await http.del(api.favs(this.data.journal.journalId),{},{
          loading: false,
          header: {
            authorization: this.getToken()
          }
      })  
      this.setData({
        "journal.favs": data.favs
      })
    }
  },
  //左上角系统分享的
  onShareAppMessage() {
    return {
      title: "0722小程序",
      path: "/pages/journals/journals"
    }
  },
  //获取token
  getToken(){
    const token = store.getItem("token","userInfo");
    return "Basic " + Base64.encode(`${token}:`)
  },
  //在初始化 向左 向右按钮点击时 对请求回来的数据做统一处理
  handleData(data){
    this.setData({
      journal:{
        ...data.journal_id,
        index:data.index,
        favs:data.favs,
        journalId:data._id,
        type: data.type
      },
      isEnd: true,
      isEnd: this.isEnd(data.index),
      isFirst: this.isFirst(data.index)
    })
  },
  //判断当前这一期是否是第一期
  isFirst(index){
    return index.toString() === "1";
  },
  //判断当前这一期是否是最新一期
  isEnd(index) {
    return index.toString() === "8";
  }
})


