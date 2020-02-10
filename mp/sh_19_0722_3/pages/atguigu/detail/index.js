const data = require("../data/data.js")
Page({
  onLoad(query){
    setTimeout(()=>{
      const detaiData = data.templateDatas.find((item)=>{
        console.log(item.newsid , query.id)
        return item.newsid === +query.id 
      })
     
      this.setData(detaiData)
    },100)
  }
})