<template>
    <div>
       <span v-show="detail.id >=0 ">id:{{detail.id}}</span> <br>
       <span v-show="detail.title">title:{{detail.title}}</span> <br>
       <span v-show="detail.context">context:{{detail.context}}</span>
    </div>
</template>

<script>
    var listData=[
      {id:0,title:"PGOne 又回来了",context:"XXXXXXXXX"},
      {id:1,title:"老板前天偷偷的来",context:"yyyyyyyyyy"},
      {id:2,title:"芳芳踩雷了",context:"zzzzzzzzzz"},
      {id:3,title:"武汉快开了",context:"11111111111"}
    ]
    export default {
        name: "messageDetail",
        data(){
          return {
            detail:{}
          }
        },
        props:{
          id:Number
        },
        methods:{
            showDetail(){
              setTimeout(()=>{
                var detail = listData.find((item)=>{
                  return item.id === this.id
                })
                this.detail=detail
              },2000)
            }
        },
        mounted(){
            this.showDetail()
        },
        watch:{
          $route(){
            this.showDetail()
          }
        }
    }
</script>

<style scoped>

</style>
