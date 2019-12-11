<template>
  <div>
    <p v-if="showMsg"   style="text-align: center;color: orangered;font-size: 30px">请输入查询用户名</p>
    <p v-else-if="showLoading" style="color: gray;text-align: center;font-size: 30px">loading...</p>
    <p v-else-if="showNothing" style="color: gray;text-align: center;font-size: 30px">查无此人</p>
    <div v-else class="row">
      <v-item v-for="item in list" :item="item"></v-item>
    </div>
  </div>
</template>

<script>
    import {mapState} from "vuex";
    import item from "@/components/item.vue"
    export default {
        name: "list",
        computed:{
          ...mapState(["showMsg","showLoading","showNothing","list"])
        },
        components:{
          "v-item":item
        }
    }
</script>

<style scoped>

</style>
