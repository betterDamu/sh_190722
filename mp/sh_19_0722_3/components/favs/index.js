// components/favs/index.js
Component({
  properties: {
    favs:Number,
    isLike: Boolean
  },


  data: {
    likeSrc: "./img/like.png",
    disLikeSrc:"./img/like@dis.png"
  },


  methods: {
    handleTap(){
      let isLike = this.data.isLike;
      this.setData({
        isLike:!isLike
      })

      //false --> 点赞
      //true  --> 取消点赞
      let likeFlag = isLike?"cancel":"like";
      this.triggerEvent("like",{
        likeFlag
      })
    }
  }
})
