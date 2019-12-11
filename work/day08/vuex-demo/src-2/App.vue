<template>
  <div id="app">
     <p>{{fullName}}</p>
     <span @click="handleC">{{count}};当前数是 <strong>{{flag}}</strong> 数</span> <br>
     <button @click="add">+</button>
     <button @click="dec">-</button> <br>
     <button @click="asyncAdd">async +</button>
  </div>
</template>

<script>

export default {
  name: 'App',
  methods:{
    handleC(){
      this.$store.commit("addOne",{name:"damu",age:18})
    },
    add(){
      this.$store.commit("add")
    },
    dec(){
      this.$store.commit("dec")
    },
    asyncAdd(){
      this.$store.dispatch("asyncAdd",{name:"damu",age:18})
    }
  },
  computed:{
    flag(){
      return this.$store.getters.flag
    },
    fullName(){
      return this.$store.getters.fullName
    },
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
