// components/nav/index.js
Component({
  properties: {
    isEnd:Boolean,
    isFirst:Boolean,
    title:String
  },
  data: {
    leftUrl:"./img/left.png",
    disLeftUrl:"./img/dis@left.png",
    rightUrl:"./img/right.png",
    disRightUrl:"./img/dis@right.png"
  },
  methods: {
    onLeft(){
      this.triggerEvent("onLeft")
    },
    onRight(){
      this.triggerEvent("onRight")
    }
  }
})
