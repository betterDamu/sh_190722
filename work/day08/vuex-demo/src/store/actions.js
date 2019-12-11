import api from "@/api"
import {SEARCHNAME,SEARCH,REQING,REQSUCESSHASDATA,REQSUCESSHASNODATA} from "./mutation_types.js"
export default {
  searchName(store,val){
    store.commit(SEARCHNAME,val)
  },
  async Search(store){
    //请求中
    store.commit(REQING)
    try{
      let res = await  api.users.getUsers({q:store.state.searchName})
      let list = res.items.map(item=>({
        repHref:item.html_url,
        avatarSrc:item.avatar_url,
        userName:item.login
      }))
      //请求成功
      if(list.length){
        //有数据
        store.commit(REQSUCESSHASDATA)
      }else{
        //无数据
        store.commit(REQSUCESSHASNODATA)
      }
      store.commit(SEARCH,list)
    }catch (e) {
      // 请求失败

    }
  }
}
