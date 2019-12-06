import about from "@/components/about.vue"
import home from "@/components/home.vue"
import news from "@/components/news.vue"
import message from "@/components/message.vue"
export default [
  {path:"/about",component:about},
  {
      path:"/home",
      component:home,
      children:[
        {path:"news",component:news},
        {path:"message",component:message},
      ]
  },
  { path: '/', redirect: '/about' }
]
