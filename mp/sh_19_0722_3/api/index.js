import store from "../utils/store.js";
export default{
  //获取openid的接口
  getOpenId: `/wx_users/getOpenId`,
  //用户信息入库的接口
  saveUserInfo(){
    // 这个uid才会有效
    const uid = store.getItem("uid", "userInfo");
    return `/wx_users/${uid}/saveUserInfo`;
  },
  //获取最新一期的期刊
  getLatest:"/wx_journals/latest",
  //点赞接口
  //取消点赞接口
  favs(journalId){
    return `/wx_users/${journalId}/like`  
  },
  //列出用户喜欢过的期刊
  likeJournals:"/wx_users/journalsLikes",
  //拿实时的疫情的信息
  getInfoForepidemic:"/api?version=epidemic&appid=45521934&appsecret=Bhove2gJ",
  getStats:"/api/stats"
}