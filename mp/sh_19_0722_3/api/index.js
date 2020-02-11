import store from "../utils/store.js";
// uid 到底能不能获取到  uid 是获取不到的
// const uid = store.getItem("uid", "userInfo");
export default{
  getOpenId: `/wx_users/getOpenId`,
  saveUserInfo(){
    // 这个uid才会有效
    const uid = store.getItem("uid", "userInfo");
    return `/wx_users/${uid}/saveUserInfo`;
  }
}