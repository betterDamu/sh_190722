import {SEARCHNAME,SEARCH,REQING,REQSUCESSHASDATA,REQSUCESSHASNODATA} from "./mutation_types"
export default {
  [SEARCHNAME](state,val){
    state.searchName = val
  },
  [SEARCH](state,val){
    state.list = val
  },
  [REQING](state){
    state.showMsg = false
    state.showLoading = true
  },
  [REQSUCESSHASDATA](state){
    state.showMsg = false
    state.showLoading = false
    state.showNothing = false
  },
  [REQSUCESSHASNODATA](state){
    state.showMsg = false
    state.showLoading = false
    state.showNothing = true
  }
}
