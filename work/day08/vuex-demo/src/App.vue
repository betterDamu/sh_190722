<template>
  <div id="app">
     <span @click="handleC">{{count}}</span>
  </div>
</template>

<script>

export default {
  name: 'App',
  methods:{
    handleC(){
      this.$store.commit("addOne",{name:"damu",age:18})
    }
  },
  computed:{
    count(){
      return this.$store.state.count
    }
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
