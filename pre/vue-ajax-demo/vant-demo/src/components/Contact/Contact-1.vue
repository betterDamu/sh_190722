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
    import axios from "axios";
    const OK = 200;
    export default {
        data() {
            return {
                contactAxios:null,
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
                const contactList =  await this.contactAxios.get("/contactList");
                if(contactList.data.code === OK){
                    this.list = contactList.data.data
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
                    // this.list = this.list.map(item => item.id === info.id ? info : item);
                    await this.contactAxios.put("/msite/edit",info)
                    await this.getContactList()
                    this.chosenContactId = info.id;
                } else {
                    let infoForm = new FormData()
                    infoForm.append("name",info.name)
                    infoForm.append("tel",info.tel)
                    const newContact =  await this.contactAxios.post("/msite/new/form",infoForm);
                    await this.getContactList()
                    this.chosenContactId = newContact.data.data.id;
                }

            },

            // 删除联系人
            async onDelete(info) {
                this.showEdit = false;
                // this.list = this.list.filter(item => item.id !== info.id);
                await this.contactAxios.delete("/msite",{
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
        created(){
            this.contactAxios = axios.create({
                baseURL:"http://localhost:9000/api",
                timeout:5000
            })
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