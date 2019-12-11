import Vuex from "vuex";
import Vue from 'vue'
Vue.use(Vuex)
const store  = new Vuex.Store({
  state:{
    count:10,
    firstName:"T",
    lastName:"MAC"
  },
  getters:{
    flag(state){
      return (state.count%2 ===0)?"偶":"奇";
    },
    fullName(state){
      return state.firstName +"-"+ state.lastName
    }
  },
  mutations:{
    addOne(state,obj){
      console.log(obj,"mutations")
      state.count++;
    },
    add(state){
      state.count++
    },
    dec(state){
      state.count--
    },
    asyncAdd(state){
      state.count +=2;
    }
  },
  actions:{
    asyncAdd(store,obj){
      console.log(obj,"actions")
      setTimeout(()=>{
        store.commit("asyncAdd")
      },3000)
    }
  }
})
export default store
