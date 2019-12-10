<template>
  <section class="jumbotron">
    <h3 class="jumbotron-heading">Search Github Users</h3>
    <div>
      <input type="text" placeholder="enter the name you search" v-model.trim="searchName"/>
      <button @click="handleC">Search</button>
    </div>
  </section>
</template>

<script>
    import PubSub from "pubsub-js"
    export default {
        name: "search",
        data(){
          return {
            searchName:""
          }
        },
        methods:{
          handleC(){
            //触发list组件去请求数据
            PubSub.publish("getUserList",this.searchName)
            this.searchName = ""
          }
        }
    }
</script>

<style scoped>

</style>
