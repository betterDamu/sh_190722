<template>
  <div>
    <van-contact-card
      :type="cardType"
      :name="currentContact.name"
      :tel="currentContact.tel"
      @click="showList = true"
    ></van-contact-card>
    <van-popup v-model="showList" position="bottom">
      <van-contact-list
        v-model="chosenContactId"
        :list="list"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelect"
      ></van-contact-list>
    </van-popup>
    <van-popup v-model="showEdit" position="bottom">
      <van-contact-edit
        :contact-info="editingContact"
        :is-edit="isEdit"
        @save="onSave"
        @delete="onDelete"
      ></van-contact-edit>
    </van-popup>
  </div>
</template>

<script>
  import api from "@/api"
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
          await api.contact.updateContact({
            name:info.name,
            tel:info.tel,
            id:info.id
          })
          await this.updateList()
        } else {
          const res = await api.contact.addContactByForm({
            name:info.name,
            tel:info.tel
          });
          ( res.data.code === OK ) && (info.id = res.data.data.id);
          await this.updateList()
        }

        this.chosenContactId = info.id;
      },

      // 删除联系人
      async onDelete(info) {
        this.showEdit = false;
        await api.contact.delContact({id:info.id})
        //避免chosenContactId变为脏数据
        if (this.chosenContactId === info.id) {
          this.chosenContactId = null;
        }
        await this.updateList()

      },

      //更新list列表
      async updateList(){
        const res = await api.contact.getContactList();
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

    mounted(){
      this.updateList()
    }
  };
</script>

<style scoped>

</style>
