import Vuex from "vuex";
import Vue from 'vue'
Vue.use(Vuex)
const store  = new Vuex.Store({
  state:{
    count:10
  },
  mutations:{
    addOne(state,obj){
      state.count++;
      console.log(obj);
    }
  }
})
export default store
