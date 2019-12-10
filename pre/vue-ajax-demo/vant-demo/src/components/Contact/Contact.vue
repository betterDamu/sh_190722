<template>
    <div>
        <!-- 联系人卡片 -->
        <van-contact-card
                :type="cardType"
                :name="currentContact.name"
                :tel="currentContact.tel"
                @click="showList = true"
        />

        <!-- 联系人列表 -->
        <van-popup v-model="showList" position="bottom">
            <van-contact-list
                    v-model="chosenContactId"
                    :list="list"
                    @add="onAdd"
                    @edit="onEdit"
                    @select="onSelect"
            />
        </van-popup>

        <!-- 联系人编辑 -->
        <van-popup v-model="showEdit" position="bottom">
            <van-contact-edit
                    :contact-info="editingContact"
                    :is-edit="isEdit"
                    @save="onSave"
                    @delete="onDelete"
            />
        </van-popup>
    </div>
</template>

<script>
    import { ContactCard, ContactList, ContactEdit ,Popup} from 'vant';
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
            //每次读写数据库都要执行的查询
            async getContactList(){
                // 请求list数据
                const contactList =  await this.$http.contact.getContactList();
                if(contactList.code === OK){
                    this.list = contactList.data
                }
            },
            // 添加联系人
            onAdd() {
                this.editingContact = { };// 避免编辑之后在新增出现脏数据的情况!!!
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
                    await this.$http.contact.editContact(info)
                    await this.getContactList()
                    this.chosenContactId = info.id;
                } else {
                    const newContact =  await this.$http.contact.newContactForm(info)
                    await this.getContactList()
                    this.chosenContactId = newContact.data.id;
                }

            },

            // 删除联系人
            async onDelete(info) {
                this.showEdit = false;
                await this.$http.contact.delContact({},{
                    params:{
                        id:info.id
                    }
                })
                if (this.chosenContactId === info.id) {
                    this.chosenContactId = null;
                }
                await this.getContactList()
            }
        },
        components:{
            [ContactCard.name]:ContactCard,
            [ContactList.name]:ContactList,
            [ContactEdit.name]:ContactEdit,
            [Popup.name]:Popup
        },
        mounted(){
            this.getContactList()
        }
    };
</script>

<style scoped>
    .van-popup{
        height: 100%;
    }
</style>