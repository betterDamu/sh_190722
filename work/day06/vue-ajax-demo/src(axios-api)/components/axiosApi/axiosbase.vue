<template>
    <div>123</div>
</template>

<script>
    import axios from "axios"
    export default {
        name: "axiosbase",
        async created(){
         /* const res = await axios({
            url: '/search/users',
            method: 'get',
            baseURL: 'https://api.github.com',
            params: {
              q: "betterDamu"
            },
          })*/
         /*const res = await axios("/search/users",{
            method: 'get',
            baseURL: 'https://api.github.com',
            params: {
              q: "betterDamu"
            },
          })*/
         /*const res = await Promise.all([ axios({
           url: '/search/users',
           method: 'get',
           baseURL: 'https://api.github.com',
           params: {
             q: "betterDamu"
           },
         }) , axios({
           url: '/search/users',
           method: 'get',
           baseURL: 'https://api.github.com',
           params: {
             q: "zdy"
           },
         })])*/
         /* axios.all([axios({
                 baseURL:"https://api.github.com",
                 url:"/search/repositories",
                 method:"get",
                 params:{
                     q:"js"
                 }
             }),axios({
                 baseURL:"https://api.github.com",
                 url:"/search/repositories",
                 method:"get",
                 params:{
                     q:"vue"
                 }
             })]).then(
                   axios.spread((val1,val2)=>{
                       console.log(val1,val2,1);
                   })
             )*/
          /*const instance = axios.create({
            baseURL: 'https://api.github.com',
            timeout: 1000
          });
          instance("/search/users",{
            params:{
              q:"damu2"
            }
          })*/
          /*const instanceWithToken=axios.create({
            baseURL: 'https://api.github.com',
            headers: {'Authorization': 'token 361645365f19a6837afda294e70a08577ded74ee'},
          })
          instanceWithToken.post("/repos/betterDamu/fullpage_sh_190722/issues",{
            title:"damu找bug"
          },{
            data:{
              body:"12345"
            }
          })

          const instanceNoToken=axios.create({
            baseURL: 'https://api.github.com'
          })*/

          axios.interceptors.request.use(function (config) {
            // 在发送请求之前做些什么
            if(config.method.toUpperCase() === "POST"){
              config.headers.Authorization = 'token 361645365f19a6837afda294e70a08577ded74ee'
            }
            return config;
          }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
          });

          axios.interceptors.response.use(function (response) {
            // 对响应数据做点什么
            return response.data;
          }, function (error) {
            // 对响应错误做点什么
            return Promise.reject(error);
          });

          axios.defaults.baseURL = 'https://api.github.com';
          const res = await axios({
            // url:"/repos/betterDamu/fullpage_sh_190722/issues",
            method:"post",
            data:{
              title:"小蝌蚪找爸爸",
              body:"找啊找啊 找爸爸"
            }
          })

          console.log(res)

        }
    }
</script>

<style scoped>

</style>
