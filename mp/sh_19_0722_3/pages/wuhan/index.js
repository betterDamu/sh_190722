// pages/wuhan/index.js
import http from "../../utils/http.js";
import api from "../../api/index.js";
import regeneratorRuntime from 'regenerator-runtime/index.js';
const OK = 0;
Page({
  data: {
    //[{count:0,title:"确诊",inc:0}]
    arr: [
      { title: "确诊", className: "confirmed" }, 
      { title: "疑似", className: "suspected" }, 
      { title: "死亡", className: "dead"},
      { title: "治愈", className: "cured"},
      { title: "重症", className: "serious"}
    ],
    stats:{}
  },
  async onLoad(options){
    //栅格数据
    const res = await http.get(api.getInfoForepidemic,{},{
      ThirdBaseUrl:"https://tianqiapi.com"
    })  

    if (res.errcode === OK){
      let countArr = [
        res.data.diagnosed, 
        res.data.suspect,
        res.data.death,
        res.data.cured,
        res.data.serious
      ]

      let incArr = [
        res.data.diagnosedIncr,
        res.data.suspectIncr,
        res.data.deathIncr,
        res.data.curedIncr,
        res.data.seriousIncr
      ]

      let newArr = this.data.arr.map((item,index)=>{
          item.count = countArr[index];
          item.inc = incArr[index];
          return item
      })
      this.setData({
        arr:newArr
      })


      //列表数据
      const stats = await http.get(api.getStats, {}, {
        ThirdBaseUrl: "https://wuhan.wbjiang.cn"
      })  
      this.setData({
        stats
      })
    }
  },

})