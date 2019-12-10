<template>
  <div>postTest</div>
</template>

<script>
    import axios from "axios"
    export default {
        name: "postTest",
        async created(){
          const res = await axios.post("https://api.github.com/repos/betterDamu/fullpage_sh_190722/issues",{
            title:"找到bug了!!!!!!",
            body:"xxxx"
          },{
           // headers: {'Authorization': 'token 361645365f19a6837afda294e70a08577ded74ee'},
          })
          console.log(res.data);
        }
    }
</script>

<style scoped>

</style>
