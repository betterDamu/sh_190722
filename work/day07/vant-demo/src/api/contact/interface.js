export default {
  getContactList: {
    url: "/contactList",
    method: "get"
  },
  addContactByForm: {
    url:"/contact/new/form",
    method: "post",
    isForm: true // 接口对数据类型的一个要求!!!
  },
  addContactByJson:{
    url:"/contact/new/json",
      method:"post"
  },
  updateContact:{
    url:"/contact/edit",
    method:"put"
  },
  delContact:{
    url:"/contact",
    method: "delete"
  }
}
