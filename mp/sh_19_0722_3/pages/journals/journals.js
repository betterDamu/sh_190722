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
    isLike:false
  },
  onShareAppMessage(){
    return {
      title:"0722小程序",
      path:"/pages/journals/journals"
    }
  },
  async onLoad(){
    //发送请求获取最新一期期刊的信息
    const data = await http.get(api.getLatest);
    this.setData({
      journal: {
        ...data.journal_id,
        index: data.index,
        favs: data.favs,
        journalId:data._id
      }
    })

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
  // basicAuth认证:
  // 客户端传递 （"Basic dhakhdaskjhdaskjhdkajshdkjashdkasjhdsakjhdkasj"）
  //   1. authorization : name:password
  //   2. 进行base64编码  base64(`name: password`)
  //   3. 使用 "Basic空格"进行拼接
  getToken(){
    const token = store.getItem("token","userInfo");
    return "Basic " + Base64.encode(`${token}:`)
  }
})


