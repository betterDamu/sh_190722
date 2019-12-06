import about from "@/components/about.vue"
import home from "@/components/home.vue"
import news from "@/components/news.vue"
import message from "@/components/message.vue"
import user from "@/components/user.vue"
export default [
  {path:"/about",component:about},
  {
      path:"/home",
      component:home,
      children:[
        {path:"news",component:news},
        {path:"message",component:message},
        {path:"",redirect:"message"},
      ]
  },
  {
    path:"/user/:id",
    component:user,
    props(route){
      return {
        id:route.params.id,
        name:route.query.name
      }
    }
   },
  { path: '/', redirect: '/about' },
  { path: '/user', redirect: '/user/1' },
]
