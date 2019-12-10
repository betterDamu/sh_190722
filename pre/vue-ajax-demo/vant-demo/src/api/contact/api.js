const API={
    getContactList:{
        url: "/contactList",
        method:"get",
        isForm:false
    },
    newContactJson:{
        url: "/msite/new/json",
        method:"post",
        isForm:false
    },
    newContactForm:{
        url: "/msite/new/form",
        method:"post",
        isForm:true
    },
    editContact:{
        url: "/msite/edit",
        method:"put",
        isForm:false
    },
    delContact:{
        url: "/msite",
        method:"delete",
        isForm:false
    }
}

export default API