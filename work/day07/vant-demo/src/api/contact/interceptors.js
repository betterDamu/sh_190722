import axios from "axios"
import { Toast } from 'vant'
const contactAxios = axios.create({
  baseURL:"http://localhost:9000/api",
  timeout:15000
})


contactAxios.interceptors.request.use(function (config) {
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    duration:0
  });
  return config;
}, function (error) {
  return Promise.reject(error);
});


contactAxios.interceptors.response.use(function (response) {
  Toast.clear();
  Toast.success("success");
  return response;
}, function (error) {
  Toast.clear();
  Toast.fail("fail");
  return Promise.reject(error);
});


export default contactAxios
