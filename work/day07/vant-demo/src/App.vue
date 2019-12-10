<template>
  <div id="app">
    <router-view></router-view>
    <!-- 联系人卡片 -->
    <!--<van-contact-card-->
      <!--:type="cardType"-->
      <!--:name="currentContact.name"-->
      <!--:tel="currentContact.tel"-->
      <!--@click="showList = true"-->
    <!--&gt;</van-contact-card>-->

    <!-- 联系人列表 -->
    <!--<van-popup v-model="showList" position="bottom">-->
      <!--<van-contact-list-->
        <!--v-model="chosenContactId"-->
        <!--:list="list"-->
        <!--@add="onAdd"-->
        <!--@edit="onEdit"-->
        <!--@select="onSelect"-->
      <!--&gt;</van-contact-list>-->
    <!--</van-popup>-->

    <!-- 联系人编辑 -->
    <!--<van-popup v-model="showEdit" position="bottom">-->
      <!--<van-contact-edit-->
        <!--:contact-info="editingContact"-->
        <!--:is-edit="isEdit"-->
        <!--@save="onSave"-->
        <!--@delete="onDelete"-->
      <!--&gt;</van-contact-edit>-->
    <!--</van-popup>-->
  </div>
</template>

<script>
  import axios from "axios"
  import { ContactCard, ContactList, ContactEdit,Popup  } from 'vant';

  const OK = 200;
  export default {
    data() {
      return {
        chosenContactId: null,
        editingContact: {},
        showList: false,
        showEdit: false,
        isEdit: false,
        list: []
      };
    },

    computed: {
      cardType() {
        return this.chosenContactId !== null ? 'edit' : 'add';
      },

      currentContact() {
        const id = this.chosenContactId;
        return id !== null ? this.list.filter(item => item.id === id)[0] : {};
      }
    },

    methods: {
      // 添加联系人
      onAdd() {
        this.editingContact = { };
        this.isEdit = false;
        this.showEdit = true;
      },

      // 编辑联系人
      onEdit(item) {
        this.isEdit = true;
        this.showEdit = true;
        this.editingContact = item;
      },

      // 选中联系人
      onSelect() {
        this.showList = false;
      },

      // 保存联系人
      async onSave(info) {
        this.showEdit = false;
        this.showList = false;

        if (this.isEdit) {
          await this.contactAxios.put("/contact/edit",{
            name:info.name,
            tel:info.tel,
            id:info.id
          })
          await this.updateList()
        } else {
          const formData = new FormData();
          formData.append("name",info.name);
          formData.append("tel",info.tel);
          const res = await this.contactAxios.post("/contact/new/form",formData);
          ( res.data.code === OK ) && (info.id = res.data.data.id);
          await this.updateList()
        }

        this.chosenContactId = info.id;
      },

      // 删除联系人
      async onDelete(info) {
        this.showEdit = false;
        await this.contactAxios.delete("/contact",{
          params:{
            id:info.id
          }
        })
        this.updateList()
        if (this.chosenContactId === info.id) {
          this.chosenContactId = null;
        }
      },

      //更新list列表
      async updateList(){
        const res = await this.contactAxios({
          url:"/contactList",
          method:"get"
        });
        if(res.data.code === OK){
          this.list = res.data.data
        }
      }
    },

    components:{
      [ContactCard.name]:ContactCard,
      [ContactList.name]:ContactList,
      [ContactEdit.name]:ContactEdit,
      [Popup.name]:Popup
    },

    created(){
      this.contactAxios = axios.create({
        baseURL:"http://localhost:9000/api",
        timeout:15000
      })
    },
    mounted(){
      this.updateList()
    }
  };
</script>

<style scoped>

</style>
