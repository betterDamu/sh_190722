import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import vueresource from "@/components/vueResourceTest"
import getTest from "@/components/axiosTest/getTest.vue"
import postTest from "@/components/axiosTest/postTest.vue"
import patchTest from "@/components/axiosTest/patchTest.vue"
import putTest from "@/components/axiosTest/putTest.vue"
import delTest from "@/components/axiosTest/delTest.vue"

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', name: 'HelloWorld', component: HelloWorld},
    {path: '/vueresource', name: 'vueresource', component: vueresource},
    {path: '/getTsetForAxios', name: 'getTest', component: getTest},
    {path: '/postTsetForAxios', name: 'postTest', component: postTest},
    {path: '/patchTsetForAxios', name: 'patchTest', component: patchTest},
    {path: '/putTsetForAxios', name: 'putTest', component: putTest},
    {path: '/delTsetForAxios', name: 'delTest', component: delTest},
    {path: '/axiosApi', name: 'axiosApi', component: () => import("@/components/axiosApi/axiosbase.vue")},
  ]
})

//https://api.github.com
//https://api.github.com/search/users
