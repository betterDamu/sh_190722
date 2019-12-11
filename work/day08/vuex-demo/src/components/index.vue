<template>
  <div class="container">
    <v-search></v-search>
    <v-list></v-list>
  </div>
</template>

<script>
  import search from "@/components/search.vue"
  import list from "@/components/list.vue"
    export default {
      name: "index",
      components:{
        "v-search":search,
        "v-list":list
      }
    }
</script>

<style scoped>

</style>
