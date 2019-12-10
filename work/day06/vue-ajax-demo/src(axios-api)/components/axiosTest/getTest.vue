<template>

</template>

<script>
    import axios from "axios"
    export default {
        name: "getTest",
        async created(){
          const res = await axios.get("https://api.github.com/repos/betterDamu/fullpage_sh_190722/issues")
          console.log(res.data);
        }
    }
</script>

<style scoped>

</style>
