import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex)

import state from "./state"
import getters from "./getters.js"
import mutations from "./mutations.js"
import actions from "./actions.js"
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
