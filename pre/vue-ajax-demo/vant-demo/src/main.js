import Vue from 'vue'
import App from './App.vue'
import http from "@/api"

Vue.config.productionTip = false
// 每一个组件都有能力发送当前项目中的任意一个请求
Vue.prototype.$http = http;

new Vue({
  render: h => h(App),
}).$mount('#app')
