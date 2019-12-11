<template>
  <div id="app">
     <p>{{fullName}}</p>
     <span @click="handleC({a:`a`})">{{count}};当前数是 <strong>{{flag}}</strong> 数</span> <br>
     <button @click="add">+</button>
     <button @click="dec">-</button> <br>
     <button @click="asyncAdd({b:`b`})">async +</button>
  </div>
</template>

<script>
  import { mapState,mapGetters,mapMutations,mapActions } from 'vuex'
  export default {
    name: 'App',
    methods:{
      ...mapActions(["asyncAdd"]),
      ...mapMutations({
        handleC:"addOne"
      }),
      ...mapMutations(["add","dec"])
    },
    computed:{
      ...mapGetters(["flag","fullName"]),
      ...mapState(["count"])
    }
  }
</script>

<style scoped>
#app {
  color: red;
  font-size: 30px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
</style>
