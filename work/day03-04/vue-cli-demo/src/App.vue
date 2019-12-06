<template>
  <div id="app">
    <div class="todo-container">
      <div class="todo-wrap">
        <todo-header :addItem="addItem"></todo-header>
        <todo-list :list="list">
          <template slot-scope="item" slot="inputSlot">
            (>^ω^<)喵<input type="checkbox" v-model="list[item.id].checked">
          </template>
          <template slot-scope="item" slot="spanSlot">
            <span style="color: red" >{{item.text}}</span>
          </template>
        </todo-list>
        <todo-list :list="list">
          <template slot-scope="item" slot="inputSlot">
            (>^ω^<)汪<input type="checkbox" v-model="list[item.id].checked">
          </template>
          <template slot-scope="item" slot="spanSlot">
            <span style="color: green" >{{item.text}}</span>
          </template>
        </todo-list>
        <todo-footer :list="list"></todo-footer>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '@/util'
  import Header from "@/components/Header"
  import List from "@/components/List"
  import Footer from "@/components/Footer"
  export default {
    data(){
      return {
        list:[]
      }
    },
    methods:{
      addItem(item){
        this.list.unshift(item)
      }
    },
    components:{
      "todo-header":Header,
      "todo-list":List,
      "todo-footer":Footer
    },
    mounted(){
      //"[{},{},{}]"  数据持久化 的 初始渲染
      this.list =util.get("todolist",[])
      //总线订阅
      this.bus.$on("clear",()=>{
        this.list = this.list.filter((item)=>{
          return  !item.checked;
        })
      })
      this.bus.$on("checkAll",(checked)=>{
        this.list.forEach((item)=>{
            item.checked = checked
        })
      })
      this.bus.$on("change",(checked,id)=>{
          this.list.forEach((item)=>{
            if(item.id === id){
              item.checked = checked
            }
          })
      })
      this.bus.$on("delItem",(id)=>{
        this.list = this.list.filter((item)=>{
          return id !== item.id;
        })
      })

    },
    watch:{
      list: {
        handler: function (val) { /* 同步local */ util.set("todolist",val)},
        deep: true
      }
    }
  }
</script>

<style scoped>
  .todo-container {
    width: 600px;
    margin: 0 auto;
  }
  .todo-container .todo-wrap {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
</style>
