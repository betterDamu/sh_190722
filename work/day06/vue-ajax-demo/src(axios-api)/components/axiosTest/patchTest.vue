<template>
  <div>postTest</div>
</template>

<script>
    import axios from "axios"
    export default {
        name: "postTest",
        async created(){
          const res = await axios.patch("https://api.github.com/repos/betterDamu/fullpage_sh_190722/issues/4",{
            title:"修改了bug 出现了另外一个bug 无限bug",
            body:"yyyyyy"
          },{
             // headers: {'Authorization': 'token 361645365f19a6837afda294e70a08577ded74ee'},
          })
          console.log(res.data);
        }
    }
</script>

<style scoped>

</style>
