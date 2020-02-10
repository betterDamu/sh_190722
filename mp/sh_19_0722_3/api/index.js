import store from "../utils/store.js";
const uid = store.getItem("uid", "userInfo");
export default{
  getOpenId: `/wx_users/getOpenId`,
  saveUserInfo: `/wx_users/${uid}/saveUserInfo`
}