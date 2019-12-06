<template>
  <div class="todo-footer">
    <label>
      <input type="checkbox" v-model="checkAll"/>
    </label>
    <span>
          <span>已完成{{computedCount}}</span> / 全部{{list.length}}
        </span>
    <button class="btn btn-danger" @click="clear">清除已完成任务</button>
  </div>
</template>

<script>
    export default {
        name: "Footer",
        props:{
          list:Array
        },
        computed:{
          checkAll:{
            get(){
              return this.computedCount!==0 && this.list.length!==0 && this.computedCount === this.list.length;
            },
            set(val){
              this.bus.$emit("checkAll",val)
            }
          },
          computedCount(){
            return this.list.reduce((adder,item)=>{
              return adder + (item.checked ? 1 :0)
            },0)
          }
        },
        methods:{
          clear(){
            this.bus.$emit("clear")
          }
        }
    }
</script>

<style scoped>
  .todo-footer {
    height: 40px;
    line-height: 40px;
    padding-left: 6px;
    margin-top: 5px;
  }

  .todo-footer label {
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
  }

  .todo-footer label input {
    position: relative;
    top: -1px;
    vertical-align: middle;
    margin-right: 5px;
  }

  .todo-footer button {
    float: right;
    margin-top: 5px;
  }
</style>
