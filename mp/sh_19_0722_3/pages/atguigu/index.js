// pages/atguigu/index.js
const data = require("./data/data.js")
Page({
  data:{
    length:1
  },
  onLoad() { 
    setTimeout(()=>{
      this.setData(data)
    },200)
  },
  handleTap(event){
    wx.navigateTo({
      url: `/pages/atguigu/detail/index?id=${event.currentTarget.dataset.listId}`,
    })
  }
})