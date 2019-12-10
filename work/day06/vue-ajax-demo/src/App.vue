<template>
  <div id="app">
    <van-contact-card type="add" add-text="添加订单联系人信息" @click="fn"></van-contact-card>
    <van-popup v-model="show" position="bottom">
      <van-contact-list
          :list="list"
          v-model="id"
          @add="addFn"
          @edit="editFn(id)"
          @select="selectFn"/>
    </van-popup>

    <van-popup v-model="showEdit" position="top">
      <van-contact-edit
          :is-edit="isedit"
          :contact-info="editingContact"/>
    </van-popup>
  </div>
</template>

<script>
  import { Button,Popup ,Toast ,ContactCard, ContactList, ContactEdit } from 'vant';
  export default {
    name: 'App',
    data(){
      return {
        id:1,
        show:false,
        showEdit:false,
        isedit:false,
        editingContact:{},
        list:[
          {id:1,name:"小芳",tel:1383838438,isDefault:true},
          {id:2,name:"二狗",tel:110,isDefault:false},
          {id:3,name:"傻柱",tel:120,isDefault:false}
        ]
      }
    },
    methods:{
      fn(){
        this.show = true;
      },
      addFn(){
        this.showEdit = true
      },
      editFn(id){
        console.log(id);
        this.showEdit = true;
        this.isedit = true;
        this.editingContact =  {id:1,name:"小芳",tel:1383838438,isDefault:true}
      },
      selectFn(){console.log("selectFn");}
    },
    components:{
      [Button.name]:Button,
      [Popup.name]:Popup,
      [ContactCard.name]:ContactCard,
      [ContactList.name]:ContactList,
      [ContactEdit.name]:ContactEdit
    }
  }
</script>

<style scoped>

</style>
