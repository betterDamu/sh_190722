<template>
    <li :class="{highLight:highLight,line:line}"
          @mouseenter="highLight = true"
          @mouseleave="highLight = false"
    >
      <label>
        <slot name="inputSlot" :id="index">
          <input type="checkbox" v-model="checked"  />
        </slot>
        <slot name="spanSlot" :text="item.text" >
          <span>{{item.text}}</span>
        </slot>
      </label>
      <button class="btn btn-danger" v-show="highLight" @click="delItem(item.id)">删除</button>
    </li>
</template>

<script>
    export default {
        name: "Item",
        props:{
          item:Object,
          index:Number
        },
        data(){
          return {
            highLight:false
          }
        },
        computed:{
          line(){
            return this.item.checked
          },
          checked:{
            get(){
              return this.item.checked
            },
            set(val){
              this.bus.$emit("change",val,this.item.id)
            }
          }
        },
        methods:{
          delItem(id){
            //总线发布
            this.bus.$emit("delItem",id)
          }
        }
    }
</script>

<style scoped>
  .highLight{
    background: pink !important;
  }

  .line{
    position: relative;
  }
  .line:after{
    display: block;
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 3px;
    width: 90%;
    background: gray;
  }

  li {
    list-style: none;
    height: 36px;
    line-height: 36px;
    padding: 0 5px;
    border-bottom: 1px solid #ddd;
  }

  li label {
    float: left;
    cursor: pointer;
  }

  li label li input {
    vertical-align: middle;
    margin-right: 6px;
    position: relative;
    top: -1px;
  }

  li button {
    position: relative;
    z-index: 99;
    float: right;
    margin-top: 3px;
  }

  li:before {
    content: initial;
  }

  li:last-child {
    border-bottom: none;
  }
</style>
