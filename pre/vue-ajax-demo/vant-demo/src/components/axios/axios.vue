<template>
    <div>
        axios
    </div>
</template>

<script>
    // https://api.github.com
    // /search/repositories?q=js


    import axios from "axios"
    axios.defaults.baseURL = "https://api.github.com"
    export default {
        name: "axios",
        created(){
            var github= axios.create({})

            github.interceptors.request.use(function (config) {
                // 在请求发送之前可以设置一些请求信息
                if(config.method.toUpperCase() === "POST"){
                    config.headers.Authorization = 'token 35a7156a970633b23e36ae44c586ac150b1eb274'
                }
                return config;
            }, function (error) {
                // 超时了 --> 重新发送请求
                return Promise.reject(error);
            });

            github.interceptors.response.use(function (response) {
                // 对响应数据做点什么
                return response.data.items;
            }, function (error) {
                // 对响应错误做点什么
                return Promise.reject("damu");
            });


            github({
                method:"get",
                url:"/search2/repositories",
                params:{
                    q:"js"
                }
            }).then((res)=>{
                console.log(res)
            }).catch((error)=>{
                console.log(error)
            })

           /* await github({
                method:"post",
                url:"/repos/betterDamu/sz_190425/issues",
                data:{
                    "title": "damu123",
                    "body": "I'm having a problem with this."
                }
            })*/
        }

        // axios实例对象的使用
        // async created(){
        //     var instance = axios.create({
        //         baseURL:"https://api.github.com",
        //         timeout:5000
        //     })
        //     const res = await  instance({
        //         url:"/search/repositories",
        //         method:"get",
        //         params:{
        //             q:"js"
        //         }
        //     })
        //
        //     var instance2 = axios.create({
        //         baseURL:"http://localhost:9000/api",
        //         timeout:4000
        //     })
        //     const res2 = await instance2.get("/contactList")
        //
        //     console.log(res,res2);
        // }

        //使用axios实现并发请求
        // created(){
        //     axios.all([axios({
        //         baseURL:"https://api.github.com",
        //         url:"/search/repositories",
        //         method:"get",
        //         params:{
        //             q:"js"
        //         }
        //     }),axios({
        //         baseURL:"https://api.github.com",
        //         url:"/search/repositories",
        //         method:"get",
        //         params:{
        //             q:"vue"
        //         }
        //     })]).then(
        //         axios.spread((val1,val2)=>{
        //             console.log(val1,val2,1);
        //         })
        //     )
        // }

        //使用Promise.all实现并发请求
        // async created(){
        //  const arr =  await Promise.all([axios({
        //        baseURL:"https://api.github.com",
        //        url:"/search/repositories",
        //        method:"get",
        //        params:{
        //            q:"js"
        //        }
        //    }),axios({
        //        baseURL:"https://api.github.com",
        //        url:"/search/repositories",
        //        method:"get",
        //        params:{
        //            q:"vue"
        //        }
        //    })])
        //
        //     console.log(arr);
        // }

        // 基本使用
        // async created(){
        //    const res =  await axios.get(`/search/repositories`,{
        //         baseURL:`https://api.github.com`,
        //         params:{
        //             q:"js"
        //         }
        //     })
        //
        //     console.log(res.data.items);
        // }
    }
</script>

<style scoped>

</style>