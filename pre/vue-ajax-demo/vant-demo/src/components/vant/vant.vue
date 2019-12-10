<template>
    <div>
        <!-- 联系人卡片 -->
        <van-contact-card
                type="add"
                name="李沛华"
                tel="13838384386"
                @click="showList = true"/>
        <!-- 联系人列表 -->
        <van-popup v-model="showList" position="bottom">
            <van-contact-list
                    v-model="chosenContactId"
                    :list="list"
                    @add="onAdd"
                    @edit="onEdit"
                    @select="onSelect"/>
        </van-popup>

        <!-- 联系人编辑 -->
        <van-popup v-model="showEdit" position="bottom">
            <van-contact-edit
                    :contact-info="editingContact"
                    :is-edit="isEdit"/>
        </van-popup>

    </div>
</template>

<script>
    import { ContactCard, ContactList, ContactEdit, Popup } from 'vant';
    export default {
        name: "vant",
        data(){
          return {
              showList:false,
              showEdit:false,
              isEdit:false,
              chosenContactId:1,
              editingContact: {},
              list:[{
                  id:1,
                  name:"damu",
                  tel:110
              }]
          }
        },
        methods:{
            onAdd(){
                this.showEdit = true
                this.isEdit = false
            },
            onEdit(item){
                this.showEdit = true
                this.isEdit = true
                this.editingContact = item;
            },
            onSelect(item){console.log("onSelect",item)},
        },
        components:{
            [ContactCard.name]:ContactCard,
            [ContactList.name]:ContactList,
            [ContactEdit.name]:ContactEdit,
            [Popup.name]:Popup
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>