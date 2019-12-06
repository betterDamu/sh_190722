<template>
    <div>
        第{{id}}号user;用户名为{{name}}
    </div>
</template>

<script>
    export default {
        name: "user",
        props:["id","name"]
    }
</script>

<style scoped>

</style>
