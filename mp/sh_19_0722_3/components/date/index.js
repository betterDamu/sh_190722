// components/date/index.js
Component({
  properties: {
    index:String
  },

  data: {
    monthMap: [
      '一月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '十一月',
      '十二月'
    ],
    year:"",
    month:""
  },
  lifetimes: {
    attached() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      this.setData({
        year,
        month: this.data.monthMap[month]
      })
    }
  },
  methods: {

  }
})
