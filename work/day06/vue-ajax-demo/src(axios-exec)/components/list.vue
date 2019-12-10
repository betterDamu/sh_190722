<template>
  <div>
    <h3 v-if="showTip" style="text-align: center">请输入要搜索的用户名</h3>
    <h3 v-else-if="showLoading" style="text-align: center">loading....</h3>
    <div v-else class="row">
      <div class="card" v-for="item in list">
        <a :href="item.rep" target="_blank">
          <img :src="item.avatar" style='width: 100px'/>
        </a>
        <p class="card-text">{{item.username}}</p>
      </div>
    </div>
  </div>
</template>

<script>
    import PubSub from "pubsub-js";
    import axios from "axios"
    export default {
        name: "list",
        data(){
          return {
            list:[],
            showTip:true,
            showLoading:true
          }
        },
        mounted(){
          //订阅
          PubSub.subscribe("getUserList",async (msg,searchName)=>{
              if(searchName === "") return;
              this.showLoading = true
              this.showTip = false
              const res = await axios({
                baseURL: 'https://api.github.com',
                url:"/search/users",
                method:"get",
                params:{
                  q:searchName
                }
              })
              this.showLoading = false
              this.list = res.data.items.map(item => ({
                rep:item.html_url,
                avatar:item.avatar_url,
                username:item.login
              }));
          })
        }
    }
</script>

<style scoped>
  .card {
    float: left;
    width: 33.333%;
    padding: .75rem;
    margin-bottom: 2rem;
    border: 1px solid #efefef;
    text-align: center;
  }

  .card > img {
    margin-bottom: .75rem;
    border-radius: 100px;
  }

  .card-text {
    font-size: 85%;
  }
</style>
