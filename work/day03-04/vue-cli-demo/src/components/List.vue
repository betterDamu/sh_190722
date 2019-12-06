<template>
  <ul class="todo-main">
    <todo-item v-for="(item,index) in list" :index="index" :item="item" :key="item.id">
      <template slot-scope="item" slot="inputSlot">
        <slot name="inputSlot" :id="item.id"></slot>
      </template>
      <template slot-scope="item" slot="spanSlot">
        <slot  :text="item.text" name="spanSlot"></slot>
      </template>
    </todo-item>
  </ul>
</template>

<script>
    import Item from "@/components/Item"
    export default {
        name: "List",
        props:{
          list:Array
        },
        components:{
          "todo-item":Item
        }
    }
</script>

<style scoped>
  .todo-main {
    margin-left: 0px;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 0px;
  }

  .todo-empty {
    height: 40px;
    line-height: 40px;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding-left: 5px;
    margin-top: 10px;
  }
</style>
