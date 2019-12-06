// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from "vue-router"
Vue.use(VueRouter)
import App from './App'
import A from "./components/A"
import B from "./components/B"

Vue.config.productionTip = false


//1. 定义路由 {path:path,component:component}
const routes = [
  {path:"/A",component:A},
  {path:"/B",component:B}
]

//2. 定义路由器
const router = new VueRouter({
  routes
})

//3. 将路由器交给vue通电


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router
})
