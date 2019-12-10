<template>
  <div>
     <img :src="avatar_url" width="100px" height="100px" >
     <span>当前用户是{{name}}</span>
     <a :href="html_url">仓库地址</a>
  </div>
</template>

<script>
    export default {
        name: "index",
        data(){
          return {
            name:"",
            avatar_url:"",
            html_url:""
          }
        },
        async created(){
          const data = await this.$http.get("https://api.github.com/search/users?q=betterDamu");
          this.name = data.body.items[0].login
          this.avatar_url = data.body.items[0].avatar_url
          this.html_url = data.body.items[0].html_url
        }
    }
</script>

<style scoped>

</style>
