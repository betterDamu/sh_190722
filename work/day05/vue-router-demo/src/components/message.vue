<template>
  <div >
    <ul >
      <li v-for="item in list">
        <!--<router-link :to="`/home/message/messageDetail/${item.id}`">{{item.title}}</router-link>-->
        <span style="display: inline-block;width: 110px">{{item.title}}</span>
        <button @click="pushFn(item.id)">push</button>
        <button @click="replaceFn(item.id)">replace</button>
      </li>
    </ul>
    <button @click="backFn">back</button>
    <hr>
    <router-view></router-view>
  </div>
</template>

<script>
    var listData=[
      {id:0,title:"PGOne 又回来了"},
      {id:1,title:"老板前天偷偷"},
      {id:2,title:"芳芳踩雷了"},
      {id:3,title:"武汉快开了"}
    ]
    export default {
        name: "message",
        data(){
          return {
            list:[]
          }
        },
        methods:{
          pushFn(id){
            this.$router.push(`/home/message/messageDetail/${id}`)
          },
          replaceFn(id){
            this.$router.replace(`/home/message/messageDetail/${id}`)
          },
          backFn(){
            this.$router.back()
          }
        },
        mounted(){
          setTimeout(()=>{
              this.list = listData
          },2000)
        }
    }
</script>

<style scoped>

</style>
