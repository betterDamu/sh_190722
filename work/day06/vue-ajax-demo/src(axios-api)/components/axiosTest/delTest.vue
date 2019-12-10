<template>

</template>

<script>
    import  axios from "axios"
    export default {
        name: "delTest",
        async created(){
          const res = await axios.delete("https://api.github.com/repos/betterDamu/fullpage_sh_190722/issues/4/lock",{
            headers: {'Authorization': 'token 361645365f19a6837afda294e70a08577ded74ee'},
          })
          console.log(res.data);
        }
    }
</script>

<style scoped>

</style>
