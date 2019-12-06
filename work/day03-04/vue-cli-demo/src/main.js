import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
// 总线
Vue.prototype.bus = new Vue()
var vm = new Vue({
  render: h => h(App)
})
vm.$mount("#app")

